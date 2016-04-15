angular-messenger
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
myApp.controller('MainCtrl', function($scope, angularMessengerService) {
  //...
  angularMessengerService.on('update', function() {
     //...
  });
  //...
});
```
###exec
Dispatches an event **name** notifying the registered listeners.  
**exec(name, [args]):**
```js
myApp.controller('MainCtrl', function($scope, angularMessengerService) {
  //...
  angularMessengerService.exec('update', {update: true});
  //...
});
```
###remove
Removes an event from messenger.
**remove(name):**
```js
myApp.controller('MainCtrl', function($scope, angularMessengerService) {
  //...
  angularMessengerService.remove('update');
  //...
});
```
##clearAll
Removes all events from messenger.
**clearAll():**
```js
myApp.controller('MainCtrl', function($scope, angularMessengerService) {
  //...
  angularMessengerService.clearAll();
  //...
});
```