angular.module('MyApp')
    .controller('ValidateCtrl', ["$scope", "toastr", "$location", "vcRecaptchaService", "$http", "$anchorScroll",
        function($scope, toastr, $location, vcRecaptchaService, $http, $anchorScroll) {

            $scope.response = null;
            $scope.widgetId = null;
    
            $scope.model = {
                key: '6Lehgh4TAAAAAM3Z3zLT3p9Nw31EpO8SJVMBgWAB'
            };
    
            $scope.setResponse = function (response) {
                $scope.response = response;
            };
    
            $scope.setWidgetId = function (widgetId) {
                $scope.widgetId = widgetId;
            };
    
            $scope.cbExpiration = function() {
                vcRecaptchaService.reload($scope.widgetId);
                $scope.response = null;
            };
    
            $scope.submit = function () {
    
                $http({
                    method: 'POST',
                    url: '../api/v1/auth/validate',
                    data: {'value': $scope.response}
                }).then(function (response) {
    
                    if (response.status == '200') {
    
                        toastr.success('Validation Success');
                        $location.path('/portfolio');
    
                    } else {
                        toastr.error('Error in validating.');
                        $scope.cbExpiration();
                    }
                });
    
            };
            
            $scope.init = function() {
                $anchorScroll('top-nav');
            }();
            
    }]);
