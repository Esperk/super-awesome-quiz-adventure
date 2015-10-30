var socketProvider = angular.module("socketProvider", []);

socketProvider.factory("socketProvider", function($rootScope) {
    var socket = io.connect();

    var socketProvider = {};
    // open a gameroom
    socketProvider.startSocketServer = function(pubname) {
        socket.emit('create room', pubname);
        console.log("new room created for " + pubname);
    }
    // join pub with the scoreboard
    socketProvider.joinRoomScoreboard = function(pubname) {
        socket.emit('scoreboard join', pubname);
        console.log("ROOM JOINED AS SCOREBOARD " + pubname);
    }
    // asign to a pub with a team
    socketProvider.addTeam = function(game, teamname, callback) {
        socket.emit('add team', game, teamname);
        console.log("TEAM ADDED! " + teamname);
    }

    // get the updated array with new teams
    socketProvider.teamListener = function(callback) {
        socket.on('new team', function() {
            var args = arguments;
            $rootScope.$apply(function() {
                callback.apply(socket, args);
            });
        });
    }
    socketProvider.getTeamID = function(callback){
        socket.on('added team', function(){
            var args = arguments;
            $rootScope.$apply(function () {
                callback.apply(socket, args);
            });
        }); 
    }
    // get the updated array with new teams
    socketProvider.updatedTeamsListener = function(callback) {
        socket.on('update teams', function() {
            console.log('updated teams');
            var args = arguments;
            $rootScope.$apply(function() {
                callback.apply(socket, args);
            });
        });
    }
    // get the array with the updated stats (if teams is approved) 
    socketProvider.updatedStatsListener = function(callback) {
        socket.on('update stats', function() {
            var args = arguments;
            $rootScope.$apply(function() {
                callback.apply(socket, args);
            });
        });
    }
    // accept a team to a game
    socketProvider.selectTeam = function(game, teamid, status) {
        socket.emit('select team', game, teamid, status);
    }
    // get the updated stat for teams
    socketProvider.teamStatus = function(callback) {
        socket.on('update teamstatus', function() {
            var args = arguments;
            $rootScope.$apply(function() {
                callback.apply(socket, args);
            });
        });
    }
    // if the game has started and the team is not approved
    socketProvider.teamIsDeclined = function(callback) {
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
    socketProvider.startGame = function(game) {
        socket.emit('start game', game);
        console.log("GAME STARTED! " + game);
    }

    // teams will be received
    socketProvider.categoryListener = function(callback) {
        socket.on('get categories', function() {
            var args = arguments;
            $rootScope.$apply(function() {
                callback.apply(socket, args);
            });
        });
    }


    socketProvider.scoreboardTeamListener = function(callback) {
        socket.on('update teams', function() {
            var args = arguments;
            $rootScope.$apply(function() {
                callback.apply(socket, args);
            });
        });
    }

    // call setCategory, then 
    socketProvider.setCategory = function(game, category_id) {
        socket.emit('choose category', game, category_id);
        console.log("Category chosen! ID: " + category_id);
    }
        // receive the sent questions
    socketProvider.questionListener = function(callback) {
            socket.on('get questions', function() {
                var args = arguments;
                $rootScope.$apply(function() {
                    callback.apply(socket, args);
                });
            });
        }
        // submit the chosen question
    socketProvider.setQuestion = function(game, id) {
        socket.emit('choose question', game, id);
    }

    socketProvider.closeQuestion = function(game) {
        console.log("close question");
        socket.emit('close question', game);
    }

    socketProvider.startGameListener = function(callback) {
        socket.on('start game', function() {
            var args = arguments;
            $rootScope.$apply(function() {
                callback.apply(socket, args);
            });
        });
    }
    socketProvider.showQuestionListener = function(callback) {
        socket.on('show question', function() {
            var args = arguments;
            $rootScope.$apply(function() {
                callback.apply(socket, args);
            });
        });
    }

    socketProvider.showAnswersListener = function(callback) {
        socket.on('show answers', function() {
            var args = arguments;
            $rootScope.$apply(function() {
                callback.apply(socket, args);
            });
        });
    }


    socketProvider.questionListenerForTeams = function(callback) {
        socket.on('get question', function() {
            var args = arguments;
            $rootScope.$apply(function() {
                callback.apply(socket, args);
            });
        });
    }

    socketProvider.closeQuestionListener = function(callback) {
        socket.on('close question', function() {
            console.log("question closed");
            var args = arguments;
            $rootScope.$apply(function() {
                callback.apply(socket, args);
            });
        });
    }


    socketProvider.answerListener = function(callback) {
        socket.on('submit answer', function() {
            var args = arguments;
            console.log("got data");
            console.log(args);
            $rootScope.$apply(function() {
                callback.apply(socket, args);
            });
        });
    }

    socketProvider.submitAnswer = function(game, answer) {
        socket.emit('submit answer', game, answer);
    }

    socketProvider.changeAnswer = function(game) {
        socket.emit('change answer', game);
    }

    socketProvider.isChangingAnswer = function(callback) {
        socket.on('change answer', function() {
            var args = arguments;
            console.log("got data");
            console.log(args);
            $rootScope.$apply(function() {
                callback.apply(socket, args);
            });
        });
    }

    socketProvider.getAnswerListener = function(callback) {
        socket.on('get answers', function() {
            var args = arguments;
            $rootScope.$apply(function() {
                callback.apply(socket, args);
            });
        });
    }

    socketProvider.sendCorrection = function(game, teamid, status) {
        console.log(game, teamid,status);
        socket.emit('select answer', game, teamid, status);
    }

    socketProvider.submitFinalCorrection = function(game) {
        socket.emit('submit answers', game);
    }

    socketProvider.answeredCorrectly = function(callback) {
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
    socketProvider.gameOverListener = function(callback) {
        socket.on('game over', function() {
            var args = arguments;
            $rootScope.$apply(function() {
                callback.apply(socket, args);
            });
        });
    }

    return socketProvider;
});
