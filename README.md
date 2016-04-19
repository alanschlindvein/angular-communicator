angular-communicator
=====================
An Angular module that gives you a way to share messages among modules.

##Table of contents:
- [API Documentation](#api-documentation)
 - [on](#on)
 - [exec](#exec)
 - [remove](#remove)
 - [clearAll](#clearall)

##API Documentation
##on
Adds an event and applies a callback to it.  
**on(name, func[args]):**
```js
myApp.controller('MainCtrl', function($scope, angularCommunicatorService) {
  //...
  angularCommunicatorService.on('update', function(obj) {
     //...
  });
  //...
});
```
###exec
Dispatches an event **name** notifying the registered listeners.  
**exec(name, [args]):**
```js
myApp.controller('MainCtrl', function($scope, angularCommunicatorService) {
  //...
  angularCommunicatorService.exec('update', {update: true});
  //...
});
```
###remove
Removes an event from communicator.
**remove(name):**
```js
myApp.controller('MainCtrl', function($scope, angularCommunicatorService) {
  //...
  angularCommunicatorService.remove('update');
  //...
});
```
##clearAll
Removes all events from communicator.
**clearAll():**
```js
myApp.controller('MainCtrl', function($scope, angularCommunicatorService) {
  //...
  angularCommunicatorService.clearAll();
  //...
});
```
