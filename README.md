# The Quizz Master App
## Requirements:
### The game:
- Players are in teams.
- A team has a minimum of 3 players.
- A team does not have a maximum
- A game has 2 to six teams participating
- A game has multiple round.
- A round has 12 questions.
- A game has the choice between 3 categories.
- A game has a quiz master.
- The quiz master selects questions.
- The quiz master approves/disaproves answers.
- Every team has 1 device to submit answers.
- The quiz master uses a tablet to host the game.
- A beamer is used to display the current score and question.
- The questions require short answers.
- The questions are not multiple choice.
- The quiz master decides when the quiz night is over.
- The app selects the winner when the game is over.
- Questions can only be presented ONCE!

### The SPA's
#### 1. Smart phone: the teams app
- Display the current question
- Allow the the team to enter the answer.
- Show a display name.

#### 2. The quiz master app
- Start the quiz night.
- Allow the teams to applicate.
- approve or decline an application
- Start the game.
- Start a round by selecting a categorie.
- Can start another game at the end.
- Select the next question
- Start the selected question.
*Now the question will show up on the beamer, score board app.*
- Close the question
- Read the submitted questions.
- Select correct answers.

#### 3. The score board app
- the scoreboard has no interaction, it only shows the score and question real-time
- It shows the progress, how many questions/rounds left.
- The team names, with their scores, and correctly answered questions per round.
- The team with the most correct answers receive 4 round points.
- The second best team in a round receives 2 round points.
- The third best team in a round receives 1 round point.
- All other teams receive 0.1 round points.
- When a question is in progress, it shows the question, the category and which team has answered the question.
- When a question is closed it shows all teams answers.


### Technical requirements
- The app will use on node/express server.
- The app will use the WebSocket protocol.
- The app will be a web (browser) app.
- The server supports multiple games (for example a different pub) at a time.

### Small requirements
- Any question appears only once per quiz night.
- Team names must be unique (and not empty)
- If the question isn't closed, a team can change their answer.
- Empty answers will be ignored and not shown on the board.
- When the end of the nights round 

