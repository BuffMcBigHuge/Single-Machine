angular.module('MyApp')
    .controller('ListCtrl', function($scope, $auth, $http, UserService, toastr, $state) {
        
        $scope.userList = [];
        $scope.loading = true;

        $scope.goToProfile = function(profileData) {
            $state.go("other-profile",{
                userId : profileData
            });
        };

        $scope.getAllUsers = function() {
            UserService.getAllProfiles()
                .then(function(response) {
                    $scope.userList = response.data;
                    $scope.loading = false;
                })
                .catch(function(response) {
                    toastr.error(response.data.message, response.status);
                });
        };

        $scope.init = function () {
            $scope.getAllUsers();
        }();
    });