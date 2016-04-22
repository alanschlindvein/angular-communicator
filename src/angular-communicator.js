angular
	.module('AngularCommunicator', [])
	.provider('angularCommunicatorService', function() {

		var registeredCallbacks = {};

		this.$get = ['$rootScope', '$exceptionHandler', function($rootScope, $exceptionHandler) {

			var registerCallback = function(namespace, callback) {
				if(!registeredCallbacks[namespace]) {
					registeredCallbacks[namespace] = [];
				}
				registeredCallbacks[namespace].push(callback);
				return function() {
					var indexOfCallback = registeredCallbacks[namespace].indexOf(callback);
					(indexOfCallback !== -1) && (registeredCallbacks[namespace][indexOfCallback] = null);
				};
			};

			var removeFromCallback = function(namespace) {
				delete registeredCallbacks[namespace]
			};

			var execCallback = function(namespace, params) {
				if(!registeredCallbacks[namespace]) { return; }
				for(var i=0; i < registeredCallbacks[namespace].length; i++) {
					if(!registeredCallbacks[namespace][i]) {
						registeredCallbacks[namespace].splice(i, 1);
						i--;
						continue;
					}
					try {
						registeredCallbacks[namespace][i](params);
					} catch(e) {
						$exceptionHandler(e);
					}
				}
			};

			var clearAllBacks = function() {
				registeredCallbacks = {};
			};

			return {
				on: registerCallback,
				remove: removeFromCallback,
				exec: execCallback,
				clearAll: clearAllBacks
			};
		}];
	});