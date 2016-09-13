'use strict';

const Url = require('./url');

const updateUri = (uri, config) => {
    return new Url(uri)
        .updateQuery(config.query)
        .format();
};

module.exports = (browser, config) => {
    const baseUrlFn = browser.url;

    browser.addCommand('url', function(uri) {
        uri = uri ? updateUri(uri, config) : uri;

        return baseUrlFn.call(this, uri);
    }, true); // override the original method 'url'
};
