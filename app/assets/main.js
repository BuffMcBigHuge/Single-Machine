angular.module("MyApp",["ngResource","ngMessages","ngFileUpload","toastr","ui.router","ui.bootstrap","satellizer","angularModalService","angular-velocity","underscore","xeditable","vcRecaptcha","reTree","ng.deviceDetector"]).config(["$stateProvider","$urlRouterProvider","$authProvider","$httpProvider","toastrConfig","$compileProvider","$locationProvider",function(e,t,a,o,r,n,i){e.state("main",{url:"/",templateUrl:"/partials/home.html"}).state("signup",{url:"/signup",templateUrl:"/partials/signup.html"}).state("login",{url:"/login",templateUrl:"/partials/login.html"}).state("validate",{url:"/validate",templateUrl:"/partials/validate.html",controller:"ValidateCtrl"}).state("user-list",{url:"/list",templateUrl:"/partials/userList.html",controller:"ListCtrl"}).state("logout",{url:"/logout",template:null,controller:"LogoutCtrl"}).state("portfolio",{url:"/portfolio",templateUrl:"/partials/portfolio.html",controller:"PortfolioCtrl"}).state("user-portfolio",{url:"/user/:userId",templateUrl:"/partials/userPortfolio.html",controller:"UserPortfolioCtrl"}).state("about",{url:"/about",templateUrl:"/partials/about.html",controller:"StaticCtrl"}).state("request-password-reset",{url:"/request-password-reset",templateUrl:"/partials/requestPasswordReset.html",controller:"RequestPasswordResetCtrl"}).state("reset-password",{url:"/reset-password/:token",templateUrl:"/partials/resetPassword.html",controller:"ResetPasswordCtrl"}),o.defaults.withCredentials=!0,t.otherwise("/"),angular.extend(r,{containerId:"toast-container",extendedTimeOut:1e3,iconClasses:{error:"toast-error",info:"toast-info",success:"toast-success",warning:"toast-warning"},maxOpened:0,preventOpenDuplicates:!0,messageClass:"toast-message",newestOnTop:!0,positionClass:"toast-top-center",timeOut:3e3,titleClass:"toast-title",toastClass:"toast velocity-enter-transition-FadeIn velocity-leave-transition-slideUpBigOut"}),n.debugInfoEnabled(!1),i.html5Mode({enabled:!0,requireBase:!1})}]),angular.module("MyApp").factory("localStorage",["$window","$rootScope",function(e,t){return t.memoryStorage={},{setUser:function(a){try{"undefined"!=typeof e.localStorage?e.localStorage.setItem("user",JSON.stringify(a)):t.memoryStorage.user=JSON.stringify(a)}catch(o){console.warn("LocalStorage not available. Are you browsing privately?"),t.memoryStorage.user=JSON.stringify(a)}return this},getUser:function(){var a;try{a="undefined"!=typeof e.localStorage?e.localStorage.getItem("user")||t.memoryStorage.user:t.memoryStorage.user}catch(o){console.warn("LocalStorage not available. Are you browsing privately?"),a=t.memoryStorage.user}return a||null},setData:function(a,o){try{"undefined"!=typeof e.localStorage?e.localStorage.setItem(a,JSON.stringify(o)):t.memoryStorage[a]=o}catch(r){console.warn("LocalStorage not available. Are you browsing privately?"),t.memoryStorage[a]=o}return this},getData:function(a){var o;try{o="undefined"!=typeof e.localStorage?e.localStorage.getItem(a)||t.memoryStorage[a]:t.memoryStorage[a]}catch(r){console.warn("LocalStorage not available. Are you browsing privately?"),o=t.memoryStorage[a]}return o||null},deleteData:function(){try{e.localStorage.setItem("user",null),e.localStorage.removeItem("user"),e.localStorage.clear(),window.localStorage.clear()}catch(a){t.memoryStorage={}}}}}]),function(){"use strict";var e=angular.module("angularModalService",[]);e.factory("ModalService",["$animate","$document","$compile","$controller","$http","$rootScope","$q","$templateRequest","$timeout",function(e,t,a,o,r,n,i,l,s){function u(){var t=this,r=function(e,t){var a=i.defer();return e?a.resolve(e):t?l(t,!0).then(function(e){a.resolve(e)},function(e){a.reject(e)}):a.reject("No template or templateUrl has been specified."),a.promise},u=function(t,a){var o=t.children();return o.length>0?e.enter(a,t,o[o.length-1]):e.enter(a,t)};t.showModal=function(t){var l=i.defer(),d=t.controller;return d?(r(t.template,t.templateUrl).then(function(r){var d=(t.scope||n).$new(),p=i.defer(),m=i.defer(),g={$scope:d,close:function(t,a){void 0!==a&&null!==a||(a=0),s(function(){p.resolve(t),e.leave(h).then(function(){m.resolve(t),d.$destroy(),g.close=null,l=null,p=null,w=null,g=null,h=null,d=null})},a)}};t.inputs&&angular.extend(g,t.inputs);var f=a(r),h=f(d);g.$element=h;var v=d[t.controllerAs],y=o(t.controller,g,!1,t.controllerAs);t.controllerAs&&v&&angular.extend(y,v),t.appendElement?u(t.appendElement,h):u(c,h);var w={controller:y,scope:d,element:h,close:p.promise,closed:m.promise};l.resolve(w)}).then(null,function(e){l.reject(e)}),l.promise):(l.reject("No controller has been specified."),l.promise)}}var c=angular.element(t[0].body);return new u}])}(),angular.module("MyApp").factory("UploadService",["$http",function(e){return{uploadUser:function(t,a){var o=new FormData;return o.append("type",t),o.append("files",a),e({method:"POST",url:"/api/v1/upload/user",data:o,transformRequest:angular.identity,headers:{"Content-Type":void 0}})},uploadProject:function(t,a,o){var r=new FormData;return r.append("type",t),r.append("files",a),r.append("project",JSON.stringify(o)),e({method:"POST",url:"/api/v1/upload/project",data:r,transformRequest:angular.identity,headers:{"Content-Type":void 0}})},uploadSubmission:function(t,a,o){var r=new FormData;return r.append("type",t),r.append("files",a),r.append("submission",JSON.stringify(o)),e({method:"POST",url:"/api/v1/upload/submission",data:r,transformRequest:angular.identity,headers:{"Content-Type":void 0}})},uploadProgram:function(t,a,o){var r=new FormData;return r.append("type",t),r.append("files",a),r.append("program",JSON.stringify(o)),e({method:"POST",url:"/api/v1/upload/program",data:r,transformRequest:angular.identity,headers:{"Content-Type":void 0}})}}}]),angular.module("MyApp").factory("UserService",["$http",function(e){return{getProfile:function(){return e.get("/api/v1/user/me")},updateProfile:function(t){return e.put("/api/v1/user/me",t)},getAllProfiles:function(){return e.get("/api/v1/user/all")},getIntern:function(t){return e.post("/api/v1/user/suggested",{data:t})},getUserProfile:function(t){return e.get("/api/v1/user/profile/"+t)},requestPasswordReset:function(t){return e.post("/api/v1/user/password-forgot",t)},resetPassword:function(t,a){return e.post("/api/v1/user/reset-password/"+t,a)}}}]),angular.module("MyApp").controller("InitCtrl",["$scope","$auth","$http","UserService","toastr","$location","localStorage","_","$rootScope","$document","$timeout","$window","$anchorScroll","deviceDetector",function(e,t,a,o,r,n,i,l,s,u,c,d,p,m){e.user={},e.user.email="",e.user.password="",e.name="",e.firstName="",e.lastName="",e.signupView=!1,e.deviceDetectorValue=m,e.isLoaded=function(){return!0},e.authenticatedArray=["/validate","/portfolio","/list","/reset-password/"],e.noFooterArray=["/signup","/login","/logout","/"],e.isAuthenticated=function(){return t.isAuthenticated()},e.isValid=function(){return e.isAuthenticated()&&"undefined"!=typeof e.user?e.user.isValid||!1:!1},e.isExtraSmall=function(){return $(window).width()<=768},e.isSmall=function(){return $(window).width()>768&&$(window).width()<=992},e.isMedium=function(){return $(window).width()>992&&$(window).width()<=1200},e.isLarge=function(){return $(window).width()>1200},e.signUp=function(){$("#signup").modal("hide"),e.user.isBusiness=!1,e.user.isValid=!1,e.user.displayName={},e.user.displayName.firstName=e.firstName,e.user.displayName.lastName=e.lastName,t.signup(e.user).then(function(a){t.setToken(a),e.user=a.data,i.setUser(e.user),n.path("/")})["catch"](function(e){r.error(e.data.message)})},e.toggleSignup=function(){e.signupView=!e.signupView},e.login=function(){$("#login").modal("hide"),t.login(e.user).then(function(){n.search().redirect?(n.path(n.search().redirect),n.search({redirect:null})):n.path("/portfolio")})["catch"](function(e){r.error(e.data.message)})},e.resetPassword=function(){$("#login").modal("toggle"),c(function(){n.path("/request-password-reset")},100)},e.switchSignUp=function(){$("#login").modal("toggle"),$("#signup").modal("toggle")},s.$on("$locationChangeSuccess",function(){if(d.ga){try{d.ga("set","userId",user.id),d.ga("set","email",user.email)}catch(e){}d.ga("send","pageview",{page:n.path()})}c(function(){p("top-nav")})}),s.$on("$locationChangeStart",function(t,a,s){var u=a.toLowerCase(),c=!1;if(e.now=(new Date).getTime(),e.now-e.startTime>432e5&&d.location.reload(),e.noFooter=!1,l.each(e.noFooterArray,function(t){u.indexOf(t)>=0&&(e.noFooter=!0)}),e.loginRequired=!1,l.each(e.authenticatedArray,function(t){u.indexOf(t)>=0&&(e.loginRequired=!0)}),u.indexOf("/validate")>=0&&(c=!0),u.indexOf("/logout")>=0&&(c=!0),e.isAuthenticated())o.getProfile().then(function(a){var o=a.data;e.user=o,i.setUser(o),e.isValid()||c||(r.success("Please Validate"),t.preventDefault(),n.path("/validate"))})["catch"](function(e){r.error(e.data.message)});else if(e.loginRequired){var p=n.path();t.preventDefault(),n.path("/login").search({redirect:p})}}),$.fn.extend({animateCss:function(e){var t="webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend";$(this).addClass("animated "+e).one(t,function(){$(this).removeClass("animated "+e)})}})}]),angular.module("MyApp").controller("ListCtrl",["$scope","$auth","$http","UserService","toastr","$state",function(e,t,a,o,r,n){e.userList=[],e.loading=!0,e.goToProfile=function(e){n.go("other-profile",{userId:e})},e.getAllUsers=function(){o.getAllProfiles().then(function(t){e.userList=t.data,e.loading=!1})["catch"](function(e){r.error(e.data.message,e.status)})},e.init=function(){e.getAllUsers()}()}]),angular.module("MyApp").controller("LogoutCtrl",["$scope","$location","$auth","toastr","$window","localStorage","$timeout",function(e,t,a,o,r,n,i){e.init=function(){o.success("Logged Out"),a.logout(),n.deleteData(),i(function(){n.deleteData(),t.path("/")},200)}()}]),angular.module("MyApp").controller("ModalController",["$scope","close","data","toastr","UploadService","ModalService","_","$anchorScroll","$timeout","$window",function(e,t,a,o,r,n,i,l,s,u){e.data=a,e.data||(e.data={}),e.imageLoading=!1,e.myImage=null,e.myImageFile=null,e.myCroppedImage=null,e.cropper=null,e.flipX=!1,e.flipY=!1,e.data.width&&e.data.height?(e.data.aspectRatio=e.data.width/e.data.height,e.data.imageOptions={width:e.data.width,height:e.data.height}):(e.data.aspectRatio=Number.NaN,e.data.imageOptions={}),e.options={aspectRatio:e.data.aspectRatio,responsive:!0,checkOrientation:!0,center:!0,checkCrossOrigin:!0,guides:!0,highlight:!1,autoCrop:!0,autoCropArea:1,toggleDragModeOnDblclick:!1,movable:!1,rotatable:!0,scalable:!0,zoomable:!1,zoomOnWheel:!1,cropBoxMovable:!0,cropBoxResizable:!0},e.scaleY=function(){e.flipY?e.cropper.scaleY(1):e.cropper.scaleY(-1),e.flipY=!e.flipY},e.scaleX=function(){e.flipX?e.cropper.scaleX(1):e.cropper.scaleX(-1),e.flipX=!e.flipX},e.handleFileSelect=function(t){if(e.imageLoading=!0,"undefined"!=typeof t&&t){var a=new FileReader;a.onload=function(t){e.$apply(function(e){e.myImage=t.target.result,s(function(){var t=document.getElementById("image");e.cropper&&e.cropper.replace(e.myImage,!1),e.cropper||(e.cropper=new Cropper(t,e.options)),e.imageLoading=!1,s(function(){$(window).trigger("resize"),window.dispatchEvent(new Event("resize")),e.cropper.reset()},200)},400)})},a.readAsDataURL(t)}else e.myCroppedImage=null,e.myImage=null,e.myImageFile=null,e.imageLoading=!1},e.getImage=function(){e.myCroppedImage=e.cropper.getCroppedCanvas(e.data.imageOptions).toDataURL(),e.close(e.myCroppedImage)},e.close=function(e){t(e,500)},e.init=function(){l("top-nav")}()}]),angular.module("MyApp").controller("PortfolioCtrl",["$scope","$state","$auth","toastr","UploadService","UserService","localStorage","_","$location","ModalService","$timeout","$window","$interval","$anchorScroll",function(e,t,a,o,r,n,i,l,s,u,c,d,p,m){function g(e){"use strict";var t,a;t=-1!==e.split(",")[0].indexOf("base64")?atob(e.split(",")[1]):decodeURI(e.split(",")[1]),a=e.split(",")[0].split(":")[1].split(";")[0];for(var o=[],r=0;r<t.length;r++)o[r]=t.charCodeAt(r);return new Blob([new Uint8Array(o)],{type:a})}e.data={},e.data.user={},e.data.user.displayName={firstName:"",middleName:"",lastName:""},e.data.user.picture="",e.data.user.bioSummary="",e.editMode=!1,e.loading=!0,e.imageLoading=!1,e.myImage=null,e.myCroppedImage=null,e.updateProfile=function(){n.updateProfile(e.user).then(function(t){e.user=t.data,i.setUser(e.user),e.removeImage(),o.success("Profile Updated")})["catch"](function(e){o.error(e.data.message,e.status)})},e.saveUser=function(){e.editMode&&(e.user.picture=angular.copy(e.data.user.picture||e.user.picture),e.user.email=angular.copy(e.data.user.email||e.user.email),e.user.bioSummary=angular.copy(e.data.user.bioSummary||e.user.bioSummary),e.updateProfile(),e.editMode=!1)},e.logout=function(){s.path("/logout")},e.startEdit=function(){$("#saveUser").animateCss("slideInDown"),e.editMode=!0},e.cancelEdit=function(){$("#saveUser").animateCss("slideOutUp"),e.data.user=angular.copy(e.user),e.removeImage(),e.editMode=!1},e.checkData=function(e,t){return""==e?"Please enter your "+t+".":"first name"==t&&e.length<3?"Please enter your full first name.":void 0},e.editProfilePicture=function(){u.showModal({templateUrl:"../partials/uploadImageModal.html",controller:"ModalController",inputs:{data:{type:"uploadImageModal",height:500,width:500}}}).then(function(t){t.element.modal(),t.close.then(function(t){"Cancel"==t||e.uploadUserPicture(t)})})},e.uploadUserPicture=function(t){e.imageLoading=!0;var a=g(t);"object"==typeof a?r.uploadUser("image",a).then(function(t){e.user.picture=t.data.data,e.data.user.picture=angular.copy(e.user.picture),e.updateProfile(),e.removeImage()})["catch"](function(t){o.error("There was an error. Review your S3 settings."),e.removeImage()}):(o.error("Please choose an image"),e.removeImage())},e.removeImage=function(){e.myImage=null,e.myCroppedImage=null,e.imageLoading=!1},e.init=function(){m("top-nav"),e.user=JSON.parse(i.getUser()),e.user||s.path("/"),e.data.user=angular.copy(e.user),c(function(){e.loading=!1},300)}()}]),angular.module("MyApp").controller("RequestPasswordResetCtrl",["$scope","UserService","toastr",function(e,t,a){e.data={email:""},e.done=!1,e.submit=function(){t.requestPasswordReset(e.data).then(function(t){a.success("Submit Successful"),e.done=!0})["catch"](function(e){console.log(e),a.error(e.data.message)})}}]),angular.module("MyApp").controller("ResetPasswordCtrl",["$scope","UserService","toastr","$stateParams","$location",function(e,t,a,o,r){e.data={password:""},e.submit=function(){t.resetPassword(o.token,e.data).then(function(e){a.success("Update Password Successful"),r.url("/candidate/signup")})["catch"](function(e){a.error(e.data.message)})}}]),angular.module("MyApp").controller("StaticCtrl",["$scope","$auth","$http","$timeout","$anchorScroll",function(e,t,a,o,r){e.loading=!0,o(function(){e.loading=!1},200),e.init=function(){r("top-nav")}()}]),angular.module("MyApp").controller("UserPortfolioCtrl",["$scope","$state","$auth","toastr","$stateParams","$http","UserService","localStorage","ModalService","$location","_","$anchorScroll",function(e,t,a,o,r,n,i,l,s,u,c,d){e.userId=r.userId,e.data={},e.data.user={},e.data.user.picture="",e.data.user.displayName={firstName:"",middleName:"",lastName:""},e.data.user.bioSummary="",e.loading=!0,e.init=function(){d("top-nav"),i.getUserProfile(e.userId).then(function(t){e.data.user=t.data,e.loading=!1})["catch"](function(e){o.error(e.data.message,e.status)})}()}]),angular.module("MyApp").controller("ValidateCtrl",["$scope","toastr","$location","vcRecaptchaService","$http","$anchorScroll",function(e,t,a,o,r,n){e.response=null,e.widgetId=null,e.model={key:"6Lehgh4TAAAAAM3Z3zLT3p9Nw31EpO8SJVMBgWAB"},e.setResponse=function(t){e.response=t},e.setWidgetId=function(t){e.widgetId=t},e.cbExpiration=function(){o.reload(e.widgetId),e.response=null},e.submit=function(){r({method:"POST",url:"../api/v1/auth/validate",data:{value:e.response}}).then(function(o){"200"==o.status?(t.success("Validation Success"),a.path("/portfolio")):(t.error("Error in validating."),e.cbExpiration())})},e.init=function(){n("top-nav")}()}]);