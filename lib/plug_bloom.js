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
 * A plug to access a Bloom filter backed by Redis.
 *
 *  Properties:
 *
 *      {bitFieldName: string, service: string, size: number, slices: number}
 *
 *  where:
 *
 * * `bitFieldName`: is the array of the bitfield in Redis.
 * * `service`: the local name of the Redis service, e.g., `cp`.
 * * `size`: the number of bits.
 * * `slices`: the number of hash functions.
 *
 * @module caf_bloom/plug_bloom
 * @augments external:caf_components/gen_plug
 */
const assert = require('assert');
const caf_core = require('caf_core');
const caf_comp = caf_core.caf_components;
const genPlug = caf_comp.gen_plug;
const fnv = require('fnv-plus');

const calculateIndexes = function(key, size, slices) {
    const hash1 = fnv.hash('one:' + key, 32).value;
    const hash2 = fnv.hash('two:' + key, 32).value;
    const result = [];
    for (let i = 1; i < slices + 1; i++) {
        result.push((hash1 + i * hash2) % size);
    }
    return result;
};

exports.newInstance = async function($, spec) {
    try {
        assert.equal(typeof spec.env.bitFieldName, 'string',
                     "'spec.env.bitFieldName' is not a string");
        assert.equal(typeof spec.env.service, 'string',
                     "'spec.env.service' is not a string");
        assert.equal(typeof spec.env.size, 'number',
                     "'spec.env.size' is not a number");
        assert.equal(typeof spec.env.slices, 'number',
                     "'spec.env.slices' is not a number");

        const that = genPlug.create($, spec);

        $._.$.log && $._.$.log.debug('New Bloom filter plug');

        /**
         * Adds a key to the set.
         *
         * @param {string} key The string key to add.
         * @param {caf.cb} cb A callback to notify an error.
         * @memberof! module:caf_bloom/plug_bloom#
         * @alias add
         */
        that.add = function(key, cb0) {
            const bits = calculateIndexes(key, spec.env.size, spec.env.slices);
            $._.$[spec.env.service].setBits(spec.env.bitFieldName, bits, cb0);
        };

        /**
         * Clears the filter.
         *
         * @param {caf.cb} cb A callback to notify an error.
         * @memberof! module:caf_bloom/plug_bloom#
         * @alias clear
         */
        that.clear = function(cb0) {
            $._.$[spec.env.service].clearBits(spec.env.bitFieldName, cb0);
        };

        /**
         * Checks that a key is in the set.
         *
         * It uses a Bloom filter that can introduce false positives, but no
         * false negatives.
         *
         * @param {string} key The key to check.
         * @param {caf.cb} cb A callback to return whether the key is in the
         * set, or an error.
         *
         * @memberof! module:caf_bloom/plug_bloom#
         * @alias has
         */
        that.has = function(key, cb0) {
            const bits = calculateIndexes(key, spec.env.size, spec.env.slices);
            $._.$[spec.env.service].checkBits(spec.env.bitFieldName, bits,
                                              function(err, data) {
                                                  cb0(err, !!data);
                                              });
        };

        return [null, that];
    } catch (err) {
        return [err];
    }
};
