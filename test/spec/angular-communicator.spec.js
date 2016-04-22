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

	it('should be able to call multiples functions to through hierarchical nodes', inject(function(angularCommunicatorService) {

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
});