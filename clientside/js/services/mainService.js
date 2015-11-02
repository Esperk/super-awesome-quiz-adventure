var mainService = angular.module("mainService", []);

mainService.factory("mainService", function(socketProvider, $routeParams, $location) {

    var mainService = {};
    
    mainService.hostip = "http://localhost:1337";

    mainService.currentPub = "";
    mainService.currentCategory = "";
    mainService.currentQuestion = [];
    mainService.teamID;

    
    if (mainService.currentPub === "" && $routeParams.pubname !== undefined) {
        mainService.currentPub = $routeParams.pubname;
    }
    if (mainService.currentPub !== undefined && mainService.currentPub !== "") {
        socketProvider.startSocketServer(mainService.currentPub);
    }

    /* ==============================================================
       ==================== QUIZMASTER LISTENERS ====================
       ==============================================================
    */
    mainService.teams = [];
    socketProvider.teamListener(function(data) {
        mainService.teams.push(data);
    });

    mainService.questions = [];
    socketProvider.questionListener(function(data) {
        mainService.questions.splice(0, mainService.questions.length);
        mainService.questions.push(data);
    });

    mainService.categories = [];
    socketProvider.categoryListener(function(data) {
        mainService.categories.splice(0, mainService.categories.length);
        mainService.categories = data;
    });


    /* ==============================================================
       ======================= TEAM LISTENERS =======================
       ==============================================================
    */

    socketProvider.getTeamID(function(data){
       // console.log(data);
       mainService.teamID = data;
    });

    mainService.approved = [false];
    socketProvider.teamStatus(function(approved) {
        // console.log("approved? : " + approved);
        mainService.approved.splice(0, 1);
        mainService.approved.push(approved);
    });

    mainService.isDeclined = [false];
    socketProvider.teamIsDeclined(function(isDeclined) {
        // console.log("isDeclined : " + isDeclined);
        mainService.isDeclined.splice(0, 1);
        mainService.isDeclined.push(isDeclined);
    });
    
    socketProvider.isChangingAnswer(function(data) {
        // console.log(data);
        mainService.teams.splice(0, mainService.teams.length);
        for (var i = 0; i < data.length; i++) {
            mainService.teams.push(data[i]);
        };
    });

    socketProvider.restartGameListener(function(data){
        mainService.isDeclined.splice(0,1);
        mainService.approved.splice(0,1);
        mainService.teams.splice(0,1);
    });

    /* ==============================================================
       ======================= SCOREBOARD LISTENERS =======================
       ==============================================================
    */
    mainService.updatedTeams = [];
    socketProvider.updatedTeamsListener(function(data) {
        mainService.updatedTeams.splice(0, mainService.updatedTeams.length);
        for (var i = 0; i < data.length; i++) {
            mainService.updatedTeams.push(data[i]);
        };
        console.log("updatedTeams: ");
        console.log(mainService.updatedTeams);
    });

    mainService.updatedStats = [];
    socketProvider.updatedStatsListener(function(data) {
        console.log("update stats: ");
        console.log(data);
        mainService.updatedStats = data;
        console.log("updatedStats: ");
        console.log(mainService.updatedStats);
    });

    return mainService;
});
