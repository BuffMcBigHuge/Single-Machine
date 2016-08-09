angular.module('MyApp')
    .component('submissionPortfolioCard',{
        templateUrl : '/partials/submission/submissionPortfolioCard.html',
        controller : submissionPortfolioCardController,
        bindings : {
            submission : '=',
            clickable : '=',
            showpopup : '='
        }
    });

function submissionPortfolioCardController(_, SubmissionService, toastr, localStorage) {
    
    var ctrl = this;

    ctrl.canReview = false;
    ctrl.selectedCompose = 0;

    _.each(ctrl.submission.data, function (module) {
        module.editMode = false;
        module.isCreator = false;
    });

    ctrl.switchCompose = function(index) {
        
        ctrl.view = 'compose'+index+'_'+ctrl.submission._id;
        $('.white-button-3').removeClass('selected');
        $('#'+ctrl.view).addClass('selected');
        ctrl.selectedCompose = index;
    };

    ctrl.dismiss = function() {
        $('#'+'submission'+ctrl.submission._id).modal('toggle');
    };

    ctrl.submitReview = function() {

        if (!ctrl.submission.reviewerId) {

            ctrl.submission.reviewerId = ctrl.user._id;

            SubmissionService.updateSubmission(ctrl.submission)
                .then(function (response) {
                    toastr.success('Submission Reviewed');
                    
                    ctrl.submission.reviewerId = angular.copy(ctrl.user);
                })
                .catch(function (response) {
                    toastr.error(response.data.message, response.status);
                });
        }
        else {
            toastr.error('Removing Reviews Not Implemented');
        }

    };

    ctrl.switchCompose(ctrl.selectedCompose);

    ctrl.getUser = function() {

        ctrl.user = JSON.parse(localStorage.getUser());

        if ((ctrl.user) && (ctrl.user.isBusiness) && (ctrl.user.displayName) && (ctrl.user.displayName.firstName) && (ctrl.user.displayName.lastName))
            ctrl.canReview = true;

    }();

}
