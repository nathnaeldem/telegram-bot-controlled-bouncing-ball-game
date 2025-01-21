Bouncing Ball Game - Full Stack Developer Assessment

## Overview
This project demonstrates the implementation of a responsive web-based bouncing ball game controlled via a Telegram bot. It showcases front-end development, WebSocket communication, and bot integration. The game features real-time controls both through the web interface and Telegram commands.

## Features
1. **Responsive Web Game**
   - A bouncing ball animation hosted on a responsive web page.
   - Controls include Start, Pause, Speed Up, Slow Down, and Reverse.
   - Real-time updates using WebSockets.

2. **Telegram Bot Integration**
   - A bot built with Node.js and Telegraf library.
   - Commands to control the game: `/start_game`, `/stop_game`, `/speed_up`, `/slow_down`, `/reverse`.
   - Smooth user registration process and interaction.

3. **WebSocket Communication**
   - Real-time communication between the web page and Telegram bot via WebSocket.
   - Handles client connections and broadcasts messages.

## Folder Structure
```
├── bot/
│   └── .env              # Bot token
|   └── bot.js            # Telegram bot code
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── BouncingBallGame.tsx   # React component for the game
│   │   └── App.css                     # Styles for the game
│   └── public/
│       └── index.html                  # Entry point
├── backend/
│   └── server.js         # WebSocket server logic
├── readme/
│   └── README.md         # Documentation
       
```

## Installation
### Prerequisites
- Node.js and npm
- React with TypeScript setup

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo-url/bouncing-ball-game.git
   cd bouncing-ball-game
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the WebSocket server:
   ```bash
   cd backend
   node server.js
   ```

4. Launch the React app:
   ```bash
   cd frontend
   npm start
   ```

5. Set up the Telegram bot:
   - Replace `BOT_TOKEN` in `.env` with your bot token from BotFather. I have voided my token
   - Run the bot:
     ```bash
     cd bot
     node bot.js
     ```

6. Access the game via your browser and interact using the bot commands.

## Usage
### Web Game
- Navigate to the web page hosting the game.
- Use the on-screen buttons to control the ball.

### Telegram Bot
- Send commands to the bot to control the game:
  - `/start_game` - Start the ball movement.
  - `/stop_game` - Pause the ball.
  - `/speed_up` - Increase speed.
  - `/slow_down` - Decrease speed.
  - `/reverse` - Change direction.

## Deployment
For shortlisted candidates:
1. Use the provided Google Cloud Platform (GCP) account.
2. Deploy the WebSocket server, frontend, and bot to GCP.

## Technologies Used
- React (TypeScript)
- Node.js
- WebSockets
- Telegraf Library (Telegram bot)
- HTML/CSS

## Author
Nathnael Demeke

---

### Submission Instructions
1. Package the project files into a single zip file.
2. Include the following:
   - All source code.
   - This `README.md` file.
3. Submit the zip file via the employer’s preferred platform or email.

