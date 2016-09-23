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

const parseConfigFromEnv = (envVars) => {
    return _(envVars)
        .pickBy((value, name) => _.startsWith(name, URL_ENV_START) && value)
        .mapKeys((envVal, envKey) => _.replace(envKey, URL_ENV_START, '').toLowerCase())
        .transform((result, envVal, envKey) => _.merge(result, parseUrlEnvVar(envVal, envKey)))
        .value();
};

const parseQuery = (query) => {
    return _.mapValues(query, (value) => {
        return _.isPlainObject(value) ? value : {value, concat: true};
    });
};

const parseConfigFromFile = (url) => {
    if (_.isEmpty(url)) {
        return {};
    }

    return _.extend(url, {
        query: parseQuery(url.query)
    });
};

exports.init = (url, envVars) => _.merge(parseConfigFromFile(url), parseConfigFromEnv(envVars));
