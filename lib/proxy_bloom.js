// Modifications copyright 2020 Caf.js Labs and contributors
/*!
Copyright 2013 Hewlett-Packard Development Company, L.P.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

'use strict';

/**
 * Proxy to a Bloom filter shared by all CAs.
 *
 * @module caf_bloom/proxy_bloom
 * @augments external:caf_components/gen_proxy
 *
 */
const caf_core = require('caf_core');
const caf_comp = caf_core.caf_components;
const genProxy = caf_comp.gen_proxy;

exports.newInstance = async function($, spec) {
    try {
        const that = genProxy.create($, spec);

        /**
         * Adds a key to the set.
         *
         * @param {string} key The string key to add.
         *
         * @memberof! module:caf_bloom/proxy_bloom#
         * @alias add
         *
         */
        that.add = function(key) {
            $._.add(key);
        };

        /**
         * Clears the filter.
         *
         * @memberof! module:caf_bloom/proxy_bloom#
         * @alias clear
         *
         */
        that.clear = function() {
            $._.clear();
        };


        /**
         * Checks that a key is in the set.
         *
         * It uses a Bloom filter that can introduce false positives, but no
         * false negatives.
         *
         * @param {string} key The key to check.
         * @param {caf.cb} cb0 A standard node.js callback that returns whether
         * it is in the set, or an error.
         *
         * @memberof! module:caf_bloom/proxy_bloom#
         * @alias has
         *
         */
        that.has = function(key, cb0) {
            $._.has(key, cb0);
        };

        Object.freeze(that);
        return [null, that];
    } catch (err) {
        return [err];
    }
};
