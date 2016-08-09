angular.module('MyApp')
    .component('dashboardSubmissionView',{
        templateUrl : '/partials/dashboard/dashboardSubmissionView.html',
        controller : dashboardSubmissionViewController,
        bindings : {
            submission : '='
        },
        scope: true
    });

function dashboardSubmissionViewController(_, localStorage) {

    var ctrl = this;

    ctrl.init = function() {

        ctrl.user = JSON.parse(localStorage.getUser());

        if (ctrl.submission) {
            ctrl.sections = ctrl.submission.data.length;
            ctrl.doneSections = 0;

            _.each(ctrl.submission.data, function (data) {
                if (data.hasOwnProperty('userInput'))
                    ctrl.doneSections++;
            });

            ctrl.percentage = (ctrl.doneSections / ctrl.sections) * 100;
        }

    }();
}

// EOF
