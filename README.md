angular-communicator
=====================
An Angular module that gives you a way to share messages among modules.

[![NPM version][npm-image]][npm-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]

You can define the listeners as a tree and execute them as you wish, nice and easy.

##Table of contents:
- [API Documentation](#api-documentation)
 - [on](#on)
 - [exec](#exec)
 - [execGroup](#execgroup)
 - [remove](#remove)
 - [clearAll](#clearall)

##API Documentation
##on
Register a listener and define a callback to it.  
```js
myApp.controller('MainCtrl', function($scope, angularCommunicatorService) {
  //...
  angularCommunicatorService.on('foo', function(obj) {
     //...
  });
  //...
});
```
Add ':' to name to specify a hierarchy.
```js
myApp.controller('MainCtrl', function($scope, angularCommunicatorService) {
  //...
  angularCommunicatorService.on('foo', function(obj) {
     //...
  });
  //...
  angularCommunicatorService.on('foo:update', function(obj) {
     //...
  });
  //...
  angularCommunicatorService.on('bar:bee:save', function(obj) {
     //...
  });
});
```
**On** returns a clear function to control when the listener needs to be removed.
```js
myApp.controller('MainCtrl', function($scope, angularCommunicatorService) {
  //...
  var cleanUp = angularCommunicatorService.on('update',function(obj) {
     //...
  });
  //...
  cleanUp();
  //...
});
```
###exec
Execute all listeners.
```js
myApp.controller('MainCtrl', function($scope, angularCommunicatorService) {
  //...
  angularCommunicatorService.exec('foo', {update: true});
  //...
});
```
If you have a tree, you can execute just whatever you want to.
```js
myApp.controller('MainCtrl', function($scope, angularCommunicatorService) {
  //...
  angularCommunicatorService.exec('foo:update', {update: true});
  //...
});
```
**Execute only the level you want to.**
```js
myApp.controller('MainCtrl', function($scope, angularCommunicatorService) {
  //...
  angularCommunicatorService.on('foo:bar', Bar());
  angularCommunicatorService.on('foo:bee', Boo());
  angularCommunicatorService.on('foo:bar:update', Update());
  angularCommunicatorService.on('foo:bar:save', Save());
  //...
  angularCommunicatorService.exec('foo:bar', {update: true});
  //...
});
```
You can execute the listeners of a level just telling the parent level name.
###execGroup
Execute multiples listeners at once.
```js
myApp.controller('MainCtrl', function($scope, angularCommunicatorService) {
  //...
  angularCommunicatorService.exec(['update', 'save', 'bar:save'], [{update: true}]);
  //...
});
```
Pass a parameter to each listener. But listeners name array and args array must have the same size.
```js
myApp.controller('MainCtrl', function($scope, angularCommunicatorService) {
  //...
  angularCommunicatorService.exec(['update', 'save', 'bar:save'], [{update: true}, {update: false}, {name: 'bar.save'}]);
  //...
});
```
###remove
Removes an event from communicator.
```js
myApp.controller('MainCtrl', function($scope, angularCommunicatorService) {
  //...
  angularCommunicatorService.remove('update');
  //...
});
```
##clearAll
Removes all events from communicator.
```js
myApp.controller('MainCtrl', function($scope, angularCommunicatorService) {
  //...
  angularCommunicatorService.clearAll();
  //...
});
```

[npm-image]: https://img.shields.io/npm/v/angular-communicator.svg?style=flat-square
[npm-url]: https://npmjs.org/package/angular-communicator
[license-image]: http://img.shields.io/npm/l/angular-communicator.svg?style=flat-square
[license-url]: LICENSE
[downloads-image]: http://img.shields.io/npm/dm/angular-communicator.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/angular-communicator
