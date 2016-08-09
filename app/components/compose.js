angular.module('MyApp')
    .component('compose', {
        templateUrl : '/partials/project-components/compose.html',
        controller : composeController,
        bindings : {
            index : '=',
            project : '=',
            submission : '='
        }
    });

function composeController(toastr, ModalService, UploadService) {

    var ctrl = this;

    // IMAGE

    var insertImageProject = function (context) {

        if (!ctrl.project) {
            toastr.error('There was an error.');
            return;
        }

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
                            type: 'uploadImageModal'
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

    var insertImageSubmission = function (context) {

        if (!ctrl.submission) {
            toastr.error('There was an error.');
            return;
        }
        
        var ui = $.summernote.ui;
        var button = ui.button({
            contents: '<i class="fa fa-picture-o"/>',
            tooltip: 'Insert an Image',
            click: function () {

                context.invoke('editor.saveRange');

                ModalService.showModal({
                    templateUrl: '../partials/uploadImageModal.html',
                    controller: "ModalController",
                    inputs : {
                        data : {
                            type: 'uploadImageModal'
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

                        UploadService.uploadSubmission('image', file, ctrl.submission)
                            .then(function(response) {

                                context.invoke('editor.restoreRange');
                                context.invoke('editor.focus');
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

    var insertPdfProject = function (context) {

        if (!ctrl.project) {
            toastr.error('There was an error.');
            return;
        }
        
        var ui = $.summernote.ui;
        var button = ui.button({
            contents: '<i class="fa fa-file-pdf-o"/>',
            tooltip: 'Insert a PDF',
            click: function () {

                context.invoke('editor.saveRange');

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

                                        context.invoke('editor.restoreRange');
                                        context.invoke('editor.focus');
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

    var insertPdfSubmission = function (context) {

        if (!ctrl.submission) {
            toastr.error('There was an error.');
            return;
        }
        
        var ui = $.summernote.ui;
        var button = ui.button({
            contents: '<i class="fa fa-file-pdf-o"/>',
            tooltip: 'Insert a PDF',
            click: function () {

                context.invoke('editor.saveRange');

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
                        
                        UploadService.uploadSubmission('pdf', pdf, ctrl.submission)
                            .then(function(pdfResponse) {

                                UploadService.uploadSubmission('image', image, ctrl.submission)
                                    .then(function(imageResponse) {

                                        var node = $('<a target="_blank" href="'+pdfResponse.data.data+'"><img src="'+imageResponse.data.data+'" /></a>');

                                        context.invoke('editor.restoreRange');
                                        context.invoke('editor.focus');
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
    ctrl.summernote.options = [
        {
            toolbar: [
                ['style', ['bold', 'italic']],
                ['insert', ['link']],
                ['para', ['paragraph', 'ul', 'ol']],
                ['custom', ['insertImage', 'insertPdf']]
            ],
            buttons: {
                insertImage: insertImageProject,
                insertPdf: insertPdfProject
            }
        },
        {
            toolbar: [
                ['style', ['bold', 'italic']],
                ['insert', ['link']],
                ['para', ['paragraph', 'ul', 'ol']],
                ['custom', ['insertImage', 'insertPdf']]
            ],
            buttons: {
                insertImage: insertImageSubmission,
                insertPdf: insertPdfSubmission
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