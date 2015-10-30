quizApp.controller("quizmasterGameController", function($scope, $http, $location, $routeParams, $timeout, socketProvider, mainService, noticeService) {
    

    socketProvider.categoryListener(function(data){
        $location.path("quizmaster/" + mainService.currentPub + "/chooseCategory");
    });

    socketProvider.questionListener(function(data){
        $location.path("quizmaster/" + mainService.currentPub + "/selectQuestion");
    });

    socketProvider.gameOverListener(function(data){
        $location.path("quizmaster/" + mainService.currentPub + "/gameOver");
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
        socketProvider.setCategory(mainService.currentPub, mainService.currentCategory);
    }
    // CHOOSE A QUESTION (WITH THE SELECTED CATEGORY)
    $scope.setQuestion = function() {
        socketProvider.setQuestion(mainService.currentPub, $scope.ques.currentQuestion);
        $location.path("quizmaster/" + mainService.currentPub + "/waitForAnswers");
    }
    // CLOSE THE QUESTION, GO TO CORRECTIONSCREEN
    $scope.closeQuestion = function() {
        socketProvider.closeQuestion(mainService.currentPub);
        $location.path("quizmaster/" + mainService.currentPub + "/selectCorrectAnswer");
    }

    // SEND THE CORRECTION THE THE TEAM
    $scope.sendCorrection = function(team) {
        socketProvider.sendCorrection(mainService.currentPub, team.id, !team.status)
    }
    // SEND FINALT ANSWERS
    $scope.submitAnswers = function(){
        socketProvider.submitFinalCorrection(mainService.currentPub);
    }

    $scope.resetAndStartGame = function(){
        $location.path('/quizmaster/'+mainService.currentPub+'/setupGame/');
    }
});
