#!/usr/bin/env node
'use strict';

var promisify = require('./lib/promisify');
var request = require('request');
var fs = require('fs');
var log = require('npmlog');
var url_signer = require('./lib/url_signer');

log.info("running prades unpublish!");

var package_json = require('./lib/package')({logger: log});
var options;

// takes host and path
// returns a Promise of the signed url
var get_signed_target_url = url_signer('DELETE', log);

function del(url) {
    var time1 = new Date();
    log.http("DELETE", url);
    var req = request.del({uri: url});
    req.on('response', function (res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
            var time2 = new Date();
            log.http(res.statusCode, 'Deleted successfully. took ' + ((time2 - time1)/1000) + "seconds");
        } else {
            log.http(res.statusCode, res.body);
            throw("error deleting file");
        }
    });
    req.on('error', (err) => {throw(err);});
}

module.exports = function (opt) {
    options = opt || {};
    return package_json
        .then(get_signed_target_url)
        .then(del)
        .catch((reason) => {
            log.error(reason);
            throw(Error(reason));
        });
};
