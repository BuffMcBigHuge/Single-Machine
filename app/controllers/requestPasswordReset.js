angular.module("MyApp")
    .controller('RequestPasswordResetCtrl', ["$scope", "UserService","toastr",
        function($scope,UserService,toastr) {

            $scope.data = {
                email: ''
            };
            $scope.done = false;

            $scope.submit = function(){
                UserService.requestPasswordReset($scope.data)
                    .then(function(response){
                        toastr.success('Submit Successful');
                        $scope.done = true;
                    })
                    .catch(function(err){
                        console.log(err);
                        toastr.error(err.data.message);
                    })
            }
        }]);