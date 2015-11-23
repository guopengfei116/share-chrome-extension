'use strict';

window.niceShare = {};

/*
 * 依赖库
 * */
window.$ = require('./lib/jquery.min.js');
require('./lib/angular.min.js');
require('./lib/angular-route.min.js');
require('./lib/angular-sanitize.min.js');

/*
 * 公共
 * */
require('common');
window.Ui = require('Ui');
window.authentication = new (require('Authentication'));

/*
 * 服务配置
 * */
niceShare.ServiceConfig = angular.module('ServiceConfig', []);
require('./service_config/route_config.js');

/*
* 控制器
* */
niceShare.Controller = angular.module('Controller', []);
require('./controller/login.js');
require('./controller/share.js');

/*
 * app主模块
 * */
angular.module('shareApp', [
    'ngSanitize',
    'ngRoute',
    'ServiceConfig',
    'Controller'
]);
