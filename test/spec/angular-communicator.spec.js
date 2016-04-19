'use strict';

describe('Angular Communicator', function() {
	var fooForSpy;

	beforeEach(module('AngularCommunicator'));
	beforeEach(function() {
		fooForSpy = {
			print: function() {
				console.log('print');
			}
		};
		spyOn(fooForSpy, 'print').and.callThrough();
	});

	it('should be able pass parameter to through methods', inject(function(angularCommunicatorService) {
    angularCommunicatorService.on('foo', function(counter) {
			expect(counter).toBe(0);
		});
    angularCommunicatorService.exec('foo', 0);
	}));

	it('should be able to call multiples function to same namespace', inject(function(angularCommunicatorService) {
    angularCommunicatorService.on('foo', function(param) {
			expect(param.toFoo).toBe(1);
		});
    angularCommunicatorService.on('foo', function(param) {
			expect(param.toBar).toBe(2);
		});

    angularCommunicatorService.exec('foo', {toFoo: 1, toBar: 2});
	}));

	it('should remove one namespace', inject(function(angularCommunicatorService) {
    angularCommunicatorService.on('fooForSpy', fooForSpy.print);

    angularCommunicatorService.remove('fooForSpy');
    angularCommunicatorService.exec('fooForSpy');

		expect(fooForSpy.print).not.toHaveBeenCalled();
	}));
});
