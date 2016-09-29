'use strict';

const decorateUrl = require('../../lib/url-decorator');

describe('url-decorator', () => {
    const sandbox = sinon.sandbox.create();

    const mkBrowser = () => {
        const browser = {};

        browser.url = sandbox.stub().named('url');

        browser.addCommand = () => {};
        sandbox.stub(browser, 'addCommand', (name, command) => {
            browser[name] = command.bind(browser);
        });

        return browser;
    };

    afterEach(() => sandbox.restore());

    it('should not redefine "url" method if it was called without parameters', () => {
        const browser = mkBrowser();
        const baseUrlFn = browser.url;

        decorateUrl(browser);
        browser.url();

        assert.calledOn(baseUrlFn, browser);
        assert.calledWith(baseUrlFn, undefined);
    });

    it('should add new parameters if they do not exist in url', () => {
        const browser = mkBrowser();
        const baseUrlFn = browser.url;

        decorateUrl(browser, {query: {foo: {value: 'bar'}, baz: {value: 'boo'}}});
        browser.url('/?text=text');

        assert.calledOn(baseUrlFn, browser);
        assert.calledWith(baseUrlFn, '/?text=text&foo=bar&baz=boo');
    });

    it('should concat parameters if "concat" is true', () => {
        const browser = mkBrowser();
        const baseUrlFn = browser.url;

        decorateUrl(browser, {query: {text: {value: 'foo', concat: true}}});
        browser.url('/?text=text');

        assert.calledOn(baseUrlFn, browser);
        assert.calledWith(baseUrlFn, '/?text=text&text=foo');
    });

    it('should concat parameters if "concat" is not specified', () => {
        const browser = mkBrowser();
        const baseUrlFn = browser.url;

        decorateUrl(browser, {query: {text: {value: 'foo'}}});
        browser.url('/?text=text');

        assert.calledOn(baseUrlFn, browser);
        assert.calledWith(baseUrlFn, '/?text=text&text=foo');
    });

    it('should concat parameters specified as number', () => {
        const browser = mkBrowser();
        const baseUrlFn = browser.url;

        decorateUrl(browser, {query: {text: {value: 15}}});
        browser.url('/?text=text');

        assert.calledOn(baseUrlFn, browser);
        assert.calledWith(baseUrlFn, '/?text=text&text=15');
    });

    it('should concat each parameters from array of values', () => {
        const browser = mkBrowser();
        const baseUrlFn = browser.url;

        decorateUrl(browser, {query: {text: {value: ['foo', 'bar']}}});
        browser.url('/?text=text');

        assert.calledOn(baseUrlFn, browser);
        assert.calledWith(baseUrlFn, '/?text=text&text=foo&text=bar');
    });

    it('should override parameters if "concat" is false', () => {
        const browser = mkBrowser();
        const baseUrlFn = browser.url;

        decorateUrl(browser, {query: {text: {value: 'foo', concat: false}}});
        browser.url('/?text=text');

        assert.calledOn(baseUrlFn, browser);
        assert.calledWith(baseUrlFn, '/?text=foo');
    });

    it('should not add url parameters if they are specified as an empty object', () => {
        const browser = mkBrowser();
        const baseUrlFn = browser.url;

        decorateUrl(browser, {query: {text: {}}});
        browser.url('/?text=text');

        assert.calledOn(baseUrlFn, browser);
        assert.calledWith(baseUrlFn, '/?text=text');
    });

    it('should not add url parameters if they are specified as an object without "value" field', () => {
        const browser = mkBrowser();
        const baseUrlFn = browser.url;

        decorateUrl(browser, {query: {text: {concat: false}}});
        browser.url('/?text=text');

        assert.calledOn(baseUrlFn, browser);
        assert.calledWith(baseUrlFn, '/?text=text');
    });

    it('should not add url parameters if they are specified as an empty string', () => {
        const browser = mkBrowser();
        const baseUrlFn = browser.url;

        decorateUrl(browser, {query: {name: {value: ''}}});
        browser.url('/?text=text');

        assert.calledOn(baseUrlFn, browser);
        assert.calledWith(baseUrlFn, '/?text=text');
    });

    it('should not add url parameters if they are specified as an empty array', () => {
        const browser = mkBrowser();
        const baseUrlFn = browser.url;

        decorateUrl(browser, {query: {name: {value: []}}});
        browser.url('/?text=text');

        assert.calledOn(baseUrlFn, browser);
        assert.calledWith(baseUrlFn, '/?text=text');
    });
});
