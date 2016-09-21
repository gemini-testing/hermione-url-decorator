# hermione-url-decorator

[![Build Status](https://travis-ci.org/gemini-testing/hermione-url-decorator.svg?branch=master)](https://travis-ci.org/gemini-testing/hermione-url-decorator)
[![Coverage Status](https://img.shields.io/coveralls/gemini-testing/hermione-url-decorator.svg?style=flat)](https://coveralls.io/r/gemini-testing/hermione-url-decorator?branch=master)

Plugin for [hermione](https://github.com/gemini-testing/hermione) which is intended to change test urls in runtime. You can read more about plugins at [documentation](https://github.com/gemini-testing/hermione#plugins).

## Installation

```bash
npm install hermione-url-decorator
```

## Usage

### Configuration

* **enabled** (optional) `Boolean` – enable/disable the plugin; by default plugin is enabled
* **url** (optional) `Object` - the list of url parameters, which will be added in each test url
    * **query** (optional) `Object` - the list of query parameters
        * **queryParam** (optional) `Object` - name of query parameter
            * **value** (optional) `String` - value of query parameter
            * **concat** (optional) `Boolean` - enable/disable concatenation; by default is `true`

### Examples

Add plugin to your `hermione` config file:

```js
module.exports = {
    // ...

    plugins: {
        'hermione-url-decorator': true
    },

    // ...
};
```

To pass additional url parameters you can use environment variables,
which should start with `HERMIONE_URL_` or specify them in the `hermione` config file.

For example, you have the following test url: `http://localhost/test/?name=hermione` and
you want to add query parameter via environment variable:

```bash
HERMIONE_URL_QUERY_TEXT=ololo hermione
```

After that your test url will be changed to: `http://localhost/test/?name=hermione&text=ololo`.

The same thing you can do using `hermione` config file:

```js
'hermione-url-decorator': {
    url: {
        query: {
            text: {
                value: 'ololo'
            }
            // or
            text: 'ololo'
        }
    }
}
```

Note: environment variables have higher priority than config values.

#### Concatenation of url parameters

In previous example you have seen how add url parameters. Now we look how to concat and override url parameters.

Suppose, you want to add query parameter `name` which is already present in your test url: `http://localhost/test/?name=hermione` and you don't want to override it:

```js
'hermione-url-decorator': {
    url: {
        query: {
            name: {
                value: 'harry',
                concat: true
            }
            // or
            name: {
                value: 'harry'
            }
            // or
            name: 'harry'
        }
    }
}
```

The result url will look like: `http://localhost/test/?name=hermione&name=harry`. How you understand, the result will be the same if `concat` would be any value except `false`.

Moreover for previous test url you can specify a set of values for one query parameter:

```js
'hermione-url-decorator': {
    url: {
        query: {
            name: {
                value: ['hermione', 'ron']
            }
            // or
            name: [
                'harry',
                'ron'
            ]
        }
    }
}
```

The result url will look like: `http://localhost/test/?name=hermione&name=harry&name=ron`

If you want to override value of **name** query parameter:

```js
'hermione-url-decorator': {
    url: {
        query: {
            name: {
                value: 'harry',
                concat: false
            }
        }
    }
}
```

As a result url will look like: `http://localhost/test/?name=harry`.

You can do the same thing via environment variables. In this case concat value will be used from config to the same url parameter:

```bash
HERMIONE_URL_QUERY_NAME=ron hermione
```

The result url will look like: `http://localhost/test/?name=ron`
