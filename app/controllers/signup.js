angular.module("MyApp")
    .controller('SignupCtrl', ["$scope", "$auth", "toastr", "UserService", "$location", "$http", "localStorage", "$state", "$anchorScroll", "$timeout",
        function($scope, $auth, toastr, UserService, $location, $http, localStorage, $state, $anchorScroll, $timeout) {

            $scope.user = {};
            $scope.user.email = '';
            $scope.user.password = '';
            $scope.name = '';
            $scope.firstName = '';
            $scope.lastName = '';
            $scope.signupView = false;
            $scope.showVideo = false;
            
            // SIGNUP

            $scope.signUp = function() {
                
                $('#signup').modal('toggle');

                $scope.user.isBusiness = false;
                $scope.user.isValid = false;
                $scope.user.displayName = {};

                /*
                var fullName = $scope.name.trim().split(' ');
                var firstName = fullName[0];
                if (fullName.length == 1) {
                    var lastName = '';
                    var middleName = '';
                }
                if (fullName.length == 2) {
                    var lastName = fullName[1];
                    var middleName = '';
                }
                else if (fullName.length > 2) {
                    var lastName = fullName[fullName.length-1];
                    fullName[0] = '';
                    fullName[fullName.length-1] = '';
                    var middleName = fullName.join(' ').trim();
                }
                */

                $scope.user.displayName.firstName = $scope.firstName;
                //$scope.user.displayName.middleName = middleName;
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

                $('#login').modal('toggle');

                $auth.login($scope.user)
                    .then(function() {
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
            
            // VIDEO
            
            $scope.toggleVideo = function() {
                $scope.showVideo = !$scope.showVideo;
                if ($scope.showVideo)
                    $('#video').animateCss('bounceIn');
                else
                    $('#video').animateCss('bounceOut');
            };

            $scope.stopVideo = function(){
                $('#video').animateCss('bounceOut');
                $scope.showVideo = false;
            };

            $scope.init = function() {

                $anchorScroll('top-nav');

            }();

        }]);