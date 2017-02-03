# CAF.js (Cloud Assistant Framework)

Co-design permanent, active, stateful, reliable cloud proxies with your web app or gadget.

See http://www.cafjs.com

## CAF Bloom
[![Build Status](http://ci.cafjs.com/api/badges/cafjs/caf_bloom/status.svg)](http://ci.cafjs.com/cafjs/caf_bloom)

This library creates a Bloom filter backed by Redis.

## API

See {@link module:caf_bloom/proxy_bloom}

## Configuration Example

### framework.json

See {@link module:caf_bloom/plug_bloom}

        {
            "name": "bloom",
            "module": "caf_bloom#plug",
            "description": "Bloom filter service. Defaults give for a population of 10,000,000 a false positive rate of 0.0001",
            "env" : {
                "service" : "process.env.BLOOM_SERVICE||cp",
                "size" : "process.env.BLOOM_SIZE||191701168",
                "slices" : "process.env.BLOOM_SLICES||13",
                "bitFieldName" : "process.env.BLOOM_BIT_FIELD_NAME||allCAs"
            }
        }

### ca.json

See {@link module:caf_bloom/plug_ca_bloom} and  {@link module:caf_bloom/proxy_bloom}

       {
           "module": "caf_bloom#plug_ca",
           "name": "bloom",
           "description": "Bloom filter service.",
            "env" : {
                "maxRetries" : "$._.env.maxRetries",
                "retryDelay" : "$._.env.retryDelay"
            },
            "components" : [
                {
                    "module": "caf_bloom#proxy",
                    "name": "proxy",
                    "description": "Proxy to bloom filter",
                    "env" : {
                    }
                }
            ]
        }
