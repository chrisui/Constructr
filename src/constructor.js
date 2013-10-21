// ------------------------------------------------------------------------
// Provides a base constructor function to create "classes" from.
// IE. Provides the boilerplate for single inheritance in javascript
// Extends prototype chain (Inspiration from Goog & Backbone inherits)
(function(root) {

	'use strict'; // Sanity check
	
	// Basic helper function to extend an object with another
	var extendObj = function(destObj, sourceObj) {
		if (sourceObj) {
			for (var property in sourceObj) {
				if (sourceObj.hasOwnProperty(property)) {
					destObj[property] = sourceObj[property]
				}
			}
		}
		
		return destObj;
	};

	// Shared empty constructor function to aid in prototype-chain creation.
	var ctor = function() {};

	// Our global constructor function
	var Constructor = function() {
		// Make sure nobody has called a constructor as a function (Ie. without using 'new')
		if (!(this instanceof Constructor)) {
			throw new Error('Constructor called as function.');
		}

		// Call our initialize method
		this.initialize.apply(this, arguments);
	};

	// Setup our base Constructor prototype with a default initialize method
	Constructor.prototype.initialize = function() {};

	// Correctly setup the prototype chain for sub classes while optionally passing
	// new prototype and static properties to be mixed in with the new child
	var inherits = function(parent, protoProps, staticProps) {
		// Child will always call the parents constructor
		var child = function(){ parent.apply(this, arguments); };

		// Inherit prototype properties from parent
		// Set the prototype chain to inherit without calling parent's constructor function.
		ctor.prototype = parent.prototype;
		child.prototype = new ctor();

		// Add prototype properties (instance properties) to the subclass if supplied.
		extendObj(child.prototype, protoProps);

		// Add static properties to the constructor function, if supplied.
		extendObj(child, staticProps);

		// Correctly set child's `prototype.constructor`.
		child.prototype.constructor = child;

		// Set a convenience property in case the parent's prototype is needed later.
		child.__super__ = parent.prototype;
		// Always have the static 'extend' method on constructors
		child.extend = parent.extend;
		// Ensure the mixes method is always copied
		child.mixes = parent.mixes;
		// Ensure the def method is always copied
		child.def = parent.def;

		return child;
	};

	// Create a new constructor from this prototype
	Constructor.extend = function(protoProps, staticProps) {
		return inherits(this, protoProps, staticProps);
	};
	
	// Create a new constructor inheriting from given constructor
	Constructor.extendFrom = function(extendFrom, protoProps, staticProps) {
		return inherits(extendFrom, protoProps, staticProps);
	};

	// Mix in an objects properties to this constructor's prototype
	Constructor.mixes = function() {
		// Loop through all arguments and extend the objects prototype with them (each argument should be an object)
		var args = Array.prototype.slice.call(arguments); // convert arguments to array
		var numArgs = args.length;
		for (var i = 0; i < numArgs; i++) {
			extendObj(this.prototype, args[i]);
		}

		return this;
	};

	// Define a property on this constructor prototype (nicer shortcut to Object.defineProperty)
	// or staticly on the constructor if true is passed for isStatic
	Constructor.def = function(property, definition, isStatic) {
		// If property is an object use defineProperties
		if (property === Object(property)) {
			definition = property;
			isStatic = definition;

			if (isStatic)
				Object.defineProperties(this, definition);
			else
				Object.defineProperties(this.prototype, definition);

			return;
		}

		if (isStatic)
			Object.defineProperty(this, property, definition);
		else
			Object.defineProperty(this.prototype, property, definition);
	};

	// Finally expose our public Constructor
	// * Browser: Dumps 'Constructor' into global namespace. This is intended.
	// * Node (exports): Exports correctly.
	if (typeof exports !== 'undefined') {
    	exports = Constructor;
    } else {
    	root.Constructor = Constructor;
    }


})(this);