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
			},
			update: function() {
				console.log('update');
			}
		};
		spyOn(fooForSpy, 'print').and.callThrough();
		spyOn(fooForSpy, 'save').and.callThrough();
		spyOn(fooForSpy, 'update').and.callThrough();
	});

	it('should be able to pass parameters to methods', inject(function(angularCommunicatorService) {
		angularCommunicatorService.on('foo', function(counter) {
			expect(counter).toBe(0);
		});
		angularCommunicatorService.exec('foo', 0);
	}));

	it('should be able to call methods without passing parameters', inject(function(angularCommunicatorService) {
		angularCommunicatorService.on('foo', fooForSpy.print);
		angularCommunicatorService.exec('foo');

		expect(fooForSpy.print).toHaveBeenCalled();
	}));

	it('should not call methods without a name', inject(function(angularCommunicatorService) {
		angularCommunicatorService.on('foo', fooForSpy.print);
		angularCommunicatorService.exec();
		angularCommunicatorService.exec('');
		angularCommunicatorService.exec(0);

		expect(fooForSpy.print).not.toHaveBeenCalled();
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

	it('should call multiples functions', inject(function(angularCommunicatorService) {
		angularCommunicatorService.on('foo:bar', function(counter) {
			expect(counter).toBe(0);
		});
		angularCommunicatorService.on('foo:foo', function(counter) {
			expect(counter).toBe(1);
		});
		angularCommunicatorService.execGroup(['foo:bar', 'foo:foo'], [0, 1]);
	}));

	it('should call multiples functions using same parameter', inject(function(angularCommunicatorService) {
		angularCommunicatorService.on('foo:bar', function(counter) {
			expect(counter).toBe(0);
		});
		angularCommunicatorService.on('foo:foo', function(counter) {
			expect(counter).toBe(0);
		});
		angularCommunicatorService.execGroup(['foo:bar', 'foo:foo'], [0]);
	}));

	it('should not call multiples functions using same parameter', inject(function(angularCommunicatorService) {
		angularCommunicatorService.on('foo:print', fooForSpy.print);
		angularCommunicatorService.on('foo:save', fooForSpy.save);

		angularCommunicatorService.execGroup('foo:print', [0]);
		angularCommunicatorService.execGroup('foo:save', 'save');

		expect(fooForSpy.print).not.toHaveBeenCalled();
		expect(fooForSpy.save).not.toHaveBeenCalled();
	}));

	/*it('should not call multiples functions using wrong length of parameters', inject(function(angularCommunicatorService) {
		angularCommunicatorService.on('foo:print', fooForSpy.print);
		angularCommunicatorService.on('foo:save', fooForSpy.save);
		angularCommunicatorService.on('foo:update', fooForSpy.update);

		angularCommunicatorService.execGroup(['foo:print', 'foo:save', 'foo:update'], [0, 2]);

		expect(fooForSpy.print).not.toHaveBeenCalled();
		expect(fooForSpy.save).not.toHaveBeenCalled();
		expect(fooForSpy.update).not.toHaveBeenCalled();
	}));*/

	it('should un-register listeners', inject(function(angularCommunicatorService) {
		var cleanUp = angularCommunicatorService.on('foo:fo', fooForSpy.print);
		cleanUp();

		angularCommunicatorService.on('foo', function(counter) {
			expect(counter).toBe(0);
		});

		angularCommunicatorService.exec('foo:fo');
		angularCommunicatorService.exec('foo', 0);

		expect(fooForSpy.print).not.toHaveBeenCalled();
	}));

	it('should execute top-down callbacks', inject(function(angularCommunicatorService) {

		angularCommunicatorService.on('foo', function(param) {
			expect(param.toFoo).toBe(1);
			expect(param.toBar).toBe(2);
		});
		angularCommunicatorService.on('foo:fo', function(param) {
			expect(param.toFoo).toBe(1);
			expect(param.toBar).toBe(2);
		});
		angularCommunicatorService.on('foo:fo:ba', function(param) {
			expect(param.toFoo).toBe(1);
			expect(param.toBar).toBe(2);
		});

		angularCommunicatorService.exec('foo', {toFoo: 1, toBar: 2});
	}));

	it('should call a specific level of the hierarchy', inject(function(angularCommunicatorService) {

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

	it('should remove a specific listener', inject(function(angularCommunicatorService) {
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