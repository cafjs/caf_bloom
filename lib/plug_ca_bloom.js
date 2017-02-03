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
 * Plug for accessing a shared Bloom filter.
 *
 * @module caf_bloom/plug_ca_bloom
 * @augments external:caf_components/gen_plug_ca
 *
 */
var caf_core = require('caf_core');
var caf_comp = caf_core.caf_components;
var genPlugCA = caf_comp.gen_plug_ca;

exports.newInstance = function($, spec, cb) {
    try {
        var that = genPlugCA.constructor($, spec);

        // transactional ops
        var target = {
            addImpl: function(key, cb0) {
                $._.$.bloom.add(key, cb0);
            },
            clearImpl: function(cb0) {
                $._.$.bloom.clear(cb0);
            }
        };

        that.__ca_setLogActionsTarget__(target);

        that.add = function(key) {
            that.__ca_lazyApply__('addImpl', [key]);
        };

        that.clear = function() {
            that.__ca_lazyApply__('clearImpl', []);
        };

        that.has = function(key, cb0) {
            // does not read its own (uncommitted) writes...
            $._.$.bloom.has(key, cb0);
        };

        cb(null, that);
    } catch (err) {
        cb(err);
    }
};
