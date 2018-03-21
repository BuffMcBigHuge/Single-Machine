angular.module('MyApp')
    .factory("localStorage", function($window, $rootScope) {

        $rootScope.memoryStorage = {};

        return {
            setUser: function(user) {

                try {
                    if (typeof $window.localStorage !== 'undefined') {
                        $window.localStorage.setItem('user', JSON.stringify(user))
                    }
                    else {
                        $rootScope.memoryStorage['user'] = JSON.stringify(user);
                    }
                }
                catch (e) {
                    console.warn('LocalStorage not available. Are you browsing privately?');
                    $rootScope.memoryStorage['user'] = JSON.stringify(user);
                }

                return this;
            },
            getUser: function() {

                var value;

                try {

                    if (typeof $window.localStorage !== 'undefined') {
                        value = $window.localStorage.getItem('user') || $rootScope.memoryStorage['user'];
                    }
                    else {
                        value = $rootScope.memoryStorage['user'];
                    }
                } catch (e) {
                    console.warn('LocalStorage not available. Are you browsing privately?');
                    value = $rootScope.memoryStorage['user'];
                }

                return value || null;

            },
            setData: function(item, data) {

                try {
                    if (typeof $window.localStorage !== 'undefined') {
                        $window.localStorage.setItem(item, JSON.stringify(data));
                    }
                    else {
                        $rootScope.memoryStorage[item] = data;
                    }
                }
                catch (err) {
                    console.warn('LocalStorage not available. Are you browsing privately?');
                    $rootScope.memoryStorage[item] = data;
                }

                return this;
            },
            getData: function(item) {

                var value;

                try {

                    if (typeof $window.localStorage !== 'undefined') {
                        value = $window.localStorage.getItem(item) || $rootScope.memoryStorage[item];
                    }
                    else {
                        value = $rootScope.memoryStorage[item];
                    }
                } catch (e) {
                    console.warn('LocalStorage not available. Are you browsing privately?');
                    value = $rootScope.memoryStorage[item];
                }

                return value || null;

            },
            deleteData: function() {

                try {
                    $window.localStorage.setItem('user', null);
                    $window.localStorage.removeItem('user');
                    $window.localStorage.clear();
                    window.localStorage.clear();
                } catch(e) {
                    $rootScope.memoryStorage = {};
                }

            }
        };
    });
