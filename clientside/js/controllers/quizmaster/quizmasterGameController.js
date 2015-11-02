quizApp.controller("quizmasterGameController", function($scope, $http, $location, $routeParams, $timeout, socketService, mainService, noticeService) {
    

    socketService.categoryListener(function(data){
        $location.path("quizmaster/" + mainService.currentPub + "/chooseCategory");
    });

    socketService.questionListener(function(data){
        $location.path("quizmaster/" + mainService.currentPub + "/selectQuestion");
    });

    socketService.gameOverListener(function(data){
        $location.path("quizmaster/" + mainService.currentPub + "/gameOver");
    });

    socketService.restartGameListener(function(data){
        $location.path('/quizmaster/'+mainService.currentPub+'/setupGame/');
    });


    /*  =========================================================
                  SOME VARIABLES FOR THE VIEWS
        =========================================================
    */


    $scope.teams = mainService.updatedTeams;
    $scope.stats = mainService.updatedStats;

    $scope.categories = mainService.categories;
    $scope.questions = mainService.questions;

    $scope.cat = {};
    $scope.ques = {};


    /* =============================================================================
                           THE ACTUAL GAMEPLAY
       =============================================================================
    */

    // SETUP A NEW ROUND || START WITH CHOOSING A CATEGORY
    $scope.setCategory = function() {
        mainService.currentCategory = $scope.cat.selectedCategory;
        socketService.setCategory(mainService.currentPub, mainService.currentCategory);
    }
    // CHOOSE A QUESTION (WITH THE SELECTED CATEGORY)
    $scope.setQuestion = function() {
        socketService.setQuestion(mainService.currentPub, $scope.ques.currentQuestion);
        $location.path("quizmaster/" + mainService.currentPub + "/waitForAnswers");
    }
    // CLOSE THE QUESTION, GO TO CORRECTIONSCREEN
    $scope.closeQuestion = function() {
        socketService.closeQuestion(mainService.currentPub);
        $location.path("quizmaster/" + mainService.currentPub + "/selectCorrectAnswer");
    }

    // SEND THE CORRECTION THE THE TEAM
    $scope.sendCorrection = function(team) {
        socketService.sendCorrection(mainService.currentPub, team.id, !team.status)
    }
    // SEND FINALT ANSWERS
    $scope.submitAnswers = function(){
        socketService.submitFinalCorrection(mainService.currentPub);
    }

    $scope.resetAndStartGame = function(){
        socketService.restartGame(mainService.currentPub);
    }
});
