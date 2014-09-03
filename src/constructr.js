/**
 * Merge properties of sourceObject into destObject (mutates)
 * @param destObject
 * @param sourceObject
 * @returns {Object} Mututated destObject
 */
var extendObj = function(destObject, sourceObject) {
    if (sourceObject)
        for (var property in sourceObject)
            if (sourceObject.hasOwnProperty(property))
                destObject[property] = sourceObject[property];

    return destObject;
};

/**
 * Shared empty constructor function to aid in prototype-chain creation.
 */
var SharedConstructor = function() {};

/**
 * Create a new Constructr from a given constructor function and extending with props given
 * NOTE: Be really careful with this as it can be used as a constructor function itself OR
 *       to create a new constructor function.
 * @param {Function} constructFrom The constructor function to use
 * @param {Object} [protoProps]
 * @param {Object} [staticProps]
 * @returns {Constructr}
 */
var Constructr = function(constructFrom, protoProps, staticProps) {
    if (!(this instanceof Constructr)) {
        return Constructr.createConstruct(constructFrom, protoProps, staticProps);
    }

    // Call our initialize method
    this.initialize.apply(this, arguments);
};

/**
 * Default initialize method
 */
Constructr.prototype.initialize = function() {};

/**
 * Correctly setup the prototype chain for sub classes while optionally passing
 * new prototype and static properties to be mixed in with the new child
 * @return {Constructr}
 */
var inherits = function(child, parent, protoProps, staticProps) {
    // Inherit prototype properties from parent
    // Set the prototype chain to inherit without calling parent's constructor function.
    SharedConstructor.prototype = parent.prototype;
    child.prototype = new SharedConstructor();
    child.prototype.constructor = child;

    // Extend with prototype and static properties
    extendObj(child.prototype, protoProps);
    extendObj(child, staticProps);

    // Set a convenience property in case the parent's prototype is needed later.
    child.__super__ = parent.prototype;

    // Copy references to static methods we want to extend
    child.extend = parent.extend;
    child.mixes = parent.mixes;
    child.def = parent.def;

    return child;
};

/**
 * Extend the parent constructor
 * @param {Object} [protoProps]
 * @param {Object} [staticProps]
 * @returns {Constructr} New constructor with extended prototype from parent
 */
Constructr.extend = function(protoProps, staticProps) {
    var parent = this;

    return inherits(function(){ parent.apply(this, arguments); }, parent, protoProps, staticProps);
};

/**
 * Create a new Constructr from a given parent (could be constructor function)
 * NOTE: This will still use a common constructor function under the hood. Use .constructFrom()
 *       if you want to define a constructor function
 * @param extendFrom A constructor (could just be normal js constructor function) to extend from
 * @param {Object} [protoProps]
 * @param {Object} [staticProps]
 * @returns {Constructr}
 *
 */
Constructr.extendFrom = function(extendFrom, protoProps, staticProps) {
    return inherits(function(){ extendFrom.apply(this, arguments); }, extendFrom, protoProps, staticProps);
};

/**
 * Create a new Constructr from a given constructor function and extending with props given
 * NOTE: This will mutate the constructFrom function you pass in so it is recommended to
 *       only use this like Consructor.createConstruct(function() {})
 *
 * @param {Function} constructFrom The constructor function to use
 * @param {Object} [protoProps]
 * @param {Object} [staticProps]
 * @returns {Constructr}
 */
Constructr.createConstruct = function(constructFrom, protoProps, staticProps) {
    return inherits(constructFrom, constructFrom, protoProps, staticProps);
};

/**
 * Mix in other objects onto the prototype (a way of sharing horizontal functionality)
 * @returns {Constructr}
 */
Constructr.mixes = function() {
    // Loop through all arguments and extend the objects prototype with them (each argument should be an object)
    var args = Array.prototype.slice.call(arguments); // convert arguments to array
    var numArgs = args.length;
    for (var i = 0; i < numArgs; i++) {
        extendObj(this.prototype, args[i]);
    }

    return this;
};

/**
 * Define a property on this constructor prototype (nicer shortcut to Object.defineProperty)
 * or staticly on the constructor if true is passed for isStatic
 * @param {String|Object} property The property to define (or object to pass to defineProperties)
 * @param {Object} definition Define your property
 * @param {Boolean} [isStatic] Do you want to define this property statically or on the prototype?
 */
Constructr.def = function(property, definition, isStatic) {
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

exports = module.exports = Constructr;