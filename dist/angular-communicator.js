/**
 * An Angular module that gives you a way to share messages among modules
 * @version v0.4.0 - 2016-04-25
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
			if(!reg[splitName[0]]) {
				reg[splitName[0]] = { listeners: [] };
			}
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

		this.$get = ['$rootScope', '$exceptionHandler', function($rootScope, $exceptionHandler) {

			var registerHierarchicalListener = function(name, listener) {
				buildHierarchicalStructure(registeredListeners, name.split(':'), listener);
				return function() {
					unRegisterListener(registeredListeners, name.split(':'));
				}
			};

			var removeFromRegisterListeners = function(name) {
				if(isEmptyObject(registeredListeners)) { return; }
				unRegisterListener(registeredListeners, name.split(':'))
			};

			var execListener = function(name, params) {
				if(isEmptyObject(registeredListeners)) { return; }
				findNodeListenersToExecute(registeredListeners, name.split(':'), params, $exceptionHandler);
			};

			var clearAllListeners = function() {
				registeredListeners = {};
			};

			return {
				on: registerHierarchicalListener,
				remove: removeFromRegisterListeners,
				exec: execListener,
				clearAll: clearAllListeners
			};
		}];
	});})(window, window.angular);