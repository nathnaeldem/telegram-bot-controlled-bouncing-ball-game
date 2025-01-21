require('dotenv').config();
const { Telegraf } = require('telegraf');
const WebSocket = require('ws');

// Telegram bot token from .env file
const BOT_TOKEN = process.env.BOT_TOKEN;

if (!BOT_TOKEN) {
  throw new Error('BOT_TOKEN is not defined in the .env file');
}

const bot = new Telegraf(BOT_TOKEN);

// WebSocket server URL
const WS_URL = 'wss://gray-neighborly-plain.glitch.me/'; // Replace with your WebSocket server URL (localhost:port) if you are running it on your machine

// WebSocket client
const ws = new WebSocket(WS_URL, {
  headers: {
    "user-agent": "mozilla"
  }
});

ws.on('open', () => {
  console.log('Connected to WebSocket server');
});

ws.on('close', () => {
  console.log('WebSocket connection closed');
});

// Handle ping from client and respond with pong
ws.on('message', (message) => {
  if (message === 'ping') {
    console.log('Received ping from client, sending pong');
    ws.send('pong'); // Respond with pong to keep the connection alive
  }
});

// Telegram commands with inline keyboard
bot.start((ctx) => {
  const keyboard = [
    [{ text: '▶️ Start Game', callback_data: 'start_game' }],
    [{ text: '⏸️ Stop Game', callback_data: 'stop_game' }],
    [
      { text: '⬆️ Speed Up', callback_data: 'speed_up' },
      { text: '⬇️ Slow Down', callback_data: 'slow_down' }
    ],
    [{ text: '🔄 Reverse Direction', callback_data: 'reverse' }]
  ];

  ctx.reply('Welcome! Use the buttons below to control the game.', {
    reply_markup: {
      inline_keyboard: keyboard
    }
  });
});

// Handle button interactions
bot.on('callback_query', (ctx) => {
  const command = ctx.callbackQuery.data;

  switch (command) {
    case 'start_game':
      ws.send(JSON.stringify({ command: 'start' }));
      ctx.answerCbQuery('Game started!');
      break;

    case 'stop_game':
      ws.send(JSON.stringify({ command: 'stop' }));
      ctx.answerCbQuery('Game stopped!');
      break;

    case 'speed_up':
      ws.send(JSON.stringify({ command: 'speedUp' }));
      ctx.answerCbQuery('Speeding up!');
      break;

    case 'slow_down':
      ws.send(JSON.stringify({ command: 'slowDown' }));
      ctx.answerCbQuery('Slowing down!');
      break;

    case 'reverse':
      ws.send(JSON.stringify({ command: 'reverse' }));
      ctx.answerCbQuery('Reversed direction!');
      break;

    default:
      ctx.answerCbQuery('Unknown command!');
  }
});

// Keep the server active by making the bot interact with itself
const keepAliveCommands = ['start_game', 'speed_up', 'slow_down', 'reverse'];
let currentCommandIndex = 0;

setInterval(() => {
  const command = keepAliveCommands[currentCommandIndex];
  ws.send(JSON.stringify({ command }));
  console.log(`Sent keep-alive command: ${command}`);

  // Cycle through the commands
  currentCommandIndex = (currentCommandIndex + 1) % keepAliveCommands.length;
}, 10000); // Sends a command every 10 seconds

bot.launch();
console.log('Telegram bot is running...');
