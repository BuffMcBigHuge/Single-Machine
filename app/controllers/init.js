angular.module('MyApp')
    .controller('InitCtrl', ["$scope", "$auth", "$http", "UserService", "toastr", "$location", "localStorage", "_", "$rootScope", "$document", "$timeout", "$window", "$anchorScroll", "deviceDetector",
        function($scope, $auth, $http, UserService, toastr, $location, localStorage, _, $rootScope, $document, $timeout, $window, $anchorScroll, deviceDetector) {

            /**
             |------------------------------------------------------
             | INIT - Injected on main.ejs, run once when app is loaded
             |------------------------------------------------------
             */

            // Variables
            $scope.user = {};
            $scope.user.email = '';
            $scope.user.password = '';
            $scope.name = '';
            $scope.firstName = '';
            $scope.lastName = '';
            $scope.signupView = false;
            $scope.deviceDetectorValue = deviceDetector;

            // Used to check if webapp is accessible
            $scope.isLoaded = function() {
                return true;
            };

            // Allowed unauthenticated pages
            $scope.authenticatedArray = [
                "/validate",
                "/portfolio",
                "/list",
                "/reset-password/"
            ];

            // Pages to hide footer
            $scope.noFooterArray = [
                "/signup",
                "/login",
                "/logout",
                "/"
            ];

            $scope.isAuthenticated = function() {
                return $auth.isAuthenticated();
            };

            $scope.isValid = function() {
                if (($scope.isAuthenticated()) && (typeof $scope.user !== 'undefined'))
                    return ($scope.user.isValid || false);
                else
                    return false;
            };

            /* Extra Small <544px
            Small ≥544px
            Medium ≥768px
            Large ≥992px
            Extra large ≥1200px */

            // Screen size
            $scope.isExtraSmall = function(){
                return ($(window).width() <= 768);
            };
            $scope.isSmall = function(){
                return (($(window).width() > 768) && ($(window).width() <= 992));
            };
            $scope.isMedium = function(){
                return (($(window).width() > 992) && ($(window).width() <= 1200));
            };
            $scope.isLarge = function(){
                return ($(window).width() > 1200);
            };

            // SIGNUP

            $scope.signUp = function() {

                $('#signup').modal('hide');

                $scope.user.isBusiness = false;
                $scope.user.isValid = false;
                $scope.user.displayName = {};

                $scope.user.displayName.firstName = $scope.firstName;
                $scope.user.displayName.lastName = $scope.lastName;

                $auth.signup($scope.user)
                    .then(function(response) {

                        $auth.setToken(response);
                        $scope.user = response.data;
                        localStorage.setUser($scope.user);

                        $location.path('/');
                    })
                    .catch(function (response) {
                        toastr.error(response.data.message);
                    });
            };

            $scope.toggleSignup = function() {
                $scope.signupView = !$scope.signupView;
            };

            // LOGIN

            $scope.login = function() {

                $('#login').modal('hide');

                $auth.login($scope.user)
                    .then(function() {
                        if ($location.search().redirect) {
                            $location.path($location.search().redirect);
                            $location.search({redirect : null});
                        }
                        else
                            $location.path('/portfolio');
                    })
                    .catch(function(error) {
                        toastr.error(error.data.message);
                    });
            };

            $scope.resetPassword = function(){

                $('#login').modal('toggle');
                $timeout(function() {
                    $location.path('/request-password-reset');
                },100);
            };

            $scope.switchSignUp = function() {
                $('#login').modal('toggle');
                $('#signup').modal('toggle');
            };

            // Location Change

            $rootScope.$on("$locationChangeSuccess", function() {

                /** GOOGLE ANALYTICS */
                if ($window.ga) {
                    try {
                        $window.ga('set', 'userId', user.id);
                        $window.ga('set', 'email', user.email);
                    } catch (e) {
                    }

                    $window.ga('send', 'pageview', {page: $location.path()});
                }

                // Scroll to top
                $timeout(function () {
                    $anchorScroll('top-nav');
                });

            });

            $rootScope.$on('$locationChangeStart', function(event, next, current) {

                var nextUrl = next.toLowerCase();
                var validationRedirect = false;

                // Force reload of app if older than 12 hours
                $scope.now = new Date().getTime();
                if (($scope.now - $scope.startTime) > (12*60*60*1000))
                    $window.location.reload();

                // Check to display footer
                $scope.noFooter = false;
                _.each($scope.noFooterArray, function(item) {
                    if (nextUrl.indexOf(item) >= 0)
                        $scope.noFooter = true;
                });

                // Check if login is required
                $scope.loginRequired = false;
                _.each($scope.authenticatedArray, function(item) {
                    if (nextUrl.indexOf(item) >= 0)
                        $scope.loginRequired = true;
                });

                // Check if user is validating
                if ((nextUrl.indexOf('/validate') >= 0))
                    validationRedirect = true;

                // Check if user is logging out
                if ((nextUrl.indexOf('/logout') >= 0))
                    validationRedirect = true;

                // User is Authenticated
                if ($scope.isAuthenticated()) {
                    UserService.getProfile()
                        .then(function (response) {

                            var user = response.data;
                            $scope.user = user;
                            localStorage.setUser(user);

                            // User is not valid
                            if ((!$scope.isValid()) && (!validationRedirect)) {
                                toastr.success('Please Validate');
                                event.preventDefault();
                                $location.path('/validate');
                            }
                        })
                        .catch(function (response) {
                            toastr.error(response.data.message);
                        });
                }
                // User is not Authenticated
                else {
                    if (($scope.loginRequired)) {
                        var redirect = $location.path();
                        event.preventDefault();
                        $location.path('/login').search({'redirect': redirect});
                    }
                }
            });

            $.fn.extend({
                animateCss: function (animationName) {
                    var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
                    $(this).addClass('animated ' + animationName).one(animationEnd, function() {
                        $(this).removeClass('animated ' + animationName);
                    });
                }
            });
        }]);
