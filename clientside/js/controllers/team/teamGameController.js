quizApp.controller("teamGameController", function($scope, $http, $location, $routeParams, $timeout, socketProvider, noticeService, mainService) {

    // switch screen to the question
    socketProvider.questionListenerForTeams(function(data) {
        $location.path('/team/' + mainService.currentPub + '/answerQuestion');
        mainService.currentQuestion.splice(0, 1);
        mainService.currentQuestion.push(data);
    });

    socketProvider.closeQuestionListener(function(data) {
        $location.path('/team/' + mainService.currentPub + '/waitForCorrection');
        mainService.currentQuestion.splice(0, 1);
    });

    socketProvider.answeredCorrectly(function(data) {
        console.log(data);
        $scope.answeredCorrectly = data;
    });

    socketProvider.gameOverListener(function(data){
        $location.path("team/" + mainService.currentPub + "/gameOver");
    });

    $scope.showForm = true;
    $scope.hasSent = false;

    $scope.answeredCorrectly;
    $scope.currentQuestion = mainService.currentQuestion[0];


    $scope.submitAnswer = function() {
        socketProvider.submitAnswer(mainService.currentPub, $scope.ans.answer);
        noticeService.succes("Your answer is sent!");

        $scope.hasSent = true;
    }
    $scope.editAnswer = function() {
        console.log("hasSent: " + $scope.hasSent);
        socketProvider.changeAnswer(mainService.currentPub);
        $scope.hasSent = false;
    }

});
