angular
  .module('AngularCommunicator', [])
  .provider('angularCommunicatorService', function() {

    var registeredListeners = {};

    function buildHierarchicalStructure(reg, splitName, callback) {
      (!reg[splitName[0]]) && (reg[splitName[0]] = {listeners: []});
      if(splitName.length === 1) {
        reg[splitName[0]].listeners.push(callback);
        return;
      }
      var registered = reg[splitName[0]];
      splitName.splice(0, 1);
      buildHierarchicalStructure(registered, splitName, callback);
    }

    function unRegisterListener(reg, splitName) {
      if(splitName.length === 1) {
        reg[splitName[0]] = {listeners: []};
        return;
      }
      var registered = reg[splitName[0]];
      splitName.splice(0, 1);
      unRegisterListener(registered, splitName);
    }

    function findNodeListenersToExecute(reg, splitName, params, $exceptionHandler) {
      if(splitName.length === 1) {
        execNodeListeners(reg[splitName[0]], params, $exceptionHandler);
        return;
      }
      var registered = reg[splitName[0]];
      splitName.splice(0, 1);
      findNodeListenersToExecute(registered, splitName, params);
    }

    function execNodeListeners(reg, params, $exceptionHandler) {
      for(var i = 0; i < reg.listeners.length; i++) {
        try {
          reg.listeners[i](params);
        } catch(e) {
          $exceptionHandler(e);
        }
      }
      var children = Object.keys(reg).filter(function(elem) {
        return elem !== 'listeners';
      });
      for(var child = 0; child < children.length; child++) {
        execNodeListeners(reg[children[child]], params, $exceptionHandler);
      }
    }

    function isEmptyObject(obj) {
      return Object.keys(obj).length === 0 && JSON.stringify(obj) === JSON.stringify({});
    }

    function isInvalidKey(key) {
      return typeof key !== 'string';
    }

    this.$get = ['$exceptionHandler', function($exceptionHandler) {

      var registerHierarchicalListener = function(key, listener) {
        if(arguments.length < 2) {
          throw 'Invalid number of arguments';
        }
        if(isInvalidKey(key)) {
          throw 'Invalid key';
        }
        buildHierarchicalStructure(registeredListeners, key.split(':'), listener);
        return function() {
          unRegisterListener(registeredListeners, key.split(':'));
        }
      };

      var removeRegisteredListener = function(key) {
        if(isInvalidKey(key)) {
          throw 'Invalid key';
        }
        if(isEmptyObject(registeredListeners)) {
          return;
        }
        unRegisterListener(registeredListeners, key.split(':'))
      };

      var execGroupedListeners = function(keys, params) {
        if(Array.isArray(keys)) {
          if(isEmptyObject(registeredListeners)) {
            return;
          }
          var args = Array.isArray(params) ? params : [params];
          for(var i = 0; i < keys.length; i++) {
            findNodeListenersToExecute(registeredListeners, keys[i].split(':'), args[i] || args[0], $exceptionHandler);
          }
          return;
        }
        if(isInvalidKey(keys)) {
          throw 'Invalid key';
        }
        if(isEmptyObject(registeredListeners)) {
          return;
        }
        findNodeListenersToExecute(registeredListeners, keys.split(':'), params, $exceptionHandler);
      };

      var clearListeners = function() {
        registeredListeners = {};
      };

      return {
        on: registerHierarchicalListener,
        remove: removeRegisteredListener,
        exec: execGroupedListeners,
        clear: clearListeners
      };
    }];
  });
