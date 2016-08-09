angular.module('MyApp')
    .component('dashboardGridView',{
        templateUrl : '/partials/dashboard/dashboardGridView.html',
        controller : dashboardGridViewController,
        bindings : {
            program : '='
        },
        scope: true
    });

function dashboardGridViewController(SubmissionService, $location, localStorage, _, ProgramService, toastr) {

    var ctrl = this;
    ctrl.projects = [];
    ctrl.submissions = [];
    ctrl.strengths = [];

    //ctrl.loading = true;

    ctrl.totalSections = 0;
    ctrl.totalDoneSections = 0;
    ctrl.totalPercentage = 0;

    ctrl.data = {};

    ctrl.pendingNum = 0;
    ctrl.progressNum = 0;
    ctrl.publishedNum = 0;

    ctrl.data.program = {};
    ctrl.data.program.projects = [];
    ctrl.data.submissions = [];

    ctrl.ids = [];
    
    ctrl.editProject = function(data) {
        $location.path('/submission/edit/'+data);
    };
    
    ctrl.archiveProgram = function() {
        toastr.success('Coming soon!');
    };

    ctrl.init = function() {

        ctrl.user = JSON.parse(localStorage.getUser());

        //Get Dashboard Program Projects
        ProgramService.getProgram(ctrl.program._id)
            .then(function (response) {

                ctrl.program = response.data;
                ctrl.data.program.projects = angular.copy(ctrl.program.projects);

                _.each(ctrl.data.program.projects, function(project) {

                    project.sections = project.data.length;
                    project.doneSections = 0;
                    project.percentage = 0;
                    ctrl.totalSections += project.sections;

                    ctrl.strengths = ctrl.strengths.concat(project.strengths);

                });

                ctrl.strengths = _.uniq(ctrl.strengths, false, function(strength) {
                    return strength.value;
                });

                //Get Submissions
                SubmissionService.getMySubmissions()
                    .then(function(response) {

                        ctrl.submissions = response.data;
                        ctrl.data.submissions = angular.copy(ctrl.submissions);

                        _.each(ctrl.data.submissions, function(submission) {

                            if (submission.data) {

                                var sections = submission.data.length;
                                var doneSections = 0;

                                _.each(submission.data, function (data) {
                                    if (data.hasOwnProperty('userInput'))
                                        doneSections++;
                                });

                                var percentage = doneSections / sections;
                                submission.sections = sections;
                                submission.doneSections = doneSections;
                                submission.percentage = percentage;

                                ctrl.totalDoneSections += doneSections;
                                ctrl.totalPercentage = Math.round((ctrl.totalDoneSections / ctrl.totalSections) * 100);
                            }

                        });

                        if (ctrl.data.submissions.length == 0) {

                            _.each(ctrl.data.program.projects, function(project){
                                ctrl.pendingNum++;
                                project.pending = true;
                                ctrl.progressNum = 0;
                                ctrl.completeNum = 0;
                            });

                        }
                        else {

                            _.each(ctrl.data.submissions, function(submission) {
                                ctrl.ids.push(submission.projectId);
                            });

                            _.each(ctrl.data.program.projects, function(project) {
                                _.each(ctrl.data.submissions, function(submission) {

                                    if (ctrl.ids.indexOf(project._id) > -1) {
                                        if (project._id == submission.projectId) {
                                            project.published = submission.published;
                                            project.percentage = submission.percentage;

                                            if (project.published == true) {
                                                project.pending = false;
                                                project.progress = false;
                                            }
                                            else {
                                                if (project.percentage < 1) {
                                                    project.progress = true;
                                                    project.pending = false;
                                                }
                                                if (project.percentage == 1) {
                                                    project.progress = false;
                                                    project.pending = false;
                                                }
                                            }
                                        }
                                    }
                                    else {
                                        project.pending = true;
                                    }
                                });

                                if (project.progress == true) {
                                    ctrl.progressNum++;
                                }
                                else if (project.published == true) {
                                    ctrl.publishedNum++;
                                }
                                else if (project.pending == true) {
                                    ctrl.pendingNum++;
                                }

                            });
                        }
                    });
            });

    }();
}

// EOF
