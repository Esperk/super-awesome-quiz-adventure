var mongoose = require('mongoose'),
    Game = require('../models/game'),
    Question = require('../models/questions'),
    Category = require('../models/categories');

function getRandom(amount, max) {
    // get random numbers for categories
    array = [];
    while (array.length < amount) {
        var randomnumber = Math.ceil(Math.random() * max) - 1
        var found = false;
        for (var i = 0; i < array.length; i++) {
            if (array[i] == randomnumber) {
                found = true;
                break
            }
        }
        if (!found) array[array.length] = randomnumber;
    }
    return array;
}

function objectToArray(object) {
    var array = [];

    for (var k in object) {
        if (object.hasOwnProperty(k)) {
            array.push(object[k]);
        }
    }
    return array;
}

function saveGame(id, game) {
    Game.findOneAndUpdate({
        _id: id
    }, {
        'stats.question_count': game.stats.question_count,
        'stats.round': game.stats.round,
        'stats.asked': game.stats.asked,
        'stats.maxquestions': game.stats.maxquestions,
        'stats.maxrounds': game.stats.maxrounds,
        'stats.finished': (game.stats.maxrounds === game.stats.round),
        'started': game.started,
        'scoreboard': game.scoreboard,
        'quizmaster': game.quizmaster
    }, function(err, res) {
        if (err) {
            console.log('Error: ' + err.message);
        } else {
            console.log('succesfully saved ' + id);
            saveTeams(id, game.teams);
        }
    });
}

function saveTeams(id, teams) {
    console.log('saving teams!');
    for (var team in teams) {
        if (teams.hasOwnProperty(team)) {
            var newteam = {
                _id: team,
                name: teams[team].name,
                round_points: teams[team].roundpoints
            }
            console.log('the new team = ');
            console.log(newteam);
            Game.findOneAndUpdate({
                _id: id
            }, {
                $push: {
                    teams: newteam
                }
            }, function(err, res) {
                if (err) {
                    console.log('Error: ' + err.message);
                } else {
                    console.log("Team " + teams[team].name + " saved to " + id);
                }
            });
        }
    }
}

module.exports = function(io) {

    var games = {};

    io.sockets.on('connection', function(socket) {

        // create and join a room
        socket.on('create room', function(game) {
            socket.join(game);
            games[game] = {
                started: false,
                stats: {
                    question_count: 0,
                    round: 0,
                    question: null,
                    answer: null,
                    category: null,
                    asked: [],
                    maxrounds: 3,
                    maxquestions: 2
                },
                teams: {},
                scoreboard: null,
                quizmaster: socket.id
            };
            console.log("created a room/game. current games are:");
            console.log(games);
        });

        socket.on('scoreboard join', function(game) {
            console.log('scoreboard join ' + game);
            games[game].scoreboard = socket.id;
            io.to(games[game].scoreboard).emit('update teams', objectToArray(games[game].teams));
        });

        /* Add a team to the game
         * game: game name (id).
         * name: the name of the team.
         */
        socket.on('add team', function(game, name) {
            var nameavailable = true;
            for (var k in games[game].teams) {
                if (games[game].teams[k].name == name) {
                    nameavailable = false;   
                }
            }

            if(nameavailable) {
                var newteam = {
                    id: socket.id,
                    name: name,
                    selected: false,
                    currentanswer: "",
                    editing: false,
                    correctanswer: null,
                    roundpoints: 0,
                    rounds: {}
                };

                games[game].teams[socket.id] = newteam;

                // send the new team!
                io.to(game).emit('new team', newteam);
                console.log('team doesn\'t exists');
                io.to(socket.id).emit('team already exists', [false]);

                if (games[game].scoreboard) {
                    console.log('teams updated, send to scoreboard');
                    io.to(games[game].scoreboard).emit('update teams', objectToArray(games[game].teams));
                }
            } else {
                console.log('team does exist already..');
                io.to(socket.id).emit('team already exists', [true]);
            }
            // console.log("new team added heres the complete game object:");
            // console.log(games[game]);
        });

        /* select/unselect team
         * game: game name (id)
         * teamid: teamid
         * status: selected/unselected (true or false)
         */
        socket.on('select team', function(game, teamid, status) {

            games[game].teams[teamid].selected = status;

            console.log(games[game].teams[teamid]);
            console.log('update team ' + games[game].teams[teamid].name + ', selected = ' + status);
            console.log(games[game].teams[teamid]);
            // send the whole room object with updated team
            console.log('teams updated, sending now');

            // sending to everyone
            // console.log(objectToArray(games[game].teams));

            if (games[game].scoreboard) {
                console.log('team selected, send to scoreboard');
                io.to(games[game].scoreboard).emit('update teams', objectToArray(games[game].teams));
            }

            // send mesage to the team about the status
            io.to(teamid).emit('update teamstatus', status);
        });

        /* Start the game.
         * 
         */

        socket.on('start game', function(game) {
            games[game].started = true;
            console.log('get categories');
            // get the categories and send them to the gamemaster
            var categories = [];
            Category.find({}, function(err, res) {
                if (err) throw err;

                var random = getRandom(4, res.length);

                for (var i = 0; i < random.length; i++) {
                    categories.push(res[random[i]]);
                }
                console.log('categories are: ');
                console.log(categories);
                io.to(games[game].quizmaster).emit('get categories', categories);
            });


            // decline unselected teams
            for (var k in games[game].teams) {
                if (games[game].teams[k].selected === false) {
                    io.to(k).emit('is declined', true);
                    delete games[game].teams[k];
                    io.to(games[game].quizmaster).emit('update teams', objectToArray(games[game].teams));
                    io.to(games[game].quizmaster).emit('submit answer');
                }
            }
            io.to(games[game].scoreboard).emit('update teams', objectToArray(games[game].teams));
            io.to(games[game].scoreboard).emit('update stats', games[game].stats);

            // start game for scoreboard
            io.to(games[game].scoreboard).emit('start game');

        });


        // categorie chosen, send some questions!
        socket.on('choose category', function(game, category) {
            console.log("selected category: " + category);
            games[game].stats.round++;

            games[game].stats.category = category;

            var citeria = {
                category_id: games[game].stats.category,
                _id: {
                    $nin: games[game].stats.asked
                },
                question: {
                    "$ne": ""
                }
            }

            // count all the questions
            Question.count(citeria, function(err, c) {

                // find random questions..
                Question.find(citeria)
                    .limit(4)
                    .skip(Math.floor(Math.random() * c))
                    .exec(function(err, res) {
                        console.log("these questions are selected: ");
                        console.log(res);
                        // AND SEND THE QUESTIONS
                        io.to(games[game].quizmaster).emit('update stats', games[game].stats);
                        io.to(games[game].scoreboard).emit('update stats', games[game].stats);
                        io.to(games[game].quizmaster).emit('get questions', res);
                    });
            });
        });

        // question was chosen by quizmaster.
        // game: gameid
        // id:questionid
        socket.on('choose question', function(game, id) {
            games[game].stats.asked.push(id);
            Question.findOne({
                _id: id
            }, function(err, question) {
                games[game].stats.question_count++;
                games[game].stats.question = question.question;
                games[game].stats.answer = question.answer;

                for (var k in games[game].teams) {
                    // send the question string
                    io.to(k).emit('get question', question.question);
                }
                // update team stats
                io.to(games[game].scoreboard).emit('update stats', games[game].stats);
                io.to(games[game].quizmaster).emit('update stats', games[game].stats);
                io.to(games[game].quizmaster).emit('update teams', objectToArray(games[game].teams));

                io.to(games[game].scoreboard).emit('show question');

            });
        });

        // submit answer
        // game: gameid
        // team: teamid
        // answer: answer string
        socket.on('submit answer', function(game, answer) {
            games[game].teams[socket.id].currentanswer = answer;
            games[game].teams[socket.id].editing = false;

            console.log("game: " + game + "team: " + socket.id + "answer : " + answer);

            // send the whole teams object. in the team object are currentanswer
            io.to(games[game].quizmaster).emit('update teams', objectToArray(games[game].teams));

            // send updated teams with their question to the scoreboard
            io.to(games[game].scoreboard).emit('update teams', objectToArray(games[game].teams));
            console.log(games[game].teams);

        });

        // set editing to true, so the scoreboard knows a team is editing a answer.
        socket.on('change answer', function(game) {
            games[game].teams[socket.id].editing = true;
            console.log(games[game].teams);

            // send updated teams with their question to the scoreboard
            io.to(games[game].scoreboard).emit('update teams', objectToArray(games[game].teams));

            io.to(games[game].scoreboard).emit('update teams', objectToArray(games[game].teams));
            io.to(games[game].quizmaster).emit('change answer');
        });

        // close the current question.
        socket.on('close question', function(game) {
            //send the scoreboard the teams+answers info
            io.to(games[game].scoreboard).emit('show answers');

            // send the team a close question message
            for (var k in games[game].teams) {
                // send the question string
                io.to(k).emit('close question');
            }

            // send the quizmaster the team object with answers etc.
            io.to(games[game].quizmaster).emit('update teams', objectToArray(games[game].teams));
            io.to(games[game].quizmaster).emit('update stats', games[game].stats);
            io.to(games[game].quizmaster).emit('get answers');
        });

        socket.on('select answer', function(game, teamid, status) {
            // update our team object with the updated object from the quizmaster
            games[game].teams[teamid].correctanswer = status;
            io.to(teamid).emit('get correction', status);
            io.to(games[game].scoreboard).emit('update teams', objectToArray(games[game].teams));
        });


        socket.on('restart game', function(game) {
            games[game].started = false;
            games[game].stats.question_count = 0;
            games[game].stats.round = 0;
            games[game].stats.question = null;
            games[game].stats.answer = null;
            games[game].stats.category = 0;
            games[game].stats.asked = [];

            for (var k in games[game].teams) {
                // send the question string
                io.to(k).emit('restart game');
            }

            games[game].teams = {};
            
            io.to(games[game].quizmaster).emit('update teams', objectToArray(games[game].teams));
            io.to(games[game].quizmaster).emit('update stats', games[game].stats);
            io.to(games[game].scoreboard).emit('update teams', objectToArray(games[game].teams));
            io.to(games[game].scoreboard).emit('update stats', games[game].stats);

            io.to(games[game].scoreboard).emit('restart game');
            io.to(games[game].quizmaster).emit('restart game');
        });

        socket.on('submit answers', function(game) {
            console.log('submit answers, let the magic happen!');
            // empty answer values and shit
            for (var k in games[game].teams) {

                console.log("the current round = " + games[game].stats.round + "and the rounds from this team:");
                console.log(games[game].teams[k].rounds);
                if (!games[game].teams[k].rounds[games[game].stats.round]) {
                    var object = {
                        correctanswers: 0
                    }
                    games[game].teams[k].rounds[games[game].stats.round] = object;
                }

                if (games[game].teams[k].correctanswer) {
                    games[game].teams[k].rounds[games[game].stats.round].correctanswers++;
                }

                // reset values!
                games[game].teams[k].currentanswer = '';
                games[game].teams[k].editing = false;
                games[game].teams[k].correctanswer = null;

                console.log("the rounds object: ");
                console.log(games[game].teams[k].rounds);
            }


            // if end round
            console.log("current question: " + games[game].stats.question_count + " max questions: " + games[game].maxquestions);
            console.log("current round: " + games[game].stats.round + " max rounds: " + games[game].maxrounds);

            if (games[game].stats.question_count === games[game].stats.maxquestions) {
                console.log("round done!");
                games[game].stats.question_count = 0;
                // assign round points!
                sortable = [];
                for (var k in games[game].teams) {
                    sortable.push([k, games[game].teams[k].rounds[games[game].stats.round].correctanswers]);
                    sortable.sort(function(a, b) {
                        return a[1] - b[1]
                    });
                    sortable.reverse();
                }
                // sortable array:
                // [ [ '12345456', 38 ],
                //   [ '1234', 6 ],
                //   [ '1234554', 5 ],
                //   [ '123', 4 ],
                //   [ '12345', 2 ],
                //   [ '12345444', 1 ] ]

                // index 0 = the key (teamID)
                // index 1 = the good answers
                // console.log("the sortable array: ");
                // console.log(sortable);

                for (var i = 0; i < sortable.length; i++) {
                    console.log("the following team will get round points : " + sortable[i][0]);
                    console.log("here is the teams object (again): ");
                    console.log(games[game].teams);
                    var j = i;

                    switch (j) {
                        case 0: // NUMBER 1!! gets 4 points.
                            games[game].teams[sortable[i][0]].roundpoints += 4;
                            break;
                        case 1: // NUMBER 2!! gets 2 points.
                            games[game].teams[sortable[i][0]].roundpoints += 2;
                            break;
                        case 2: // NUMBER 3!! gets 1 point.
                            games[game].teams[sortable[i][0]].roundpoints += 1;
                            break;
                        default: // loser bonus = 0.1 points.
                            games[game].teams[sortable[i][0]].roundpoints += 0.1;
                    }
                }
                console.log("round points assigned, the scores are: ");

                console.log(games[game].teams);

                // is the game end???
                if (games[game].stats.round === games[game].stats.maxrounds) {
                    console.log("game is over! final score =");
                    console.log(games[game]);

                    io.to(games[game].quizmaster).emit('update teams', objectToArray(games[game].teams));
                    io.to(games[game].quizmaster).emit('update stats', games[game].stats);
                    io.to(games[game].scoreboard).emit('update teams', objectToArray(games[game].teams));
                    io.to(games[game].scoreboard).emit('update stats', games[game].stats);

                    io.to(games[game].quizmaster).emit('game over');
                    io.to(games[game].scoreboard).emit('start game');

                    for (var k in games[game].teams) {
                        // send game over to every team
                        io.to(k).emit('game over');
                    }
                    saveGame(game, games[game]);

                } else {
                    //get categories!
                    console.log("get new categories. game is not over yet!");
                    var categories = [];
                    Category.find({}, function(err, res) {
                        if (err) throw err;

                        var random = getRandom(4, res.length);

                        for (var i = 0; i < random.length; i++) {
                            categories.push(res[random[i]]);
                        }
                        io.to(games[game].quizmaster).emit('update teams', objectToArray(games[game].teams));
                        io.to(games[game].quizmaster).emit('update stats', games[game].stats);
                        io.to(games[game].scoreboard).emit('update teams', objectToArray(games[game].teams));
                        io.to(games[game].scoreboard).emit('update stats', games[game].stats);

                        io.to(games[game].scoreboard).emit('start game');
                        io.to(games[game].quizmaster).emit('get categories', categories);
                    });
                }

            } else {
                console.log("get new questions, round is not over yet!");
                var criteria = {
                    category_id: games[game].stats.category,
                    _id: {
                        $nin: games[game].stats.asked
                    },
                    question: {
                        "$ne": ""
                    }
                }

                // count all the questions
                Question.count(criteria, function(err, c) {

                    // find random questions..
                    Question.find(criteria)
                        .limit(4)
                        .skip(Math.floor(Math.random() * c))
                        .exec(function(err, res) {
                            // console.log(res);
                            // AND SEND THE QUESTIONS
                            io.to(games[game].quizmaster).emit('update teams', objectToArray(games[game].teams));
                            io.to(games[game].quizmaster).emit('update stats', games[game].stats);
                            io.to(games[game].scoreboard).emit('update teams', objectToArray(games[game].teams));
                            io.to(games[game].scoreboard).emit('update stats', games[game].stats);

                            io.to(games[game].scoreboard).emit('start game');
                            io.to(games[game].quizmaster).emit('get questions', res);
                        });
                });
            }
        });

    });
}
