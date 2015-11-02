quizApp.controller("teamGameController", function($scope, $http, $location, $routeParams, $timeout, socketService, noticeService, mainService) {

    // switch screen to the question
    socketService.questionListenerForTeams(function(data) {
        $location.path('/team/' + mainService.currentPub + '/answerQuestion');
        mainService.currentQuestion.splice(0, 1);
        mainService.currentQuestion.push(data);
    });

    socketService.closeQuestionListener(function(data) {
        $location.path('/team/' + mainService.currentPub + '/waitForCorrection');
        mainService.currentQuestion.splice(0, 1);
    });

    socketService.answeredCorrectly(function(data) {
        console.log(data);
        $scope.answeredCorrectly = data;
    });

    socketService.gameOverListener(function(data){
        $location.path("team/" + mainService.currentPub + "/gameOver");
    });

    socketService.restartGameListener(function(data){
        $location.path("team/game/" + mainService.currentPub);
    });

    $scope.showForm = true;
    $scope.hasSent = false;

    $scope.answeredCorrectly;
    $scope.currentQuestion = mainService.currentQuestion[0];


    $scope.submitAnswer = function() {
        socketService.submitAnswer(mainService.currentPub, $scope.ans.answer);
        noticeService.succes("Your answer is sent!");

        $scope.hasSent = true;
    }
    $scope.editAnswer = function() {
        console.log("hasSent: " + $scope.hasSent);
        socketService.changeAnswer(mainService.currentPub);
        $scope.hasSent = false;
    }

});
