angular.module('MyApp')
    .controller('StaticCtrl', ["$scope", "$auth", "$http", "$timeout", "$anchorScroll",
        function($scope, $auth, $http, $timeout, $anchorScroll) {

        $scope.loading = true;
        
        $timeout(function () {
            $scope.loading = false;
        }, 200);

        $scope.init = function() {
            $anchorScroll('top-nav');
        }();

    }]);
