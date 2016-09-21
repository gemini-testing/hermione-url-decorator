'use strict';

const _ = require('lodash');

const URL_ENV_START = require('./constants').URL_ENV_START;

/**
 * @param  {String} value
 * @param  {String} name
 *
 * @example
 * parseUrlEnvVar('awesome-value' 'query_my_text') → {query: {'my_text': {value: 'awesome_value'}}}
 */
const parseUrlEnvVar = (value, name) => {
    const matched = name.match(/^(.*?)_(.+)/);

    return matched ? _.set({}, [matched[1], matched[2], 'value'], value) : {};
};

module.exports = (envVars) => {
    return _(envVars)
        .pickBy((value, name) => _.startsWith(name, URL_ENV_START))
        .mapKeys((envVal, envKey) => _.replace(envKey, URL_ENV_START, '').toLowerCase())
        .transform((result, envVal, envKey) => _.merge(result, parseUrlEnvVar(envVal, envKey)))
        .value();
};
