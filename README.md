Constructr
===========
Simple inheritance boilerplate for Javascript with zero dependencies and some spice on top.

*Note: Readme will be updated soon with much better explanation and examples. See TODO section at bottom.*

Quick and dirty example
-----------------------

```javascript
var BaseClass = Constructr.extend({
	day: 'Monday',
	initialize: function(day) {
		this.day = day || this.day;
	},
	hello: function(text) {
		return 'Hello '+text+'. It\'s '+this.day+'!';
	}
});

var ClassA = BaseClass.extend();
var ClassB = BaseClass.extend({
	hello: function(text) {
		var super = this.__super__.hello.apply(this, arguments); // Call super
		return super+' Isn\'t it a nice day?';
	}
});

var myClassA = new ClassA();
console.log(myClassA.hello('world')); // Hello world. It's Monday!

var myClassB = new ClassB('Friday');
console.log(myClassB.hello('Chris')); // Hello Chris. It's Friday!
```

And of course you don't have to pass one big object to extend the prototype with all your methods.

```javascript
var BaseClass = Constructr.extend({
	day: 'Monday'
});

BaseClass.prototype.initialize = function(day) {
	this.day = day || this.day;
};

BaseClass.prototype.hello = function(text) {
	return 'Hello '+text+'. It\'s '+this.day+'!';
};
```

Want to reuse common collections of methods? Ie. Horizontal inheritance?

```javascript
var commonMethods = {
	goodbye: function() { return 'Cya!'; },
	brb: function() { return '1 Sec.'; }
};

var ClassA = SomeParent.extend().mixes(commonMethods);
var ClassB = SomeOtherBranchInClassHierarchy.extend().mixes(commonMethods);

var myClassA = new ClassA();
var myClassB = new ClassB();

console.log(myClassA.goodbye()); // Cya!
console.log(myClassB.goodbye()); // Cya!
```

Define object properties on the prototype?

```javascript
var Person = Constructr.extend();

Person.def('name', {
	get: function() { return this.get('name'); },
	set: function(value) { return this.set('name', value); },
});

var rob = new Person();
rob.name = "Robert";
console.log(rob.name); // Robert
```

TODO
----
* Documentation
* Better introduction, explanation and examples.
* Example how it can be used in existing libraries (Eg. Backbone)