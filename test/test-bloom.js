"use strict"

const hello = require('./hello/main.js');
const app = hello;
const caf_core = require('caf_core');
const myUtils = caf_core.caf_components.myUtils;
const async = caf_core.async;
const cli = caf_core.caf_cli;

const CA_OWNER_1 = 'bloomother1';
const CA_LOCAL_NAME_1 = 'bar1';
const FROM_1 =  CA_OWNER_1 + '-' + CA_LOCAL_NAME_1;

process.on('uncaughtException', function (err) {
               console.log("Uncaught Exception: " + err);
               console.log(myUtils.errToPrettyStr(err));
               process.exit(1);

});

module.exports = {
    setUp: function (cb) {
       const self = this;
        app.init( {name: 'top'}, 'framework.json', null,
                      function(err, $) {
                          if (err) {
                              console.log('setUP Error' + err);
                              console.log('setUP Error $' + $);
                              // ignore errors here, check in method
                              cb(null);
                          } else {
                              self.$ = $;
                               cb(err, $);
                          }
                      });
    },
    tearDown: function (cb) {
        const self = this;
        if (!this.$) {
            cb(null);
        } else {
	    console.log('********');
            this.$.top.__ca_graceful_shutdown__(null, cb);
        }
    },
    bloom: function (test) {
        test.expect(6);
        var s1;
        var from1 = FROM_1;
        var id;

        async.series([
            function(cb) {
                s1 = new cli.Session('ws://foo-xx.vcap.me:3000', from1, {
                    from : from1
                });
                s1.onopen = function() {
                    s1.add('mykey-x1',  cb);
                };
            },
            function(cb) {
                const cb1 = function(err, reply) {
                    test.ifError(err);
                    test.ok(reply === true);
                    cb(null);
                };
                s1.has('mykey-x1',  cb1);
            },
            function(cb) {
                const cb1 = function(err, reply) {
                    test.ifError(err);
                    test.ok(reply === false);
                    cb(null);
                };
                s1.has('mykey-x2',  cb1);
            },
            function(cb) {
                s1.onclose = function(err) {
                    test.ifError(err);
                    cb(null, null);
                };
                s1.close();
            }
        ], function(err, res) {
            test.ifError(err);
            test.done();
        });
    }
};
