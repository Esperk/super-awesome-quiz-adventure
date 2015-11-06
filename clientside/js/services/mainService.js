var mainService = angular.module("mainService", []);

mainService.factory("mainService", function(socketService, $routeParams, $location) {

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
        socketService.startSocketServer(mainService.currentPub);
    }

    /* ==============================================================
       ==================== QUIZMASTER LISTENERS ====================
       ==============================================================
    */
    mainService.teams = [];
    socketService.teamListener(function(data) {
        mainService.teams.push(data);
    });

    mainService.questions = [];
    socketService.questionListener(function(data) {
        mainService.questions.splice(0, mainService.questions.length);
        mainService.questions.push(data);
    });

    mainService.categories = [];
    socketService.categoryListener(function(data) {
        mainService.categories.splice(0, mainService.categories.length);
        mainService.categories = data;
    });


    /* ==============================================================
       ======================= TEAM LISTENERS =======================
       ==============================================================
    */

    socketService.getTeamID(function(data){
       // console.log(data);
       mainService.teamID = data;
    });

    mainService.approved = [false];
    socketService.teamStatus(function(approved) {
        // console.log("approved? : " + approved);
        mainService.approved.splice(0, 1);
        mainService.approved.push(approved);
    });

    mainService.isDeclined = [false];
    socketService.teamIsDeclined(function(isDeclined) {
        // console.log("isDeclined : " + isDeclined);
        mainService.isDeclined.splice(0, 1);
        mainService.isDeclined.push(isDeclined);
    });
    
    socketService.isChangingAnswer(function(data) {
        // console.log(data);
        mainService.teams.splice(0, mainService.teams.length);
        for (var i = 0; i < data.length; i++) {
            mainService.teams.push(data[i]);
        };
    });

    socketService.restartGameListener(function(data){
        mainService.isDeclined.splice(0,mainService.isDeclined.length);
        mainService.approved.splice(0,mainService.approved.length);
        mainService.teams.splice(0,mainService.teams.length);
    });

    /* ==============================================================
       ======================= SCOREBOARD LISTENERS =======================
       ==============================================================
    */
    mainService.updatedTeams = [];
    socketService.updatedTeamsListener(function(data) {
        mainService.updatedTeams.splice(0, mainService.updatedTeams.length);
        for (var i = 0; i < data.length; i++) {
            mainService.updatedTeams.push(data[i]);
        };
        console.log("updatedTeams: ");
        console.log(mainService.updatedTeams);
    });

    mainService.updatedStats = [];
    socketService.updatedStatsListener(function(data) {
        console.log("update stats: ");
        console.log(data);
        mainService.updatedStats = data;
        console.log("updatedStats: ");
        console.log(mainService.updatedStats);
    });

    return mainService;
});
