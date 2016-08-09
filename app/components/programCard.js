angular.module('MyApp')
    .component('programCard',{
        templateUrl : '/partials/program/programCard.html',
        controller : programCardController,
        bindings : {
            program: '='
        },
        scope : true
    });

function programCardController(ProgramService, toastr, _, localStorage, $location) {
    
    var ctrl = this;
    ctrl.user = {};
    ctrl.isMine = false;

    ctrl.deleteProgram = function() {
        ctrl.delete = true;
        setTimeout(function(){
            ProgramService.deleteProgram(ctrl.program)
                .then(function(response){
                    toastr.success('Program Deleted');
                })
                .catch(function (err) {
                    toastr.error(err.data.message, err.status);
                });
        }, 200);
    };

    ctrl.editProgram = function() {
        $location.path('/programs/'+ctrl.program._id);
    };
    
    ctrl.programClick = function() {
        if (!ctrl.program.demo)
            $location.path('/program/'+ctrl.program._id);
    };

    ctrl.getUser = function() {
        ctrl.user = JSON.parse(localStorage.getUser());

        var creatorIds = _.map(ctrl.program.creatorId, function (creatorId) {
            // Check if _id or full object
            if (typeof creatorId === 'object')
                return creatorId._id;
            else
                return creatorId;
        });

        if ((ctrl.program.creatorId) && ((creatorIds.indexOf(ctrl.user._id)) >= 0))
            ctrl.isMine = true;

    }();
}

// EOF
