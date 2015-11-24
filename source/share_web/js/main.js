'use strict';

window.niceShare = {};

/*
 * 依赖库
 * */
window.$ = require('./lib/jquery.min.js');
require('./lib/angular.js');
require('./lib/angular-route.min.js');
require('./lib/angular-sanitize.min.js');

/*
 * 公共
 * */
require('common');
window.Ui = require('Ui');
window.authentication = new (require('Authentication'));

/*
 * 加载常量
 * */
niceShare.Constant = angular.module('Constant', []);
require('./constant/language_optional.js');
require('./constant/language_package.js');

/*
 * 服务配置
 * */
niceShare.ServiceConfig = angular.module('ServiceConfig', []);
require('./service_config/route_config.js');

/*
 * 服务
 * */
niceShare.Service = angular.module('Service', []);
require('./service/getLanguage.js');

/*
* 控制器
* */
niceShare.Controller = angular.module('Controller', []);
require('./controller/login.js');
require('./controller/share.js');

/*
 * app主模块
 * */
niceShare.ShareApp = angular.module('ShareApp', [
    'ngSanitize',
    'ngRoute',
    'Constant',
    'ServiceConfig',
    'Service',
    'Controller'
]);

/*
 * 初始化页面路由
 * */
require('./initialize/run.js');
