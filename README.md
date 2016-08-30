angular-communicator
=====================
An Angular module that gives you a way to share messages among modules.

[![NPM version][npm-image]][npm-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]

Just as you would do with $on, $emit and $broadcast using [AngularJS](https://docs.angularjs.org/api/ng/type/$rootScope.Scope), you can easily register your listeners and execute them with this simple service. Angular Communicator brings you an awesome feature that allows you define your listeners as a tree and execute them as you wish, nice and easy.

## Table of contents:
- [Get Sarted](#getstarted)
- [API Documentation](#api-documentation)
 - [on](#on)
 - [exec](#exec)
 - [remove](#remove)
 - [clear](#clear)

## Get Sarted
**(1)** You can install angular-communicator using 3 different ways:<br/>
**Git:**
clone & build [this](https://github.com/alanschlindvein/angular-communicator.git) repository<br/>
**Bower:**
```bash
$ bower install angular-communicator --save
```
**npm:**
```bash
$ npm install angular-communicator
```
**(2)** Include `angular-communicator.js` (or `angular-communicator.min.js`) from the [dist](https://github.com/alanschlindvein/angular-communicator/tree/master/dist) directory in your `index.html`, after including Angular itself.

**(3)** Add `'AngularCommunicator'` to your main module's list of dependencies.

When you're done, your setup should look similar to the following:

```html
<!doctype html>
<html ng-app="myApp">
<head>

</head>
<body>
    ...
    <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.5.5/angular.min.js"></script>
    <script src="bower_components/js/angular-communicator.min.js"></script>
    ...
    <script>
        var myApp = angular.module('myApp', ['AngularCommunicator']);

    </script>
    ...
</body>
</html>
```
## API Documentation
## on
Register a listener with its callback function.  
```js
myApp.controller('MainCtrl', function($scope, angularCommunicatorService) {
  //...
  angularCommunicatorService.on('foo', function(obj) {
     //...
  });
  //...
});
```
You can build a tree of listeners adding ':' to specify the hierarchy.
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
  var cleanUp = angularCommunicatorService.on('update', function(obj) {
     //...
  });
  //...
  cleanUp();
  //...
});
```
### exec
Execute all registered listeners.
```js
myApp.controller('MainCtrl', function($scope, angularCommunicatorService) {
  //...
  angularCommunicatorService.exec('foo', {update: true});
  //...
});
```
You can execute the listeners of a level just telling the parent level name.
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

##### Execute multiple listeners at once.
```js
myApp.controller('MainCtrl', function($scope, angularCommunicatorService) {
  //...
  angularCommunicatorService.exec(['update', 'save', 'bar:save'], {update: true});
  //...
});
```
Pass an argument to each listener with an array of arguments.
```js
myApp.controller('MainCtrl', function($scope, angularCommunicatorService) {
  angularCommunicatorService.on('update', function(obj) {
     //obj -> {update: true}
  });
  angularCommunicatorService.on('save', function(obj) {
     //obj -> {save: false}
  });
  angularCommunicatorService.on('bar:save', function(obj) {
     //obj -> {name: 'bar.save'}
  });
  //...
  angularCommunicatorService.exec(['update', 'save', 'bar:save'], [{update: true}, {save: false}, {name: 'bar.save'}]);
  //...
});
```
By default the first argument is passed to the listener whether it doesn't have an correspondent argument.
```js
myApp.controller('MainCtrl', function($scope, angularCommunicatorService) {
  angularCommunicatorService.on('update', function(obj) {
     //obj -> {update: true}
  });
  angularCommunicatorService.on('save', function(obj) {
     //obj -> {save: false}
  });
  angularCommunicatorService.on('bar:save', function(obj) {
     //obj -> {update: true}
  });
  //...
  angularCommunicatorService.exec(['update', 'save', 'bar:save'], [{update: true}, {save: false}]);
  //...
});
```
### remove
Remove an listener from communicator.
```js
myApp.controller('MainCtrl', function($scope, angularCommunicatorService) {
  //...
  angularCommunicatorService.remove('update');
  //...
});
```
### clear
Remove all listeners from communicator.
```js
myApp.controller('MainCtrl', function($scope, angularCommunicatorService) {
  //...
  angularCommunicatorService.clear();
  //...
});
```

[npm-image]: https://img.shields.io/npm/v/angular-communicator.svg?style=flat-square
[npm-url]: https://npmjs.org/package/angular-communicator
[license-image]: http://img.shields.io/npm/l/angular-communicator.svg?style=flat-square
[license-url]: LICENSE
[downloads-image]: http://img.shields.io/npm/dm/angular-communicator.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/angular-communicator
