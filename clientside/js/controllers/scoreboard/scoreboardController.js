quizApp.controller("scoreboardController", function($scope, $http, $routeParams, $location, socketProvider, noticeService, mainService) {

    $scope.teams = mainService.updatedTeams;
    $scope.stats = mainService.updatedStats;
    $scope.currentPub = mainService.currentPub;

    // switch to scoreboard screen
    socketProvider.startGameListener(function(data) {
        $location.path('/scoreboard/' + mainService.currentPub + '/score');
    });

    socketProvider.showQuestionListener(function(data) {
        $location.path('/scoreboard/' + mainService.currentPub + '/question');
    });

    socketProvider.showAnswersListener(function(data) {
        $location.path('/scoreboard/' + mainService.currentPub + '/answers');
    });

    socketProvider.gameOverListener(function(data){
        $location.path("scoreboard/" + mainService.currentPub + "/gameOver");
    });

    $scope.enterPub = function() {
        if ($scope.pub.pubname !== undefined) {
            mainService.currentPub = $scope.pub.pubname;
            $scope.currentPub = $scope.pub.pubname;
            $http.get(mainService.hostip + "/team/game/" + $scope.currentPub)
                .success(function(game) {
                    $location.path('/scoreboard/' + $scope.currentPub + '/setup/');
                    noticeService.succes("Welkom bij " + $scope.currentPub);
                    socketProvider.joinRoomScoreboard(mainService.currentPub);
                })
                .error(function(data, status) {
                    noticeService.error("Spel bestaat niet!");
                });
        } else {
            noticeService.error("Enter a valid pubname");
        }
    }

});
