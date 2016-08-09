angular.module('MyApp')
    .component('submissionGridView',{
        templateUrl : '/partials/submission/submissionGridView.html',
        controller : submissionGridViewController,
        bindings : {
            submission : '=',
            clickable : '='
        },
        scope: true
    });

function submissionGridViewController(ProjectService, toastr, localStorage, $scope, $location) {

}
