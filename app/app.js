angular.module('MyApp', ['ngResource', 'ngMessages', 'ngFileUpload', 'toastr', 'ui.router', 'ui.bootstrap', 'satellizer', 'angularModalService', 'angular-velocity', 'underscore', 'xeditable', 'vcRecaptcha', 'reTree', 'ng.deviceDetector'])
    .config(function($stateProvider, $urlRouterProvider, $authProvider, $httpProvider, toastrConfig, $compileProvider, $locationProvider) {

        $stateProvider
            .state('main', {
                url: '/',
                templateUrl: '/partials/home.html'
            })
            .state('signup', {
                url: '/signup',
                templateUrl: '/partials/signup.html'
            })
            .state('login', {
                url: '/login',
                templateUrl: '/partials/login.html'
            })
            .state('validate', {
                url: '/validate',
                templateUrl: '/partials/validate.html',
                controller: 'ValidateCtrl'
            })
            .state('user-list', {
                url: '/list',
                templateUrl: '/partials/userList.html',
                controller: 'ListCtrl'
            })
            .state('logout', {
                url: '/logout',
                template: null,
                controller: 'LogoutCtrl'
            })
            .state('portfolio', {
                url: '/portfolio',
                templateUrl: '/partials/portfolio.html',
                controller: 'PortfolioCtrl'
            })
            .state('user-portfolio', {
                url: '/user/:userId',
                templateUrl: '/partials/userPortfolio.html',
                controller: 'UserPortfolioCtrl'
            })
            .state('about', {
                url: '/about',
                templateUrl: '/partials/about.html',
                controller: 'StaticCtrl'
            })
            .state('request-password-reset', {
                url: '/request-password-reset',
                templateUrl: '/partials/requestPasswordReset.html',
                controller: 'RequestPasswordResetCtrl'
            })
            .state('reset-password', {
                url: '/reset-password/:token',
                templateUrl: '/partials/resetPassword.html',
                controller: 'ResetPasswordCtrl'
            });

        $httpProvider.defaults.withCredentials = true;
        $urlRouterProvider.otherwise('/');

        angular.extend(toastrConfig, {
            containerId: 'toast-container',
            extendedTimeOut: 1000,
            iconClasses: {
                error: 'toast-error',
                info: 'toast-info',
                success: 'toast-success',
                warning: 'toast-warning'
            },
            maxOpened: 0,
            preventOpenDuplicates: true,
            messageClass: 'toast-message',
            newestOnTop: true,
            positionClass: 'toast-top-center',
            timeOut: 3000,
            titleClass: 'toast-title',
            toastClass: 'toast velocity-enter-transition-FadeIn velocity-leave-transition-slideUpBigOut'
        });

        $compileProvider.debugInfoEnabled(false);

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });

    });
