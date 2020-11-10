/*!
 * Lunr languages, `Chinese` language
 */
/*!
 * based on
 * Snowball JavaScript Library v0.3
 * http://code.google.com/p/urim/
 * http://snowball.tartarus.org/
 *
 * Copyright 2010, Oleg Mazko
 * http://www.mozilla.org/MPL/
 */

/**
 * export the module via AMD, CommonJS or as a browser global
 * Export code from https://github.com/umdjs/umd/blob/master/returnExports.js
 */
;
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory)
    } else if (typeof exports === 'object') {
        /**
         * Node. Does not work with strict CommonJS, but
         * only CommonJS-like environments that support module.exports,
         * like Node.
         */
        module.exports = factory()
    } else {
        // Browser globals (root is window)
        factory()(root.lunr);
    }
}(this, function() {
    /**
     * Just return a value to define the module export.
     * This example returns an object, but the module
     * can return a function as the exported value.
     */
    return function(lunr) {
        /* throw error if lunr is not yet included */
        if ('undefined' === typeof lunr) {
            throw new Error('Lunr is not present. Please include / require Lunr before this script.');
        }

        /* throw error if lunr stemmer support is not yet included */
        /*
        if ('undefined' === typeof lunr.stemmerSupport) {
            throw new Error('Lunr stemmer support is not present. Please include / require Lunr stemmer support before this script.');
        }
        */

        /* register specific locale function */
        lunr.zh = function() {
            this.pipeline.reset();
            this.pipeline.add(
                lunr.zh.trimmer,
                lunr.zh.stopWordFilter,
                lunr.zh.stemmer
            );
            // change the tokenizer for japanese one
            lunr.tokenizer = lunr.zh.tokenizer;
        };
        //var segmenter = new TinySegmenter(); //

        lunr.zh.tokenizer = function(str) {
            if (!arguments.length || str === null || str === undefined) return [];
            if (Array.isArray(str)) {
                var arr = str.filter(function(token) {
                    if (token === null || token === undefined) {
                        return false;
                    }

                    return true;
                });

                arr = arr.map(function(t) {
                    return elasticlunr.utils.toString(t).toLowerCase();
                });

                var out = [];
                arr.forEach(function(item) {
                    //var tokens = item.split(elasticlunr.tokenizer.seperator);
                    var l_str = item.toString().trim().toLowerCase();
                    var en_tokens = l_str.split(/\W+/).filter(item => item !== '');
                    var zh_tokens = l_str.replace(/[\x00-\x7F]/g, '').split('');
                    var tokens = en_tokens.concat(zh_tokens);
                    out = out.concat(tokens);
                }, this);

                return out;
            }

            var l_str = str.toString().trim().toLowerCase();
            var en_tokens = l_str.split(/\W+/).filter(item => item !== '');
            var zh_tokens = l_str.replace(/[\x00-\x7F]/g, '').split('');
            var tokens = en_tokens.concat(zh_tokens);
            //console.log("tokenizer result: " + tokens);
            return tokens;

            //return l_str.split(/\W+/).concat(l_str.replace(/[\x00-\x7F]/g, '').split(''));
            //return str.toString().trim().toLowerCase().split(elasticlunr.tokenizer.seperator);
        }

        /* lurn trimmer function */
        lunr.zh.trimmer = function(token) {
            if (token === null || token === undefined) {
                throw new Error('token should not be undefined');
            }

            //console.log("trimmer:  " + token);

            return token
                //.replace(/^\W+/, '')
                //.replace(/\W+$/, '');
        };

        lunr.Pipeline.registerFunction(lunr.zh.trimmer, 'trimmer-zh');

        /* lunr stemmer function */
        lunr.zh.stemmer = (function() {

            /* TODO zh stemmer  */
            return function(word) {
                return word;
            }
        })();

        lunr.Pipeline.registerFunction(lunr.zh.stemmer, 'stemmer-zh');

        /* stop word filter function */
        lunr.zh.stopWordFilter = function(token) {
            if (lunr.zh.stopWordFilter.stopWords.indexOf(token) === -1) {
                return token;
            }
        };

        lunr.zh.stopWordFilter.stopWords = new lunr.SortedSet();
        lunr.zh.stopWordFilter.stopWords.length = 45;

        // The space at the beginning is crucial: It marks the empty string
        // as a stop word. lunr.js crashes during search when documents
        // processed by the pipeline still contain the empty string.
        // stopword for japanese is from http://www.ranks.nl/stopwords/japanese
        lunr.zh.stopWordFilter.stopWords.elements = '的 了 吧'.split(' ');
        lunr.Pipeline.registerFunction(lunr.zh.stopWordFilter, 'stopWordFilter-zh');
    };
}))