var expect = require('chai').expect;
var Constructr = require('../src/constructr');

describe('Constructr', function() {

    var testMixin = {
        testFunc: function() { return '123'; },
        testProp: 123
    };

    var TestConstructor = function() {};

    describe('#extend()', function() {

        it ('Should correctly setup inheritance chain', function() {
            var MyConstruct = Constructr.extend();

            expect(new MyConstruct).to.be.instanceOf(Constructr);
        });

        it ('Should correctly setup properties', function() {
            var MyConstruct = Constructr.extend({
                test: 123,
                func: function() {}
            }, {
                testStatic: 321,
                funcStatic: function() {}
            });

            expect(MyConstruct.testStatic).to.equal(321);
            expect(MyConstruct.funcStatic).to.be.a('function');

            expect((new MyConstruct).test).to.equal(123);
            expect((new MyConstruct).func).to.be.a('function');
        });

    });

    describe('inherits() through #extend()', function() {

        it ('should correctly setup certain properties', function() {
            var MyConstruct = Constructr.extend();

            expect(MyConstruct.extend).to.be.a('function');
            expect(MyConstruct.mixes).to.be.a('function');
            expect(MyConstruct.def).to.be.a('function');
            expect(MyConstruct.__super__).to.equal(Constructr.prototype);
        });

    });

    describe('#extendFrom()', function() {

        it ('Should correctly setup inheritance chain', function() {
            var MyConstruct = Constructr.extendFrom(TestConstructor);

            expect(new MyConstruct).to.be.instanceOf(TestConstructor);
        });

        it ('Should correctly setup properties', function() {
            var MyConstruct = Constructr.extendFrom(TestConstructor, {
                test: 123,
                func: function() {}
            }, {
                testStatic: 321,
                funcStatic: function() {}
            });

            expect(MyConstruct.testStatic).to.equal(321);
            expect(MyConstruct.funcStatic).to.be.a('function');

            expect((new MyConstruct).test).to.equal(123);
            expect((new MyConstruct).func).to.be.a('function');
        });

    });

    describe('#createConstruct()', function() {

        it ('Should correctly setup inheritance chain', function() {
            var MyMutableTestConstructor = function() {};
            var MyConstruct = Constructr.createConstruct(MyMutableTestConstructor);

            expect(new MyConstruct).to.be.instanceOf(MyMutableTestConstructor);
        });

        it ('Should correctly setup properties', function() {
            var MyMutableTestConstructor = function() {};
            var MyConstruct = Constructr.createConstruct(MyMutableTestConstructor, {
                test: 123,
                func: function() {}
            }, {
                testStatic: 321,
                funcStatic: function() {}
            });

            expect(MyConstruct.testStatic).to.equal(321);
            expect(MyConstruct.funcStatic).to.be.a('function');

            expect((new MyConstruct).test).to.equal(123);
            expect((new MyConstruct).func).to.be.a('function');
        });

        it ('should correctly setup construct on prototype', function () {
            var MyMutableTestConstructor = function() {};
            var MyConstruct = Constructr.createConstruct(MyMutableTestConstructor);

            expect((new MyConstruct()).constructor).to.equal(MyMutableTestConstructor);
        })

    });

    describe('#mixes()', function() {

        it ('should correctly inherit properties', function() {
            var MyConstruct = Constructr.extend();
            MyConstruct.mixes(testMixin);

            expect((new MyConstruct).testProp).to.equal(123);
            expect((new MyConstruct).testFunc).to.be.a('function');
            expect((new MyConstruct).testFunc()).to.equal('123')

        })

    });

    describe('#def()', function() {

        it ('should correctly setup property accessors', function() {
            var MyConstruct = Constructr.extend({
                _privateVar: 123
            });
            MyConstruct.def('secret', {
                get: function() { return this._privateVar; },
                set: function(val) { this._privateVar = val; }
            });
            var myNewInstance = new MyConstruct;

            expect(myNewInstance.secret).to.equal(123);

            myNewInstance.secret = 'lol';

            expect(myNewInstance.secret).to.equal('lol');
        });

        it ('should correctly setup static property accessors', function() {
            var MyConstruct = Constructr.extend({}, {
                _privateVar: 123
            });
            MyConstruct.def('secret', {
                get: function() { return this._privateVar; },
                set: function(val) { this._privateVar = val; }
            }, true);

            expect(MyConstruct.secret).to.equal(123);

            MyConstruct.secret = 'lol';

            expect(MyConstruct.secret).to.equal('lol');
        });

    });

});