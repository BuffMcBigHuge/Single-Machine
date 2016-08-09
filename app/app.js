angular.module('MyApp', ['ngResource', 'ngMessages', 'ngFileUpload', 'toastr', 'ui.router', 'ui.bootstrap', 'satellizer', 'angularModalService', 'angular-velocity', 'underscore', 'xeditable', 'vcRecaptcha', 'reTree', 'ng.deviceDetector'])
    .config(function($stateProvider, $urlRouterProvider, $authProvider, $httpProvider, toastrConfig, $compileProvider, $locationProvider) {
        $stateProvider
            .state('main', {
                url: '/',
                resolve: {
                    resolveHome: resolveHome
                }
            })
            .state('signup', {
                url: '/signup',
                templateUrl: '/partials/signup.html',
                controller: 'SignupCtrl',
                resolve: {
                    skipIfLoggedIn: skipIfLoggedIn
                }
            })
            .state('validate', {
                url: '/validate',
                templateUrl: '/partials/validate.html',
                controller: 'ValidateCtrl',
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .state('user-list', {
                url: '/list',
                templateUrl: '/partials/userList.html',
                controller: 'ListCtrl',
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .state('logout', {
                url: '/logout',
                template: null,
                controller: 'LogoutCtrl',
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .state('portfolio', {
                url: '/portfolio',
                templateUrl: '/partials/portfolio.html',
                controller: 'PortfolioCtrl',
                resolve: {
                    loginRequired: loginRequired
                }
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

        function resolveHome($q, $location, $auth) {
            var deferred = $q.defer();

            if ($auth.isAuthenticated())
                $location.path('/portfolio');
            else
                $location.path('/signup');

            return deferred.promise;
        }

        function skipIfLoggedIn($q, $auth) {
            var deferred = $q.defer();
            if ($auth.isAuthenticated()) {
                deferred.reject();
            } else {
                deferred.resolve();
            }
            return deferred.promise;
        }

        function loginRequired($q, $location, $auth) {
            var deferred = $q.defer();
            if ($auth.isAuthenticated()) {
                deferred.resolve();
            } else {
                $location.path('/');
            }
            return deferred.promise;
        }

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
            positionClass: 'toast-bottom-center',
            timeOut: 3000,
            titleClass: 'toast-title',
            toastClass: 'toast velocity-enter-transition-FadeIn velocity-leave-transition-slideDownBigOut'
        });

        $compileProvider.debugInfoEnabled(false);

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });

    })
    .run(['editableOptions', '$rootScope', '$location', '$window', 'localStorage', function(editableOptions) {
        editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
    }]);