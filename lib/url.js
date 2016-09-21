'use strict';

const url = require('url');
const _ = require('lodash');

const concatValues = (currValue, srcValue, concat) => {
    if (_.isEmpty(srcValue)) {
        return currValue;
    }

    return concat !== false && currValue
        ? [].concat(currValue, srcValue)
        : srcValue;
};

const concatQueryParams = (currValue, src) => {
    src = _.isString(src) || _.isArray(src)
        ? {value: src, concat: true}
        : src;

    return concatValues(currValue, src.value, src.concat);
};

module.exports = class Url {
    constructor(uri) {
        this._url = url.parse(uri, true);

        // if don't remove 'search' field, then 'url.format' doesn't create new uri with added query params
        delete this._url.search;
    }

    updateQuery(query) {
        _.mergeWith(this._url.query, query, concatQueryParams);

        return this;
    }

    format() {
        return url.format(this._url);
    }
};
