quizApp.controller("quizmasterSetupController", function($scope, $http, $location, $routeParams, $timeout, socketProvider, mainService, noticeService) {


    /*  =========================================================
                  SETUP OF THE GAME (BEFORE GAMEPLAY)
        =========================================================
    */
    $scope.teams = mainService.teams;
    $scope.categories = mainService.categories;
    $scope.questions = mainService.questions;
    $scope.submittedAnswers = mainService.submittedAnswers;

    $scope.cat = {};
    $scope.ques = {};


    // creat a game with your pub(name)
    $scope.startGame = function() {
    mainService.currentPub = $scope.pub.pubname;
    $scope.loading = true;

    $http.post(mainService.hostip + "/quizmaster/creategame/" + mainService.currentPub)
        .success(function(game) {
            noticeService.succes(game.result[1]);
            $scope.loading = false;
            socketProvider.startSocketServer(mainService.currentPub);
            $location.path("quizmaster/" + mainService.currentPub + "/setupGame");
        })
        .error(function(data, status) {
            noticeService.error(data.result);
            $scope.loading = false;
        });
    }

    // step 3
    $scope.sendTeamApproval = function(team) {
        socketProvider.selectTeam(mainService.currentPub, team.id, !team.selected);
    }

    // send an approval to the team
    $scope.approveAndStartGame = function() {
        $location.path("quizmaster/" + mainService.currentPub + "/chooseCategory");
        socketProvider.startGame(mainService.currentPub);
    }

});
