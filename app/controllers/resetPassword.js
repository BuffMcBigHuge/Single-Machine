angular.module("MyApp")
    .controller('ResetPasswordCtrl', ["$scope", "UserService","toastr","$stateParams","$location",
        function($scope,UserService,toastr, $stateParams,$location) {

            $scope.data = {
                password: ''
            };

            $scope.submit = function(){
                UserService.resetPassword($stateParams.token, $scope.data)
                    .then(function(response){
                        toastr.success('Update Password Successful');
                        $location.url('/candidate/signup');
                    })
                    .catch(function(err){
                        toastr.error(err.data.message);
                    })
            }

        }]);