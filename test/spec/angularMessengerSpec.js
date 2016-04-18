'use strict';

describe('Angular Messenger', function() {
	var fooForSpy;

	beforeEach(module('AngularMessenger'));
	beforeEach(function() {
		fooForSpy = {
			print: function() {
				console.log('print');
			}
		};
		spyOn(fooForSpy, 'print').and.callThrough();
	});

	it('should be able pass parameter to through methods', inject(function(angularMessengerService) {
		angularMessengerService.on('foo', function(counter) {
			expect(counter).toBe(0);
		});
		angularMessengerService.exec('foo', 0);
	}));

	it('should be able to call multiples function to same namespace', inject(function(angularMessengerService) {
		angularMessengerService.on('foo', function(param) {
			expect(param.toFoo).toBe(1);
		});
		angularMessengerService.on('foo', function(param) {
			expect(param.toBar).toBe(2);
		});

		angularMessengerService.exec('foo', {toFoo: 1, toBar: 2});
	}));

	it('should remove one namespace', inject(function(angularMessengerService) {
		angularMessengerService.on('fooForSpy', fooForSpy.print);

		angularMessengerService.remove('fooForSpy');
		angularMessengerService.exec('fooForSpy');

		expect(fooForSpy.print).not.toHaveBeenCalled();
	}));
});
