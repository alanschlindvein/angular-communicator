/**
 * An Angular module that gives you a way to share messages among modules
 * @version v0.5.0 - 2016-04-28
 * @link https://github.com/alanschlindvein/angular-communicator
 * @author alanschlindvein <alansaraujo.schlindvein@gmail.com>
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
(function (window, angular) {
angular
	.module('AngularCommunicator', [])
	.provider('angularCommunicatorService', function() {

		var registeredListeners = {};

		function buildHierarchicalStructure(reg, splitName, callback) {
			(!reg[splitName[0]]) && (reg[splitName[0]] = { listeners: [] });
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
				reg[splitName[0]] = { listeners: [] };
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
			for(var i=0; i < reg.listeners.length; i++) {
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

		function getKey(key) {
			return typeof key === 'function' ? key() : key;
		}

		function isInvalidKey(key) {
			return (!key || ['function', 'string'].indexOf(typeof key) === -1);
		}

		function areNotAllStrings(keys) {
			return keys.some(function(key) {
				return typeof key !== 'string';
			});
		}

		this.$get = ['$exceptionHandler', function($exceptionHandler) {

			var registerHierarchicalListener = function(key, listener) {
				if(arguments.length < 2) { throw 'Invalid number of arguments'; }
				if(isInvalidKey(key)) { throw 'Invalid key'; }
				var name = getKey(key);
				buildHierarchicalStructure(registeredListeners, name.split(':'), listener);
				return function() {
					unRegisterListener(registeredListeners, name.split(':'));
				}
			};

			var removeRegisteredListener = function(key) {
				if(isInvalidKey(key)) { throw 'Invalid key'; }
				if(isEmptyObject(registeredListeners)) { return; }
				unRegisterListener(registeredListeners, getKey(key).split(':'))
			};

			var execListeners = function(key, params) {
				if(isInvalidKey(key)) { throw 'Invalid key'; }
				if(isEmptyObject(registeredListeners)) { return; }
				findNodeListenersToExecute(registeredListeners, getKey(key).split(':'), params, $exceptionHandler);
			};

			var execGroupListeners = function(keys, params) {
				if(isEmptyObject(registeredListeners)) { return; }
				if(!Array.isArray(keys) || !Array.isArray(params)) { throw 'Invalid argument types'; }
				if(Array.isArray(keys) && areNotAllStrings(keys)) { throw 'All keys must be strings'; }
				for(var i=0; i < keys.length; i++) {
					findNodeListenersToExecute(registeredListeners, keys[i].split(':'), params[i] || params[0], $exceptionHandler);
				}
			};

			var clearAllListeners = function() {
				registeredListeners = {};
			};

			return {
				on: registerHierarchicalListener,
				remove: removeRegisteredListener,
				exec: execListeners,
				execQueue: execGroupListeners,
				clearAll: clearAllListeners
			};
		}];
	});})(window, window.angular);