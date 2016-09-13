'use strict';

const parseUrlEnvParams = require('../../lib/url-env-parser');

const URL_ENV_START = require('../../lib/constants').URL_ENV_START;

describe('url-env-parser', () => {
    const sandbox = sinon.sandbox.create();

    afterEach(() => {
        sandbox.restore();
    });

    it(`should return empty object if env vars starting with "${URL_ENV_START}" are not set`, () => {
        assert.deepEqual(parseUrlEnvParams({}), {});
    });

    it(`should return empty object if env vars starting with "${URL_ENV_START}" do not fit plugin`, () => {
        const envVars = {
            'HERMIONE_URL_QUERY': 'test'
        };

        assert.deepEqual(parseUrlEnvParams(envVars), {});
    });

    it('should parse url param', () => {
        const envVars = {
            'HERMIONE_URL_RESOURCE_PATH_DIR': 'hello/world'
        };

        const expectedResult = {
            resource: {
                'path_dir': {
                    value: 'hello/world'
                }
            }
        };

        assert.deepEqual(parseUrlEnvParams(envVars), expectedResult);
    });

    it('should parse several url params', () => {
        const envVars = {
            'HERMIONE_URL_QUERY_NAME': 'hermione',
            'HERMIONE_URL_QUERY_HAIR': 'ginger'
        };

        const expectedResult = {
            query: {
                name: {
                    value: 'hermione'
                },
                hair: {
                    value: 'ginger'
                }
            }
        };

        assert.deepEqual(parseUrlEnvParams(envVars), expectedResult);
    });
});
