'use strict';

const EventEmitter = require('events').EventEmitter;
const hermioneEvents = require('hermione/lib/constants/runner-events');
const _ = require('lodash');
const proxyquire = require('proxyquire');

const URL_ENV_START = require('../../lib/constants').URL_ENV_START;

const mkHermione = () => {
    const emitter = new EventEmitter();

    emitter.events = hermioneEvents;

    return emitter;
};

describe('hermione-url-decorator', () => {
    const sandbox = sinon.sandbox.create();

    let plugin;
    let hermione;
    let decorateUrl;

    beforeEach(() => {
        decorateUrl = sandbox.stub();

        hermione = mkHermione();
        sandbox.spy(hermione, 'on');

        plugin = proxyquire('../../lib', {
            './url-decorator': decorateUrl
        });
    });

    afterEach(() => {
        _.forEach(process.env, (value, key) => {
            if (_.startsWith(key, URL_ENV_START)) {
                delete process.env[key];
            }
        });

        sandbox.restore();
    });

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

        plugin(hermione, {url: {}});

        hermione.emit(hermione.events.SESSION_START, browser);

        assert.calledWithMatch(decorateUrl, browser);
    });

    it(`should use values from config if env vars starting with "${URL_ENV_START}" are not set`, () => {
        const config = {
            url: {
                query: {
                    message: {
                        value: 'hello'
                    }
                }
            }
        };

        plugin(hermione, config);

        hermione.emit(hermione.events.SESSION_START);

        assert.calledWithMatch(decorateUrl, sinon.match.any, config.url);
    });

    it(`should use values from env vars starting with "${URL_ENV_START}" if "opts.url" is not set`, () => {
        process.env['HERMIONE_URL_QUERY_FOO'] = 'bar';

        plugin(hermione, {});

        hermione.emit(hermione.events.SESSION_START);

        assert.calledWithMatch(decorateUrl, sinon.match.any, {query: {foo: {value: 'bar'}}});
    });

    it(`should use values from env vars starting with "${URL_ENV_START}" even if "opts.url" is set`, () => {
        process.env['HERMIONE_URL_QUERY_TEXT'] = 'fromEnv';

        plugin(hermione, {
            url: {
                query: {
                    text: {
                        value: 'fromConfig'
                    }
                }
            }
        });

        hermione.emit(hermione.events.SESSION_START);

        assert.calledWithMatch(decorateUrl, sinon.match.any, {query: {text: {value: 'fromEnv'}}});
    });

    it(`should merge values from env vars starting with "${URL_ENV_START}" and from "opts.url"`, () => {
        process.env['HERMIONE_URL_QUERY_TEXT'] = 'hello';

        plugin(hermione, {
            url: {
                query: {
                    name: {
                        value: 'hermione'
                    }
                }
            }
        });

        hermione.emit(hermione.events.SESSION_START);

        assert.calledWithMatch(decorateUrl, sinon.match.any, {
            query: {name: {value: 'hermione'}, text: {value: 'hello'}}
        });
    });

    it('should use concat value from config if env vars and config have the same url parameters', () => {
        process.env['HERMIONE_URL_QUERY_TEXT'] = 'fromEnv';

        plugin(hermione, {
            url: {
                query: {
                    text: {
                        concat: false
                    }
                }
            }
        });

        hermione.emit(hermione.events.SESSION_START);

        assert.calledWith(decorateUrl, sinon.match.any, {query: {text: {value: 'fromEnv', concat: false}}});
    });
});
