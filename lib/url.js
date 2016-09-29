'use strict';

const url = require('url');
const _ = require('lodash');

const omitEmptyQueryParams = (query) => _.omitBy(query, (queryParam) => {
    return !_.isNumber(queryParam.value) && _.isEmpty(queryParam.value);
});

const concatValues = (currValue, srcValue, concat) => {
    return concat !== false && currValue
        ? [].concat(currValue, srcValue)
        : srcValue;
};

module.exports = class Url {
    constructor(uri) {
        this._url = url.parse(uri, true);

        // if don't remove 'search' field, then 'url.format' doesn't create new uri with added query params
        delete this._url.search;
    }

    updateQuery(query) {
        query = omitEmptyQueryParams(query);

        _.mergeWith(this._url.query, query, (currValue, src) => concatValues(currValue, src.value, src.concat));

        return this;
    }

    format() {
        return url.format(this._url);
    }
};
