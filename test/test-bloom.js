"use strict"

var hello = require('./hello/main.js');
var app = hello;
var caf_core = require('caf_core');
var myUtils = caf_core.caf_components.myUtils;
var async = caf_core.async;
var cli = caf_core.caf_cli;

var CA_OWNER_1 = 'bloomother1';
var CA_LOCAL_NAME_1 = 'bar1';
var FROM_1 =  CA_OWNER_1 + '-' + CA_LOCAL_NAME_1;

process.on('uncaughtException', function (err) {
               console.log("Uncaught Exception: " + err);
               console.log(myUtils.errToPrettyStr(err));
               process.exit(1);

});

module.exports = {
    setUp: function (cb) {
       var self = this;
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
        var self = this;
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
                var cb1 = function(err, reply) {
                    test.ifError(err);
                    test.ok(reply === true);
                    cb(null);
                };
                s1.has('mykey-x1',  cb1);
            },
            function(cb) {
                var cb1 = function(err, reply) {
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
