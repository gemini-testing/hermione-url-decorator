'use strict';

const _ = require('lodash');
const decorateUrl = require('./url-decorator');
const parseConfigFromEnv = require('./url-env-parser');

const initConfig = (urlFromConfig, urlFromEnv) => _.merge(urlFromConfig, urlFromEnv);

module.exports = (hermione, opts) => {
    if (!_.isObject(opts) || opts.enabled === false) {
        return;
    }

    const config = initConfig(opts.url, parseConfigFromEnv(process.env));

    hermione.on(hermione.events.SESSION_START, (browser) => decorateUrl(browser, config));
};
