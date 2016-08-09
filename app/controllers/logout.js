angular.module('MyApp')
    .controller('LogoutCtrl', ["$location", "$auth", "toastr", "$window",
        function($location, $auth, toastr, $window) {
        
        if (!$auth.isAuthenticated())
            return;
        
        $auth.logout()
            .then(function() {
                $window.localStorage.clear();
                toastr.success('Logged Out');
                $location.path('/');
                $window.location.reload();
            });
    }]);