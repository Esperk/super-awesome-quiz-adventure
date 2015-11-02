var socketService = angular.module("socketService", []);

socketService.factory("socketService", function($rootScope) {
    var socket = io.connect();

    var socketService = {};
    // open a gameroom
    socketService.startSocketServer = function(pubname) {
        socket.emit('create room', pubname);
        console.log("new room created for " + pubname);
    }
    // join pub with the scoreboard
    socketService.joinRoomScoreboard = function(pubname) {
        socket.emit('scoreboard join', pubname);
        console.log("ROOM JOINED AS SCOREBOARD " + pubname);
    }
    // asign to a pub with a team
    socketService.addTeam = function(game, teamname, callback) {
        socket.emit('add team', game, teamname);
        console.log("TEAM ADDED! " + teamname);
    }

    // get the updated array with new teams
    socketService.teamListener = function(callback) {
        socket.on('new team', function() {
            var args = arguments;
            $rootScope.$apply(function() {
                callback.apply(socket, args);
            });
        });
    }
    socketService.getTeamID = function(callback){
        socket.on('added team', function(){
            var args = arguments;
            $rootScope.$apply(function () {
                callback.apply(socket, args);
            });
        }); 
    }
    // get the updated array with new teams
    socketService.updatedTeamsListener = function(callback) {
        socket.on('update teams', function() {
            console.log('updated teams');
            var args = arguments;
            $rootScope.$apply(function() {
                callback.apply(socket, args);
            });
        });
    }
    // get the array with the updated stats (if teams is approved) 
    socketService.updatedStatsListener = function(callback) {
        socket.on('update stats', function() {
            var args = arguments;
            $rootScope.$apply(function() {
                callback.apply(socket, args);
            });
        });
    }
    // accept a team to a game
    socketService.selectTeam = function(game, teamid, status) {
        socket.emit('select team', game, teamid, status);
    }
    // get the updated stat for teams
    socketService.teamStatus = function(callback) {
        socket.on('update teamstatus', function() {
            var args = arguments;
            $rootScope.$apply(function() {
                callback.apply(socket, args);
            });
        });
    }
    // if the game has started and the team is not approved
    socketService.teamIsDeclined = function(callback) {
        socket.on('is declined', function() {
            var args = arguments;
            console.log("got data");
            console.log(args);
            $rootScope.$apply(function() {
                callback.apply(socket, args);
            });
        });
    }

    // call startgame, then 
    socketService.startGame = function(game) {
        socket.emit('start game', game);
        console.log("GAME STARTED! " + game);
    }

    // teams will be received
    socketService.categoryListener = function(callback) {
        socket.on('get categories', function() {
            var args = arguments;
            $rootScope.$apply(function() {
                callback.apply(socket, args);
            });
        });
    }


    socketService.scoreboardTeamListener = function(callback) {
        socket.on('update teams', function() {
            var args = arguments;
            $rootScope.$apply(function() {
                callback.apply(socket, args);
            });
        });
    }

    // call setCategory, then 
    socketService.setCategory = function(game, category_id) {
        socket.emit('choose category', game, category_id);
        console.log("Category chosen! ID: " + category_id);
    }
        // receive the sent questions
    socketService.questionListener = function(callback) {
            socket.on('get questions', function() {
                var args = arguments;
                $rootScope.$apply(function() {
                    callback.apply(socket, args);
                });
            });
        }
        // submit the chosen question
    socketService.setQuestion = function(game, id) {
        socket.emit('choose question', game, id);
    }

    socketService.closeQuestion = function(game) {
        console.log("close question");
        socket.emit('close question', game);
    }

    socketService.startGameListener = function(callback) {
        socket.on('start game', function() {
            var args = arguments;
            $rootScope.$apply(function() {
                callback.apply(socket, args);
            });
        });
    }
    socketService.showQuestionListener = function(callback) {
        socket.on('show question', function() {
            var args = arguments;
            $rootScope.$apply(function() {
                callback.apply(socket, args);
            });
        });
    }

    socketService.showAnswersListener = function(callback) {
        socket.on('show answers', function() {
            var args = arguments;
            $rootScope.$apply(function() {
                callback.apply(socket, args);
            });
        });
    }


    socketService.questionListenerForTeams = function(callback) {
        socket.on('get question', function() {
            var args = arguments;
            $rootScope.$apply(function() {
                callback.apply(socket, args);
            });
        });
    }

    socketService.closeQuestionListener = function(callback) {
        socket.on('close question', function() {
            console.log("question closed");
            var args = arguments;
            $rootScope.$apply(function() {
                callback.apply(socket, args);
            });
        });
    }


    socketService.answerListener = function(callback) {
        socket.on('submit answer', function() {
            var args = arguments;
            console.log("got data");
            console.log(args);
            $rootScope.$apply(function() {
                callback.apply(socket, args);
            });
        });
    }

    socketService.submitAnswer = function(game, answer) {
        socket.emit('submit answer', game, answer);
    }

    socketService.changeAnswer = function(game) {
        socket.emit('change answer', game);
    }

    socketService.isChangingAnswer = function(callback) {
        socket.on('change answer', function() {
            var args = arguments;
            console.log("got data");
            console.log(args);
            $rootScope.$apply(function() {
                callback.apply(socket, args);
            });
        });
    }

    socketService.getAnswerListener = function(callback) {
        socket.on('get answers', function() {
            var args = arguments;
            $rootScope.$apply(function() {
                callback.apply(socket, args);
            });
        });
    }

    socketService.sendCorrection = function(game, teamid, status) {
        console.log(game, teamid,status);
        socket.emit('select answer', game, teamid, status);
    }

    socketService.submitFinalCorrection = function(game) {
        socket.emit('submit answers', game);
    }

    socketService.answeredCorrectly = function(callback) {
        console.log("trigger");
        socket.on('get correction', function() {
            console.log("triggered");
            var args = arguments;
            $rootScope.$apply(function() {
                callback.apply(socket, args);
            });
        });
    }

    // GAME OVER 
    socketService.gameOverListener = function(callback) {
        socket.on('game over', function() {
            var args = arguments;
            $rootScope.$apply(function() {
                callback.apply(socket, args);
            });
        });
    }

    socketService.restartGame = function(game){
        socket.emit('restart game', game);        
    }

    socketService.restartGameListener = function(callback){
        socket.on('restart game', function() {
            var args = arguments;
            $rootScope.$apply(function() {
                callback.apply(socket, args);
            });
        });
    }

    return socketService;
});
