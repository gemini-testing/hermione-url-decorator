'use strict';

const EventEmitter = require('events').EventEmitter;
const hermioneEvents = require('hermione/lib/constants/runner-events');
const proxyquire = require('proxyquire');

const mkHermione = () => {
    const emitter = new EventEmitter();

    emitter.events = hermioneEvents;

    return emitter;
};

describe('hermione-url-decorator', () => {
    const sandbox = sinon.sandbox.create();

    let plugin;
    let hermione;
    let initConfig;
    let decorateUrl;

    beforeEach(() => {
        initConfig = sandbox.stub();
        decorateUrl = sandbox.stub();

        hermione = mkHermione();
        sandbox.spy(hermione, 'on');

        plugin = proxyquire('../../lib', {
            './config': initConfig,
            './url-decorator': decorateUrl
        });
    });

    afterEach(() => sandbox.restore());

    describe('should do nothing if', () => {
        it('"opts" is not an object', () => {
            plugin(hermione, null);

            assert.notCalled(hermione.on);
        });

        it('plugin is disabled', () => {
            plugin(hermione, {enabled: false});

            assert.notCalled(hermione.on);
        });
    });

    it('should pass browser emitted by hermione to url decorator', () => {
        const browser = sinon.spy.named('browser');

        plugin(hermione, {});
        hermione.emit(hermione.events.SESSION_START, browser);

        assert.calledWithMatch(decorateUrl, browser);
    });

    it('should pass url config to url decorator', () => {
        const configUrl = {query: {text: 'hello'}};
        const expectedConfig = {query: {text: {value: 'hello', concat: true}}};

        initConfig.withArgs(configUrl, process.env).returns(expectedConfig);

        plugin(hermione, {url: configUrl});
        hermione.emit(hermione.events.SESSION_START);

        assert.calledWithMatch(decorateUrl, sinon.match.any, expectedConfig);
    });

    it('should run plugin if "opts.enabled" is "true"', () => {
        plugin(hermione, {enabled: true});

        hermione.emit(hermione.events.SESSION_START);

        assert.calledWith(decorateUrl, sinon.match.any, {});
    });
});
