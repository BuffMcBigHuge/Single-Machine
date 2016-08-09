angular.module('MyApp')
    .controller('PortfolioCtrl', ["$scope", "$state", "$auth", "toastr", "UploadService", "UserService", "localStorage", "_", "$location", "ModalService", "$timeout", "$window", "$interval", "$anchorScroll",
        function($scope, $state, $auth, toastr, UploadService, UserService, localStorage, _, $location, ModalService, $timeout, $window, $interval, $anchorScroll) {
        
            // DATA

            $scope.data = {};
            $scope.data.user = {};
            $scope.data.user.displayName = {
                firstName: '',
                middleName: '',
                lastName: ''
            };
            $scope.data.user.picture = '';
            $scope.data.user.bioSummary = '';
            $scope.editMode = false;
            $scope.loading = true;
            $scope.imageLoading = false;
            $scope.myImage = null;
            $scope.myCroppedImage = null;
    
            // PORTFOLIO

            $scope.updateProfile = function() {
                UserService.updateProfile($scope.user)
                    .then(function (response) {
    
                        $scope.user = response.data;
                        localStorage.setUser($scope.user);
    
                        $scope.removeImage();
                        toastr.success('Profile Updated');
                    })
                    .catch(function (response) {
                        toastr.error(response.data.message, response.status);
                    });
            };
    
            $scope.saveUser = function() {
                if ($scope.editMode) {
                    $scope.user.picture = angular.copy($scope.data.user.picture || $scope.user.picture);
                    $scope.user.email = angular.copy($scope.data.user.email || $scope.user.email);
                    $scope.user.bioSummary = angular.copy($scope.data.user.bioSummary || $scope.user.bioSummary);
                    $scope.updateProfile();
                    $scope.editMode = false;
                }
            };

            $scope.logout = function() {
                $location.path('/logout');
            };
    
            $scope.startEdit = function() {
                $('#saveUser').animateCss('slideInDown');
                $scope.editMode = true;
            };

            $scope.cancelEdit = function() {
                $('#saveUser').animateCss('slideOutUp');
                $scope.data.user = angular.copy($scope.user);
                $scope.removeImage();
                $scope.editMode = false;
            };
    
            $scope.checkData = function(data, name) {
                if (data == '') {
                    return "Please enter your "+name+'.';
                }
                if ((name == 'first name') && (data.length < 3)) {
                    return 'Please enter your full first name.';
                }
            };

            // PICTURE
    
            $scope.editProfilePicture = function() {
                ModalService.showModal({
                    templateUrl: '../partials/uploadImageModal.html',
                    controller: "ModalController",
                    inputs : {
                        data : {
                            type: 'uploadImageModal',
                            height: 500,
                            width: 500
                        }
                    }
                }).then(function(modal) {
                    modal.element.modal();
                    modal.close.then(function(result) {
    
                        if (result == 'Cancel') {
                        }
                        else {
                            $scope.uploadUserPicture(result);
                        }
                    });
                });
            };

            $scope.uploadUserPicture = function(img_b64) {

                $scope.imageLoading = true;

                var file = dataURItoBlob(img_b64);
                
                if (typeof(file) === 'object') {
                    UploadService.uploadUser('image', file)
                        .then(function(response) {

                            $scope.user.picture = response.data.data;
                            $scope.data.user.picture = angular.copy($scope.user.picture);
                            $scope.updateProfile();
                            $scope.removeImage();
                        })
                        .catch(function(error){
                            toastr.error('There was an error. Review your S3 settings.');
                            $scope.removeImage();
                        })
                }
                else {
                    toastr.error('Please choose an image');
                    $scope.removeImage();
                }
            };
    
            $scope.removeImage = function() {
                $scope.myImage = null;
                $scope.myCroppedImage = null;
                $scope.imageLoading = false;
            };
            
            // INIT
            
            $scope.init = function() {

                $anchorScroll('top-nav');
                
                $scope.user = JSON.parse(localStorage.getUser());
                if (!$scope.user)
                    $location.path('/');

                $scope.data.user = angular.copy($scope.user);
    
                $timeout(function () {
                    $scope.loading = false;
                }, 300);
    
            }();

            // HELPERS
            
            function dataURItoBlob(dataURI) {
                'use strict';
                var byteString,
                    mimestring;
    
                if(dataURI.split(',')[0].indexOf('base64') !== -1 ) {
                    byteString = atob(dataURI.split(',')[1])
                } else {
                    byteString = decodeURI(dataURI.split(',')[1])
                }
    
                mimestring = dataURI.split(',')[0].split(':')[1].split(';')[0]
    
                //var content = new Array();
                var content = [];
                for (var i = 0; i < byteString.length; i++) {
                    content[i] = byteString.charCodeAt(i)
                }
    
                return new Blob([new Uint8Array(content)], {type: mimestring});
            }
           
        }]);