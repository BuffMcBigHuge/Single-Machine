angular.module('MyApp').controller('LogoutCtrl', ["$scope", "$location", "$auth", "toastr", "$window", "localStorage", "$timeout",
    function($scope, $location, $auth, toastr, $window, localStorage, $timeout) {

        $scope.init = function() {

            toastr.success('Logged Out');
            $auth.logout();
            //$window.location.reload();
            localStorage.deleteData();

            $timeout(function () {
                localStorage.deleteData();
                $location.path('/');
            }, 200);

        }();

}]);