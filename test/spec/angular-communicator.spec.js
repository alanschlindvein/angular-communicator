'use strict';

describe('Angular Communicator', function() {
	var fooForSpy;

	beforeEach(module('AngularCommunicator'));
	beforeEach(function() {
		fooForSpy = {
			print: function() {
				console.log('print');
			},
			save: function() {
				console.log('save');
			}
		};
		spyOn(fooForSpy, 'print').and.callThrough();
		spyOn(fooForSpy, 'save').and.callThrough();
	});

	it('should be able to pass parameters through methods', inject(function(angularCommunicatorService) {
		angularCommunicatorService.on('foo', function(counter) {
			expect(counter).toBe(0);
		});
		angularCommunicatorService.exec('foo', 0);
	}));

	it('should call multiples functions to same message', inject(function(angularCommunicatorService) {
		angularCommunicatorService.on('foo', function(counter) {
			expect(counter).toBe(0);
		});
		angularCommunicatorService.on('foo', function(counter) {
			expect(counter).toBe(0);
		});
		angularCommunicatorService.exec('foo', 0);
	}));

	it('should un-register callbacks', inject(function(angularCommunicatorService) {
		var cleanUp = angularCommunicatorService.on('foo:fo', fooForSpy.print);
		cleanUp();

		angularCommunicatorService.on('foo', function(counter) {
			expect(counter).toBe(0);
		});

		angularCommunicatorService.exec('foo:fo');
		angularCommunicatorService.exec('foo', 0);

		expect(fooForSpy.print).not.toHaveBeenCalled();
	}));

	it('should be able to call multiples functions through hierarchical nodes', inject(function(angularCommunicatorService) {

		angularCommunicatorService.on('foo', function(param) {
			expect(param.toFoo).toBe(1);
			expect(param.toBar).toBe(2);
		});
		angularCommunicatorService.on('foo:fo', function(param) {
			expect(param.toFoo).toBe(1);
			expect(param.toBar).toBe(2);
		});

		angularCommunicatorService.exec('foo', {toFoo: 1, toBar: 2});
	}));

	it('should call only last level of hierarchy', inject(function(angularCommunicatorService) {

		angularCommunicatorService.on('foo', function(param) {
			fooForSpy.print();
		});
		angularCommunicatorService.on('foo:fo', function(param) {
			fooForSpy.save();
		});
		angularCommunicatorService.on('foo:fo:ba', function(param) {
			expect(param.toFoo).toBe(1);
			expect(param.toBar).toBe(2);
		});

		angularCommunicatorService.exec('foo:fo:ba', {toFoo: 1, toBar: 2});

		expect(fooForSpy.print).not.toHaveBeenCalled();
		expect(fooForSpy.save).not.toHaveBeenCalled();
	}));

	it('should remove one namespace', inject(function(angularCommunicatorService) {
		angularCommunicatorService.on('foo:print', fooForSpy.print);
		angularCommunicatorService.on('foo:save', fooForSpy.save);

		angularCommunicatorService.remove('foo:print');

		angularCommunicatorService.exec('foo');

		expect(fooForSpy.print).not.toHaveBeenCalled();
		expect(fooForSpy.save).toHaveBeenCalled();
	}));

	it('should remove all listeners', inject(function(angularCommunicatorService) {
		angularCommunicatorService.on('foo:print', fooForSpy.print);
		angularCommunicatorService.on('foo:save', fooForSpy.save);

		angularCommunicatorService.clearAll();

		angularCommunicatorService.exec('foo:print');
		angularCommunicatorService.exec('foo:save');

		expect(fooForSpy.print).not.toHaveBeenCalled();
		expect(fooForSpy.save).not.toHaveBeenCalled();
	}));
});