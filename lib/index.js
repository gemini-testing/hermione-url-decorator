'use strict';

const _ = require('lodash');
const decorateUrl = require('./url-decorator');
const initConfig = require('./config').init;

module.exports = (hermione, opts) => {
    if (!_.isObject(opts) || opts.enabled === false) {
        return;
    }

    const config = initConfig(opts.url, process.env);

    hermione.on(hermione.events.SESSION_START, (browser) => decorateUrl(browser, config));
};
