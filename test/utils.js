/* jshint strict: false */

var promisify = require('../lib/promisify');
var exec = promisify(require('child_process').exec);
var fs = require('fs');
var writeFile = promisify(fs.writeFile);
var assert = require('assert');

module.exports = function () {

    this.writePackageJson = function (conf) {
        return writeFile("./test/publish/package.json", JSON.stringify(conf));
    };

    this.publish = function publish(opt) {
        opt = opt || '';
        return exec("node ../../bin/cli.js publish " + opt, {cwd: 'test/publish'}).then(() => {});
    };

    this.unpublish = function unpublish(opt) {
        opt = opt || '';
        return exec("node ../../bin/cli.js unpublish " + opt, {cwd: 'test/publish'}).then(() => {});
    };

    this.npm_publish = function npm_publish() {
        return exec("npm publish", {cwd: 'test/publish'}).then(() => {});
    };

    this.npm_unpublish = function npm_unpublish() {
        return exec("npm unpublish -f", {cwd: 'test/publish'}).then(() => {});
    };

    this.install = function install() {
        return exec("node ../../bin/cli.js install", {cwd: 'test/install'});
    };

    this.clean_install_dir = function clean_install_dir() {
        var rimraf = promisify(require('rimraf'));
        return rimraf("test/install/boost").then(function () {
            return rimraf("test/install/extra_readme.md");
        });
    };

    this.assert_exists = function assert_exists(path) {
        assert(fs.existsSync(path), "Does not exist: " + path);
    };

    this.assert_not_exists = function assert_not_exists(path) {
        assert(!fs.existsSync(path), "Should not exist: " + path);
    };

};
