angular.module('MyApp')
    .component('header', {
        templateUrl : '/partials/project-components/header.html',
        controller : mainController,
        bindings : {
            data : '=',
            index : '='
        }
    })
    .component('text', {
        templateUrl : '/partials/project-components/text.html',
        controller : mainController,
        bindings : {
            data : '=',
            index : '='
        }
    })
    .component('richText', {
        templateUrl : '/partials/project-components/richText.html',
        controller : mainController,
        bindings : {
            data : '=',
            index : '='
        }
    })
    .component('textInput', {
        templateUrl : '/partials/project-components/textInput.html',
        controller : mainController,
        bindings : {
            data : '=',
            index : '='
        }
    })
    .component('richTextInput', {
        templateUrl : '/partials/project-components/richTextInput.html',
        controller : mainController,
        bindings : {
            data : '=',
            index : '='
        }
    })
    .component('imageUpload', {
        templateUrl : '/partials/project-components/imageUpload.html',
        controller : mainController,
        bindings : {
            data : '=',
            index : '=',
            project : '<'
        }
    })
    .component('imageInput', {
        templateUrl : '/partials/project-components/imageInput.html',
        controller : mainController,
        bindings : {
            data : '=',
            index : '='
        }
    })
    .component('pdf', {
        templateUrl : '/partials/project-components/pdf.html',
        controller : mainController,
        bindings : {
            data : '=',
            index : '='
        }
    })
    .component('pdfInput', {
        templateUrl : '/partials/project-components/pdfInput.html',
        controller : mainController,
        bindings : {
            data : '=',
            index : '='
        }
    })
    .component('compose', {
        templateUrl : '/partials/project-components/compose.html',
        controller : mainController,
        bindings : {
            data : '=',
            index : '=',
            project : '<'
        }
    })
    .component('challenge', {
        templateUrl : '/partials/project-components/challenge.html',
        controller : mainController,
        bindings : {
            data : '=',
            index : '=',
            project : '<'
        }
    });


function mainController(toastr, ModalService, UploadService) {

    var ctrl = this;
    
    // IMAGE

    var insertImage = function (context) {
        var ui = $.summernote.ui;
        var button = ui.button({
            contents: '<i class="fa fa-picture-o"/>',
            tooltip: 'Insert an Image',
            click: function () {

                ModalService.showModal({
                    templateUrl: '../partials/uploadImageModal.html',
                    controller: "ModalController",
                    inputs : {
                        data : {
                            type: 'uploadImageModal',
                            height: 500,
                            width: 700
                        }
                    }
                }).then(function(modal) {
                    modal.element.modal();
                    modal.close.then(function(result) {

                        if (result == 'Cancel')
                            return;

                        var file = dataURItoBlob(result);

                        if (typeof(file) !== 'object') {
                            toastr.error('There was an error.');
                            return;
                        }

                        ctrl.imageLoading = true;

                        UploadService.uploadProject('image', file, ctrl.project)
                            .then(function(response) {

                                context.invoke('editor.insertImage', response.data.data, function ($image) {
                                    $image.css('width', '100%');
                                    $image.css('height', 'auto');
                                });

                                ctrl.imageLoading = false;

                            })
                            .catch(function(error){
                                ctrl.imageLoading = false;
                                toastr.error('There was an error.');
                            });
                    });
                });
            }
        });

        return button.render();
    };
    
    // PDF

    var insertPdf = function (context) {
        var ui = $.summernote.ui;
        var button = ui.button({
            contents: '<i class="fa fa-file-pdf-o"/>',
            tooltip: 'Insert a PDF',
            click: function () {

                ModalService.showModal({
                    templateUrl: '../partials/modal/uploadPDFModal.html',
                    controller: "ModalController",
                    inputs: {
                        data: {
                            type: 'uploadPDFModal'
                        }
                    }
                }).then(function (modal) {
                    modal.element.modal();
                    modal.close.then(function (result) {

                        if (result == 'Cancel')
                            return;

                        var pdf = dataURItoBlob(result.pdf);
                        var image = dataURItoBlob(result.image);
                        var filename = result.filename;

                        if ((typeof(pdf) !== 'object') || (typeof(image) !== 'object')) {
                            toastr.error('There was an error.');
                            return;
                        }

                        ctrl.imageLoading = true;

                        UploadService.uploadProject('pdf', pdf, ctrl.project)
                            .then(function(pdfResponse) {

                                UploadService.uploadProject('image', image, ctrl.project)
                                    .then(function(imageResponse) {

                                        var node = $('<a target="_blank" href="'+pdfResponse.data.data+'"><img src="'+imageResponse.data.data+'" /></a>');

                                        context.invoke('editor.insertNode', node[0]);

                                        ctrl.imageLoading = false;

                                    })
                                    .catch(function(error){
                                        ctrl.imageLoading = false;
                                        toastr.error('There was an error.');
                                    });

                            })
                            .catch(function(error){
                                ctrl.imageLoading = false;
                                toastr.error('There was an error.');
                            });

                    });

                });

            }
        });

        return button.render();
    };

    // SUMMERNOTE
    
    ctrl.summernote = {};
    ctrl.summernote.editor = null;
    ctrl.summernote.edtiable = null;
    ctrl.summernote.options = [{
            toolbar: [
                ['style', ['bold', 'italic']],
                ['insert', ['link']],
                ['para', ['paragraph', 'ul', 'ol']]
            ]
        },
        {
            toolbar: [
                ['style', ['bold', 'italic']],
                ['insert', ['link']],
                ['para', ['paragraph', 'ul', 'ol']],
                ['para', ['paragraph', 'ul', 'ol']],
                ['custom', ['insertImage', 'insertPdf']]
            ],
            buttons: {
                insertImage: insertImage,
                insertPdf: insertPdf
            }
        }];

    ctrl.onPaste = function (e, subIndex) {

        var clipboardHTML = e.originalEvent.clipboardData.getData('text/html');
        var clipboardText = e.originalEvent.clipboardData.getData('text');
        e.preventDefault();

        var summernote = '.'+'summernote'+subIndex+ctrl.index;
        $(summernote).summernote('editor.saveRange');
        $(summernote).summernote('editor.restoreRange');
        $(summernote).summernote('editor.focus');
        $(summernote).summernote('editor.insertText', clipboardText);
    };

    ctrl.setDisabled = function(subIndex) {
        $('.'+'summernote'+subIndex+ctrl.index).summernote('disable');
    };

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
}