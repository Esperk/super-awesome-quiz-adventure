quizApp.controller("teamSetupController", function($scope, $http, $location, $routeParams, $timeout, socketService, noticeService, mainService) {

    $scope.showForm = true;

    $scope.approved = mainService.approved;
    $scope.isDeclined = mainService.isDeclined;

    // step 1
    $scope.enterPub = function() {
        if ($scope.pub.pubname !== undefined) {
            mainService.currentPub = $scope.pub.pubname;
            $http.get(mainService.hostip + "/team/game/" + mainService.currentPub)
                .success(function(game) {
                    $location.path('/team/game/' + mainService.currentPub);
                    noticeService.succes("Welkom bij " + mainService.currentPub);
                })
                .error(function(data, status) {
                    noticeService.error("bestaat niet!");
                });
        } else {
            console.log("error");
            noticeService.error("Enter a valid pubname");
        }
    }

    // step 2
    $scope.teamSignUp = function() {
        socketService.addTeam(mainService.currentPub, $scope.team.teamName);
        // uniqueness teamname
        socketService.teamAlreadyExistsListener(function(data) {
            console.log(data);
            if(data[0] === false){
                $scope.showForm = false;
                noticeService.succes("Welkom, " + $scope.team.teamName);
            }
            else{
                noticeService.error("Teamnaam bestaat al!");
            }
        });
    }


    
    // switch screen to the question
    socketService.questionListenerForTeams(function(data) {
        $location.path('/team/' + mainService.currentPub + '/answerQuestion');
        mainService.currentQuestion.splice(0, 1);
        mainService.currentQuestion.push(data);
    });
});
