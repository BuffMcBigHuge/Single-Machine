angular.module('MyApp')
    .component('businessJobPostList', {
        templateUrl : '/partials/businessJobPostList.html',
        controller : jobPostListController,
        bindings : {
            job : '='
        }
    });

function jobPostListController(JobService,toastr) {
    
    var ctrl = this;

    // Toggle button status
    ctrl.init = function(data){
        data.status = true;
    };

    // Toggle button change status to show delete button
    ctrl.changeStatus = function(data){
        data.status = !data.status;
    };

    // Delete job post function
    ctrl.deletePost = function(data){
        data.delete = true;
        setTimeout(function(){
            data.moveup = true;
            JobService.deletePost(data)
                .then(function(response){
                    toastr.success('Delete Successfully');
                })
        }, 200);
    };
    
}