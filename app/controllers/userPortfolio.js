angular.module('MyApp')
    .controller('UserPortfolioCtrl', ["$scope", "$state", "$auth", "toastr", "$stateParams", "$http", "UserService", "localStorage", "ModalService", "$location", "_", "$anchorScroll",
        function($scope, $state, $auth, toastr, $stateParams, $http, UserService, localStorage, ModalService, $location, _, $anchorScroll) {

            // URL PARAMETER
            $scope.userId = $stateParams.userId;

            // DATA
            $scope.data = {};
            $scope.data.user = {};
            $scope.data.user.picture = '';
            $scope.data.user.displayName = {
                firstName: '',
                middleName: '',
                lastName: ''
            };
            $scope.data.user.bioSummary = '';

            $scope.loading = true;

            // INIT

            $scope.init = function() {

                $anchorScroll('top-nav');

                UserService.getUserProfile($scope.userId)
                    .then(function (response) {

                        $scope.data.user = response.data;
                        $scope.loading = false;
                    })
                    .catch(function(response) {
                        toastr.error(response.data.message, response.status);
                    });
            }();

        }]);
