# SprintSolve Trivia Game

[![Deploy to GitHub Pages](https://github.com/APorkolab/SprintSolve/actions/workflows/deploy.yml/badge.svg)](https://github.com/APorkolab/SprintSolve/actions/workflows/deploy.yml)

A dynamic, web-based trivia game that challenges your knowledge and reflexes. Navigate your character through a series of obstacles representing answers to trivia questions fetched live from the Open Trivia Database.

**[► Play the live game here!](https://aporkolab.github.io/SprintSolve/)**

---

## Features

SprintSolve has been developed from a simple script into a professional web application with a robust feature set:

### Gameplay
- **Dynamic Questions:** Questions are fetched live from the [Open Trivia Database API](https://opentdb.com/), providing a virtually endless supply of trivia.
- **Category Selection:** Players can choose from a list of categories before starting a game.
- **Dynamic Difficulty:** The game speed increases with every correct answer, making the game more challenging as you progress.
- **Power-ups:**
  - **Shield:** Protects the player from one incorrect answer.
  - **Slow-mo:** Temporarily halves the game speed.
- **Reward-Based Spawning:** Power-ups have a chance to appear as a reward for answering a question correctly.
- **Moving Obstacles:** Some question sets move vertically, adding an extra layer of difficulty.

### Visual & Audio
- **Animated Character:** The player character is an animated GIF.
- **Particle Effects:** A "robbanás" (explosion) effect occurs on game over, providing satisfying visual feedback.
- **Sound Effects & Music:** The game includes background music and sound effects for jumping, scoring, and game over.

### Technical
- **Modern Toolchain:** Uses [Vite](https://vitejs.dev/) for a fast development server and optimized production builds.
- **Unit Testing:** Built with a testing foundation using [Jest](https://jestjs.io/).
- **Automated Deployment:** A GitHub Actions workflow automatically builds and deploys the game to GitHub Pages on every push to the `main` branch.
- **Modular Architecture:** The codebase is organized into clean, maintainable ES modules.

## Gameplay Logic

1.  **Start:** The game begins with a start screen. Clicking "Start Game" takes you to the category selection.
2.  **Category Selection:** A list of trivia categories is fetched from the OpenTDB API. Select a category to begin the game.
3.  **Answering Questions:**
    - A question appears at the top of the screen.
    - Four obstacles, each representing an answer, will move from right to left.
    - Navigate the character to collide with the obstacle corresponding to the correct answer.
4.  **Scoring & Difficulty:**
    - A correct answer increases your score and the game speed. There is also a chance for a power-up to spawn.
    - An incorrect answer ends the game, unless you have a shield.
5.  **Power-ups:**
    - **Shield (Blue):** If you collect a shield, you can survive one incorrect answer. The shield is consumed in the process.
    - **Slow-mo (Clock):** Temporarily reduces the game speed by 50% for 5 seconds.
6.  **Game Over:** The game ends when you hit an incorrect obstacle without a shield. Your character explodes, and a "Game Over" screen appears with your final score. You can then choose to play again.

## Tech Stack
- **Frontend:** HTML5, CSS3, JavaScript (ES Modules)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Testing:** [Jest](https://jestjs.io/)
- **API:** [Open Trivia Database](https://opentdb.com/)
- **Deployment:** [GitHub Actions](https://github.com/features/actions) & [GitHub Pages](https://pages.github.com/)

## Project Structure
-   `index.html`: The main HTML entry point for the game.
-   `public/`: Contains static assets.
-   `src/`: Contains all JavaScript source code, broken down into modules (e.g., `main.js`, `character.js`, `ui.js`).
-   `__tests__/`: Contains all Jest unit tests.
-   `.github/workflows/`: Contains the GitHub Actions workflow for automated deployment.
-   `vite.config.js`: Configuration file for Vite.
-   `package.json`: Manages project dependencies and scripts.

## Local Development

### Prerequisites
- [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Setup
1.  **Clone the repository:**
    ```bash
    git clone https://github.com/APorkolab/SprintSolve.git
    cd SprintSolve
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Running the Development Server
To start the Vite development server with hot-reloading:
```bash
npm run dev
```
Vite will output the local URL (usually `http://localhost:5173`).

### Running Tests
The test suite currently includes unit tests for collision detection and character logic.
```bash
npm test
```

## Deployment
This project is automatically deployed to GitHub Pages. The workflow is defined in `.github/workflows/deploy.yml`. Any push to the `main` branch will trigger a new build and deployment.
