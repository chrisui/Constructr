define([
	'intern!tdd',
	'intern/chai!assert',
	'intern/order!src/constructor'
], function (tdd, assert) {

	with (tdd) {

		suite('test/all', function() {

			var testMixin = {
				returnA: function() { return 'A'; },
				returnB: function() { return 'B'; },
				returnC: function() { return 'C'; }
			};

			// Test basic inheritance (is new child instance instanceof parent constructor?)
			test('Basic Inheritance', function() {

				var TestConstructorA = Constructor.extend();

				assert((new TestConstructorA) instanceof Constructor);

			});

			// Ensure __super__ property is correctly setup
			test('Basic Super', function() {

				var TestConstructorA = Constructor.extend();

				assert(TestConstructorA.__super__ === Constructor.prototype);

			});

			// Test basic inheritance of prototype properties (does child have methods & properties of parent?)
			test('Prototype property Inheritance', function() {

				var BaseClass = Constructor.extend({
				    day: 'Monday',
				    hello: function(text) {
				        return 'Hello '+text+'. It\'s '+this.day+'!';
				    }
				});

				var ClassA = BaseClass.extend();
				var ClassB = BaseClass.extend();

				assert(ClassA.prototype.hello === ClassB.prototype.hello);
				assert(ClassA.prototype.day === ClassB.prototype.day);

			});

			// Test mixins
			test('Mixins', function() {

				var ClassA = Constructor.extend().mixes(testMixin);
				var ClassB = Constructor.extend().mixes(testMixin);

				assert(ClassA.prototype.returnA === ClassB.prototype.returnA);
				assert(ClassA.prototype.returnB === ClassB.prototype.returnB);
				assert(ClassA.prototype.returnC === ClassB.prototype.returnC);

			});

			// Test property definitions (get and set)
			test('Definition', function() {

				var DEFAULT_NAME = 'N/A';
				var NEW_NAME = 'Chris';

				var ClassA = Constructor.extend({
					_myHiddenName: DEFAULT_NAME
				});

				ClassA.def('name', {
					get: function() { return this._myHiddenName; },
					set: function(value) { return this._myHiddenName = value; }
				});

				var test = new ClassA;

				assert(test.name === DEFAULT_NAME, 'Getting name failed');

				test.name = NEW_NAME;

				assert(test.name === NEW_NAME, 'Get or set name failed');



			});

		});

	}

});