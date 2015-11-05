var noticeService = angular.module("noticeService", []);

noticeService.factory("noticeService", function() {
    var noticeService = {};
    noticeService.error = function(errormessage, element) {
        $('body').append("<div class='error'>" + errormessage + "</div>");
        $(element).addClass('errorInput');
    }
    noticeService.error = function(errormessage) {
        console.log("errormessage " + errormessage);
        $('body').append("<div class='error'>" + errormessage + "</div>");
    }
    noticeService.succes = function(notice) {
        $('body').append("<div class='notice'>" + notice + "</div>");
    }
    return noticeService;
});
