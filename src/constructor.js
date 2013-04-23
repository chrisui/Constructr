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

		// Inherit static properties from parent.
		extendObj(child, parent);

		// Inherit prototype proeprties from parent
		// Set the prototype chain to inherit from `parent`, without calling
		// `parent`'s constructor function.
		ctor.prototype = parent.prototype;
		child.prototype = new ctor();

		// Add prototype properties (instance properties) to the subclass if supplied.
		if (protoProps) {
			extendObj(child.prototype, protoProps);
		}

		// Add static properties to the constructor function, if supplied.
		if (staticProps) {
			extendObj(child, staticProps);
		}

		// Correctly set child's `prototype.constructor`.
		child.prototype.constructor = child;

		// Set a convenience property in case the parent's prototype is needed later.
		child.__super__ = parent.prototype;
		// Always have the static 'extend' method on constructors
		child.extend = parent.extend;
		// Ensure the mixes method is always copied
		child.mixes = parent.mixes;

		return child;
	};

	// Create a new constructor from this prototype
	Constructor.extend = function(protoProps, staticProps) {
		var child = inherits(this, protoProps, staticProps);

		return child;
	};

	// Mix in an objects properties to this constructor's prototype
	Constructor.mixes = function() {
		// Loop through all arguments and extend the objects prototype with them (each argument should be an object)
		var args = Array.prototype.slice.call(arguments);
		for (var i = 0; i < args.length; i++) {
			extendObj(this.prototype, args[i]);
		}

		return this;
	};

	// Finally expose our public Constructor
	// * Browser: Dumps 'Constructor' into global namespace. This is intended.
	// * Node (exports): Exports correctly..
	if (typeof exports !== 'undefined') {
    	exports = Constructor;
    } else {
    	root.Constructor = Constructor;
    }


})(this);