angular.module('MyApp')
    .directive('imgCroppie', [
        function($compile) {
            return {
                restrict: 'AE',
                scope: {
                    src: '=',
                    dimensions: '=',
                    type: '@',
                    zoom: '@',
                    mousezoom: '@',
                    update: '=',
                    orientation: '=',
                    ngModel: '='
                },
                link: function(scope, elem, attr) {

                    scope.$watch('scope.dimensions', function() {

                        var options = {};
                        var results = {};
                        var bind = {};

                        var setParams = function () {

                            scope.dimensions = scope.dimensions || {};
                            scope.output_width = scope.dimensions.output_width || 500;
                            scope.output_height = scope.dimensions.output_height || 500;
                            scope.viewport_width = scope.dimensions.viewport_width || 500;
                            scope.viewport_height = scope.dimensions.viewport_height || 500;
                            scope.boundary_width = scope.dimensions.boundary_width || 600;
                            scope.boundary_height = scope.dimensions.boundary_height || 600;
                            scope.orientation = scope.orientation || 1;

                            if (scope.viewport_width > scope.boundary_width)
                                scope.viewport_width = scope.boundary_width;

                            if (scope.viewport_height > scope.boundary_height)
                                scope.viewport_height = scope.boundary_height;

                            var zoom = (scope.zoom === "true"),
                                mouseZoom = (scope.mousezoom === "true");

                            options = {
                                viewport: {
                                    width: scope.viewport_width,
                                    height: scope.viewport_height,
                                    type: scope.type || 'square'
                                },
                                boundary: {
                                    width: scope.boundary_width,
                                    height: scope.boundary_height
                                },
                                enableOrientation: true,
                                backgroundColor: '#FFFFFF',
                                enableZoom: zoom,
                                mouseWheelZoom: mouseZoom
                            };

                            results = {
                                size: {
                                    width: scope.output_width,
                                    height: scope.output_height
                                },
                                type: 'canvas',
                                format: 'jpeg',
                                backgroundColor: '#FFFFFF',
                                quality: 0.8
                            };

                            bind = {
                                url: scope.src,
                                orientation: scope.orientation
                            };

                            /*
                            if (scope.update != undefined) {
                                options.update = scope.update
                            }
                            */

                        };

                        var updateImage = function() {
                            if (scope.src != undefined) {
                                setParams();
                                c.bind(bind);
                                c.result(results).then(function(img) {
                                    scope.$apply(function() {
                                        scope.ngModel = img;
                                    });
                                });
                            }
                        };

                        scope.$watch('src', function() {
                            updateImage();
                        });
                        
                        var intervalID = window.setInterval(function() {
                            if (scope.src != undefined) {
                                c.result(results).then(function (img) {
                                    scope.$apply(function () {
                                        scope.ngModel = img;
                                    });
                                })
                            }
                        }, 500);

                        scope.$on("$destroy",
                            function(event) {
                                //updateImage();
                                clearInterval(intervalID);
                            }
                        );

                        setParams();
                        var c = new Croppie(elem[0], options);

                    });
                        
                }

            };
        }
    ]);