angular.module('MyApp')
    .controller('InitCtrl', ["$scope", "$auth", "$http", "UserService", "toastr", "$location", "localStorage", "_", "$rootScope", "$document", "$timeout", "$window", "$anchorScroll", "deviceDetector",
        function($scope, $auth, $http, UserService, toastr, $location, localStorage, _, $rootScope, $document, $timeout, $window, $anchorScroll, deviceDetector) {

            /**
             |------------------------------------------------------
             | INIT - Injected on main.ejs, run once when app is loaded
             |------------------------------------------------------
             */

            // Used to check if webapp is accessible
            $scope.isLoaded = function() {
                return true;
            };

            $scope.deviceDetectorValue = deviceDetector;

            // Allowed unauthenticated pages
            $scope.validate = ["/validate", "/logout", "/login", "/portfolio/", "/reset-password/"];

            // Pages to hide footer
            $scope.noFooterArray = ["/signup"];

            $scope.isAuthenticated = function() {
                return $auth.isAuthenticated();
            };

            $scope.isValid = function() {
                if (($scope.isAuthenticated()) && (typeof $scope.user !== 'undefined'))
                    return $scope.user.isValid || false;
                else
                    return false;
            };

            $rootScope.$on("$locationChangeSuccess", function() {
                // Scroll to top
                $timeout(function () {
                    $anchorScroll('top-nav');
                });
            });

            $rootScope.$on('$locationChangeStart', function(event, next, current) {

                var validationRedirect = false;

                // Check if user is validating
                if ((next.toLowerCase().indexOf('/validate') >= 0))
                    validationRedirect = true;

                // Check if user is validating
                $scope.noFooter = false;
                _.each($scope.noFooterArray, function(item) {
                    if (next.toLowerCase().indexOf(item) >= 0)
                        $scope.noFooter = true;
                });

                // Check if user is not valid && check if user is not authenticated
                if ((!$scope.isValid()) && ($scope.isAuthenticated()) && (validationRedirect == false)) {

                    $scope.loading = true;

                    UserService.getProfile()
                        .then(function (response) {

                            var user = response.data;
                            $scope.user = user;
                            localStorage.setUser(user);

                            if (($scope.isAuthenticated()) && ($scope.isValid()) && (typeof next !== "undefined")) {
                                // Authenticated, Valid
                            }
                            else {
                                toastr.success('Please Validate');
                                $location.path('/validate');
                            }
                            $scope.loading = false;
                        })
                        .catch(function (response) {
                            location.path('/logout');
                            $scope.loading = false;
                        });
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
