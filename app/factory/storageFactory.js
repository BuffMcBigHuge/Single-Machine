angular.module('MyApp')
    .factory("localStorage", function($window) {
        return {
            setUser: function(user) {
                $window.localStorage && $window.localStorage.setItem('user', JSON.stringify(user));
                return this;
            },
            getUser: function() {
                return $window.localStorage && $window.localStorage.getItem('user');
            },
            setData: function(data) {
                $window.localStorage && $window.localStorage.setItem('data', JSON.stringify(data));
                return this;
            },
            getData: function() {
                return $window.localStorage && $window.localStorage.getItem('user');
            }
        };
    });
