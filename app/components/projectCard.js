angular.module('MyApp')
    .component('projectCard',{
        templateUrl : '/partials/project/projectCard.html',
        controller : projectCardController,
        bindings : {
            project : '=',
            clickable : '='
        },
        scope: true
    });

function projectCardController(ProjectService, toastr, localStorage, $scope, $location) {
    
    var ctrl = this;
    
    /*
    ctrl.user = {};
    ctrl.isMine = false;

    ctrl.deleteProject = function() {
        ctrl.delete = true;
        setTimeout(function(){
            ProjectService.deleteProject(ctrl.project)
                .then(function(response){
                    toastr.success('Project Deleted');
                })
                .catch(function (err) {
                    toastr.error(err.data.message, err.status);
                });
        }, 200);
    };

    ctrl.editProject = function() {
        $location.path('/project/edit/'+ctrl.project._id);
    };

    ctrl.getUser = function() {
        ctrl.user = JSON.parse(localStorage.getUser());

        if ((ctrl.project.creatorId) && ((ctrl.project.creatorId.indexOf(ctrl.user._id)) > -1))
            ctrl.isMine = true;
    }();
    */
}

// EOF
