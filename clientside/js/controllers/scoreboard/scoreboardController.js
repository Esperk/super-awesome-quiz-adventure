quizApp.controller("scoreboardController", function($scope, $http, $routeParams, $location, socketService, noticeService, mainService) {

    $scope.teams = mainService.updatedTeams;
    $scope.stats = mainService.updatedStats;
    $scope.currentPub = mainService.currentPub;

    // switch to scoreboard screen
    socketService.startGameListener(function(data) {
        $location.path('/scoreboard/' + mainService.currentPub + '/score');
    });

    socketService.showQuestionListener(function(data) {
        $location.path('/scoreboard/' + mainService.currentPub + '/question');
    });

    socketService.showAnswersListener(function(data) {
        $location.path('/scoreboard/' + mainService.currentPub + '/answers');
    });


    socketService.restartGameListener(function(data){
        $location.path("/scoreboard/" + mainService.currentPub + "/setup");
    });

    $scope.enterPub = function() {
        if ($scope.pub.pubname !== undefined) {
            mainService.currentPub = $scope.pub.pubname;
            $scope.currentPub = $scope.pub.pubname;
            $http.get(mainService.hostip + "/team/game/" + $scope.currentPub)
                .success(function(game) {
                    $location.path('/scoreboard/' + $scope.currentPub + '/setup/');
                    noticeService.succes("Welkom bij " + $scope.currentPub);
                    socketService.joinRoomScoreboard(mainService.currentPub);
                })
                .error(function(data, status) {
                    noticeService.error("Spel bestaat niet!");
                });
        } else {
            noticeService.error("Enter a valid pubname");
        }
    }

});
