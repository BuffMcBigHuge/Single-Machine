angular.module('MyApp')
    .factory('UploadService',function ($http){
        return {
            uploadUser : function(type, file) {
                var fd = new FormData();
                fd.append('type', type);
                fd.append('files', file);

                return $http({
                    method: 'POST',
                    url: '/api/v1/upload/user',
                    data: fd,
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                });
            },
            uploadProject : function(type, file, project) {
                var fd = new FormData();
                fd.append('type', type);
                fd.append('files', file);
                fd.append('project', JSON.stringify(project));

                return $http({
                    method: 'POST',
                    url: '/api/v1/upload/project',
                    data: fd,
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                });
            },
            uploadSubmission : function(type, file, submission) {
                var fd = new FormData();
                fd.append('type', type);
                fd.append('files', file);
                fd.append('submission', JSON.stringify(submission));

                return $http({
                    method: 'POST',
                    url: '/api/v1/upload/submission',
                    data: fd,
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                });
            },
            uploadProgram : function(type, file, program) {
                var fd = new FormData();
                fd.append('type', type);
                fd.append('files', file);
                fd.append('program', JSON.stringify(program));

                return $http({
                    method: 'POST',
                    url: '/api/v1/upload/program',
                    data: fd,
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                });
            }
        }
    });
