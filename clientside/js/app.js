var quizApp = angular.module("quizApp", ["ngRoute", 'ngAnimate', 'socketService', 'noticeService', 'mainService']);

quizApp.config(['$routeProvider',
    function($routeProvider, $locationProvider) {
        $routeProvider.

        /*
          ================================================
                        ROUTES TO MAIN MENU
          ================================================
        */

        when('/', {
            templateUrl: '/partials/main.html'
        }).

        /*
          ================================================
                        ROUTES FOR QUIZMASTER
          ================================================
        */

        // select your pub 
        when('/quizmaster/login', {
                templateUrl: '/partials/quizmaster/login_screen.html',
                controller: 'quizmasterSetupController'
            }).
            // choose teams 
        when('/quizmaster/:pubname/setupGame/', {
                templateUrl: '/partials/quizmaster/start_game_night_screen.html',
                controller: 'quizmasterSetupController'
            }).
            // select category for the round
        when('/quizmaster/:pubname/chooseCategory', {
                templateUrl: '/partials/quizmaster/choose_category_screen.html',
                controller: 'quizmasterGameController'
            }).
            // select current question
        when('/quizmaster/:pubname/selectQuestion', {
                templateUrl: '/partials/quizmaster/select_question_screen.html',
                controller: 'quizmasterGameController'
            }).
            // wait for answers
        when('/quizmaster/:pubname/waitForAnswers', {
                templateUrl: '/partials/quizmaster/wait_for_aswers_screen.html',
                controller: 'quizmasterGameController'
            }).
            // select the correct answer
        when('/quizmaster/:pubname/selectCorrectAnswer', {
                templateUrl: '/partials/quizmaster/select_correct_answer_screen.html',
                controller: 'quizmasterGameController'
            }).
            // wait for results
        when('/quizmaster/:pubname/showResultsCurrentQuestion', {
                templateUrl: '/partials/quizmaster/result_current_question_screen.html',
                controller: 'quizmasterGameController'
            }).
            // final round
        when('/quizmaster/:pubname/gameOver', {
            templateUrl: '/partials/quizmaster/game_over_screen.html',
            controller: 'quizmasterGameController'
        }).


        /*
          ================================================
                        ROUTES FOR TEAMS
          ================================================
        */

        when('/team/login', {
                templateUrl: '/partials/team/login_screen.html',
                controller: 'teamSetupController'
            }).
            // sign up for a pub
        when('/team/game/:pubname', {
            templateUrl: '/partials/team/participate_screen.html',
            controller: 'teamSetupController'
        }).
        when('/team/:pubname/waitForQuestion', {
            templateUrl: '/partials/team/waitForQuestion.html',
            controller: 'teamGameController'
        }).
        when('/team/:pubname/answerQuestion', {
            templateUrl: '/partials/team/answer_form.html',
            controller: 'teamGameController'
        }).
        when('/team/:pubname/waitForCorrection', {
            templateUrl: '/partials/team/wait_for_correction_screen.html',
            controller: 'teamGameController'
        }).
        when('/team/:pubname/gameOver', {
            templateUrl: '/partials/team/game_over_screen.html',
            controller: 'teamGameController'
        }).


        /*
          ================================================
                        ROUTES FOR SCOREBOARD
          ================================================
        */

        // sign up for a pub
        when('/scoreboard/login', {
            templateUrl: '/partials/scoreboard/login_screen.html',
            controller: 'scoreboardController'
        }).
        when('/scoreboard/:pubname/setup', {
            templateUrl: '/partials/scoreboard/setup_screen.html',
            controller: 'scoreboardController'
        }).
        when('/scoreboard/:pubname/score', {
            templateUrl: '/partials/scoreboard/scoreboard_screen.html',
            controller: 'scoreboardController'
        }).
        when('/scoreboard/:pubname/question', {
            templateUrl: '/partials/scoreboard/question_screen.html',
            controller: 'scoreboardController'
        }).
        when('/scoreboard/:pubname/answers', {
            templateUrl: '/partials/scoreboard/answers_screen.html',
            controller: 'scoreboardController'
        }).

        /*
          ================================================
                        ROUTE TO UNSPECIFIED PATH
          ================================================
        */

        otherwise({
            redirectTo: '/'
        });

    }
]);
