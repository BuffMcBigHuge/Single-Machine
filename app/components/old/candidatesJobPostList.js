angular.module('MyApp')
    .component('candidatesJobPostList',{
        templateUrl:'/partials/candidatesJobPostList.html',
        controller:jobPostListController,
        bindings:{
            job: '=',
            user: '='
        }
    });

function jobPostListController(toastr, UserService, localStorage){

    var ctrl = this;

    // Toggle pin status
    ctrl.init = function(data){
        data.status = true;
    };

    // Toggle pin change status to show job location and apply button
    ctrl.changeStatus = function(data){
        data.status = !data.status;
    };

    // check which one the user has already apply
    for(var i =0;i<ctrl.user.apply.length;i++){
        if(ctrl.user.apply[i] == ctrl.job._id){
            ctrl.job.alreadyapply = true;
        }
    }

    // Candidates apply job
    ctrl.applyJob = function (data) {

        if (typeof ctrl.user.apply === 'undefined')
            ctrl.user.apply = [];

        // add to user apply job array
        ctrl.user.apply.push(data._id);

        UserService.updateProfile(ctrl.user)
            .then(function (response) {

                ctrl.user = response.data;
                localStorage.setUser(ctrl.user);

                toastr.success('success apply');
                data.appliedStatus = true;
                ctrl.appliedDate = new Date().toJSON().slice(0,10);
        });
    };

}