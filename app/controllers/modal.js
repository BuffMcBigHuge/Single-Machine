angular.module('MyApp')
    .controller('ModalController', ["$scope", "close", "data", "toastr", "UploadService", "ModalService", "_", "$anchorScroll", "$timeout", "$window",
        function($scope, close, data, toastr, UploadService, ModalService, _, $anchorScroll, $timeout, $window) {

            $scope.data = data; // Passing data from service call
            
            if (!$scope.data)
                $scope.data = {};
    
            // IMAGE

            $scope.imageLoading = false;
            $scope.myImage = null;
            $scope.myImageFile = null;
            $scope.myCroppedImage = null;
            $scope.cropper = null;
            $scope.flipX = false;
            $scope.flipY = false;
            
            if (!$scope.data.width || !$scope.data.height) {
                $scope.data.aspectRatio = Number.NaN;
                $scope.data.imageOptions = {};
            }
            else {
                $scope.data.aspectRatio = ($scope.data.width / $scope.data.height);
                $scope.data.imageOptions = {
                    width: $scope.data.width,
                    height: $scope.data.height
                };
            }

            $scope.options = {
                aspectRatio: $scope.data.aspectRatio,
                responsive: true,
                checkOrientation: true,
                center: true,
                checkCrossOrigin: true,
                guides: true,
                highlight: false,
                autoCrop: true,
                autoCropArea: 1,
                toggleDragModeOnDblclick: false,
                movable: false,
                rotatable: true,
                scalable: true,
                zoomable: false,
                zoomOnWheel: false,
                cropBoxMovable: true,
                cropBoxResizable: true
            };
            
            $scope.scaleY = function() {
                if ($scope.flipY)
                    $scope.cropper.scaleY(1);
                else
                    $scope.cropper.scaleY(-1);
                $scope.flipY = !$scope.flipY;
            };
            
            $scope.scaleX = function() {
                if ($scope.flipX)
                    $scope.cropper.scaleX(1);
                else
                    $scope.cropper.scaleX(-1);
                $scope.flipX = !$scope.flipX;
            };

            $scope.handleFileSelect = function(file) {
    
                $scope.imageLoading = true;
    
                if ((typeof file !== 'undefined') && (file)) {
                    var reader = new FileReader();
                    reader.onload = function (evt) {

                        $scope.$apply(function ($scope) {
                            
                            $scope.myImage = evt.target.result;

                            $timeout(function () {

                                var image = document.getElementById('image');

                                if ($scope.cropper)
                                    $scope.cropper.replace($scope.myImage, false);

                                if (!$scope.cropper)
                                    $scope.cropper = new Cropper(image, $scope.options);

                                $scope.imageLoading = false;

                                $timeout(function() {
                                    $(window).trigger('resize');
                                    window.dispatchEvent(new Event('resize'));
                                    $scope.cropper.reset()
                                }, 200);

                            }, 400);
                            
                        });

                    };
                    reader.readAsDataURL(file);
                }
                else {
                    $scope.myCroppedImage = null;
                    $scope.myImage = null;
                    $scope.myImageFile = null;
                    $scope.imageLoading = false;
                }
            };

            $scope.getImage = function() {
                $scope.myCroppedImage = $scope.cropper.getCroppedCanvas($scope.data.imageOptions).toDataURL();
                $scope.close($scope.myCroppedImage);
            };
    
            $scope.close = function(result) {
                close(result, 500); // close, but give 500ms for bootstrap to animate
            };
    
            $scope.init = function() {
                $anchorScroll('top-nav');
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