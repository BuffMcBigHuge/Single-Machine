angular.module('MyApp')
    .factory('UserService', function($http) {
        return {
            getProfile : function() {
                return $http.get('/api/v1/user/me');
            },
            updateProfile : function(data) {
                return $http.put('/api/v1/user/me', data);
            },
            getAllProfiles : function() {
                return $http.get('/api/v1/user/all');
            },
            getIntern : function(data) {
                return $http.post('/api/v1/user/suggested', {data : data});
            },
            getUserProfile : function(data) {
                return $http.get('/api/v1/user/profile/' + data);
            },
            requestPasswordReset : function(data){
                return $http.post('/api/v1/user/password-forgot', data)
            },
            resetPassword : function(token, data){
                return $http.post('/api/v1/user/reset-password/'+ token, data)
            }
        };
    });
