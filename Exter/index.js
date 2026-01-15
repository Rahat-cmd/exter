const axios = require('axios');
const fs = require('fs');
const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const config = require('./config.json');
const FILEPATH = './tokens.txt';
const INTERVAL = 15 * 60 * 1000; // Increased to 15 minutes for longer sessions
const GATEWAY_URL = "wss://gateway.discord.gg/?v=10&encoding=json";
const DISCORD_USER_URL = "https://discord.com/api/v10/users/@me";

// Your super-secret key — CHANGE THIS to something long & random, NEVER share it!
const LICENSE_SECRET = 'change-this-to-a-very-long-random-string-2026-xai-grok-safe-keep-it-secret';

// ANSI color codes
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    bgRed: '\x1b[41m',
    bgBlack: '\x1b[40m',
    underline: '\x1b[4m',
    blink: '\x1b[5m'
};

// ====================== LICENSE VALIDATION ======================
console.clear();
console.log(${colors.yellow}MASS VOICE CONNECTOR - License Check ☠${colors.reset}\n);

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

const LICENSE_PROMPT = `
${colors.cyan}Paste your license key here (the long string provided by seller):${colors.reset}
> `;

readline.question(LICENSE_PROMPT, (input) => {
  const licenseKey = input.trim();

  if (!licenseKey) {
    console.log(${colors.red}No license key entered. Exiting... ☠${colors.reset});
    process.exit(1);
  }

  try {
    const decoded = jwt.verify(licenseKey, LICENSE_SECRET);
    const expiryDate = new Date(decoded.exp * 1000);
    const now = new Date();
    const remainingMs = expiryDate - now;

    if (remainingMs <= 0) {
      throw new Error('jwt expired');
    }

    console.log(`${colors.green}License accepted! Expires: ${expiryDate.toLocaleString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
    })} ☠${colors.reset}\n`);

    readline.close();

    // ────────────────────────────────────────────────
    // Banner
    // ────────────────────────────────────────────────
    console.log(`
${colors.bgBlack}${colors.red}${colors.bright}
███████╗██╗ ██╗ ████████╗███████╗██████╗ ☠
██╔════╝╚██╗██╔╝ ╚══██╔══╝██╔════╝██╔══██╗
█████╗  ╚███╔╝  ██║    █████╗  ██████╔╝
██╔══╝  ██╔██╗  ██║    ██╔══╝  ██╔══██╗
███████╗██╔╝ ██╗██║    ███████╗██║  ██║
╚══════╝╚═╝  ╚═╝╚═╝    ╚══════╝╚═╝  ╚═╝
              EX-TER ☠
         MASS VOICE CONNECTOR
         ${colors.cyan}discord: caramel_rahat ${colors.reset}${colors.bgBlack}${colors.red}
${colors.bgRed}${colors.white} USE AT YOUR OWN RISK - DISCORD TOS VIOLATION ☠ ${colors.reset}${colors.bgBlack}${colors.red}
${colors.reset}`);

    // ────────────────────────────────────────────────
    // LIVE COUNTDOWN TIMER
    // ────────────────────────────────────────────────
    console.log(${colors.yellow}License remaining:${colors.reset});

    const countdownInterval = setInterval(() => {
      const currentTime = new Date();
      const timeLeftMs = expiryDate - currentTime;

      if (timeLeftMs <= 0) {
        clearInterval(countdownInterval);
        console.log(`\r${colors.bgRed}${colors.white} LICENSE EXPIRED ☠ Stopping script... ${colors.reset}          `);
        process.exit(1);
      }

      const hours = Math.floor(timeLeftMs / 3600000);
      const minutes = Math.floor((timeLeftMs % 3600000) / 60000);
      const seconds = Math.floor((timeLeftMs % 60000) / 1000);

      // Overwrite the same line
      process.stdout.write(\r${colors.yellow}License remaining: ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}   ${colors.reset});

    }, 1000);

    // ────────────────────────────────────────────────
    // Your original functions
    // ────────────────────────────────────────────────

    function getTimestamp() {
        return ${colors.blue}[ ${new Date().toLocaleTimeString()}]${colors.reset};
    }

    function readAndSortTokens(filepath) {
        if (!fs.existsSync(filepath)) {
            console.error(${getTimestamp()} ${colors.bgRed}${colors.white} ERROR: tokens.txt not found! ☠ ${colors.reset});
            process.exit(1);
        }
       
        const content = fs.readFileSync(filepath, 'utf-8');
        const tokens = content.split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);
       
        if (tokens.length === 0) {
            console.error(${getTimestamp()} ${colors.bgRed}${colors.white} ERROR: No tokens found ☠ ${colors.reset});
            process.exit(1);
        }
       
        console.log(${getTimestamp()} ${colors.green}Loaded ${colors.bright}${tokens.length}${colors.reset} ${colors.green} tokens ☠${colors.reset});
        return tokens;
    }

    async function checkToken(token, index) {
        try {
            const response = await axios.get(DISCORD_USER_URL, {
                headers: { Authorization: token },
                timeout: 10000
            });
           
            console.log(${getTimestamp()} ${colors.green}Token ${index + 1}: VALID (${response.data.username})${colors.reset});
            return token;
        } catch (error) {
            console.error(${getTimestamp()} ${colors.red}Token ${index + 1}: ${error.response?.status === 401 ? 'INVALID' : 'ERROR'}${colors.reset});
            return null;
        }
    }

    async function validateTokens(tokens) {
        console.log(${getTimestamp()} ${colors.cyan}Validating tokens... ${colors.reset}\n);
        const validTokens = [];
       
        for (let i = 0; i < tokens.length; i++) {
            const valid = await checkToken(tokens[i], i);
            if (valid) validTokens.push(valid);
        }
       
        console.log(${getTimestamp()} ${colors.cyan}${validTokens.length}/${tokens.length} tokens valid ${colors.reset}\n);
        return validTokens;
    }

    function wsJoin(token) {
        const ws = new WebSocket(GATEWAY_URL);
        const tokenPreview = token.substring(0, 20) + '...';

        let heartbeatIntervalId = null;
        let lastSequence = null;
        let sessionId = null; // Optional: for future resume support

        const auth = {
            op: 2,
            d: {
                token,
                properties: {
                    $os: 'linux',
                    $browser: 'chrome',
                    $device: 'desktop'
                },
                // intents: 0, // optional, minimal for voice presence
            }
        };

        const vc = {
            op: 4,
            d: {
                guild_id: config.GUILD_ID,
                channel_id: config.VC_CHANNEL,
                self_mute: config.MUTED ?? true,
                self_deaf: config.DEAFEN ?? true,
                self_video: config.VIDEO ?? false
            }
        };

        ws.on('open', () => {
            console.log(${getTimestamp()} ${colors.yellow}WS opened for ${tokenPreview}${colors.reset});
            ws.send(JSON.stringify(auth));
            setTimeout(() => {
                ws.send(JSON.stringify(vc));
                console.log(${getTimestamp()} ${colors.green}→ ${tokenPreview} joined voice ☠ ${colors.reset});
            }, 1200);
        });

        ws.on('message', (data) => {
            try {
                const payload = JSON.parse(data.toString());

                // Save sequence for heartbeats / resume
                if (payload.s !== undefined && payload.s !== null) {
                    lastSequence = payload.s;
                }

                switch (payload.op) {
                    case 10: // Hello - start heartbeat
                        const hbInterval = payload.d.heartbeat_interval;
                        // First heartbeat with random jitter (0–interval)
                        const jitter = Math.random();
                        const firstDelay = hbInterval * jitter;

                        setTimeout(() => {
                            ws.send(JSON.stringify({ op: 1, d: lastSequence }));
                            console.log(${getTimestamp()} ${colors.blue}First heartbeat sent for ${tokenPreview}${colors.reset});
                        }, firstDelay);

                        // Then every interval
                        heartbeatIntervalId = setInterval(() => {
                            ws.send(JSON.stringify({ op: 1, d: lastSequence }));
                            // console.log(${getTimestamp()} Heartbeat sent for ${tokenPreview});
                        }, hbInterval);

                        break;

                    case 11: // Heartbeat ACK - good, connection alive
                        // console.log(${getTimestamp()} Heartbeat ACK received for ${tokenPreview});
                        break;

                    case 7: // Reconnect
                    case 9: // Invalid Session
                        console.log(${getTimestamp()} ${colors.red}Reconnect/Invalid session for ${tokenPreview} (op ${payload.op})${colors.reset});
                        ws.close();
                        break;

                    // Optional: capture session_id from READY event (for future resume)
                    case 0:
                        if (payload.t === 'READY') {
                            sessionId = payload.d.session_id;
                            console.log(${getTimestamp()} ${colors.cyan}READY received - session_id captured${colors.reset});
                        }
                        break;
                }
            } catch (err) {
                console.error(${getTimestamp()} ${colors.red}WS message parse error: ${err}${colors.reset});
            }
        });

        ws.on('error', (err) => {
            console.log(${getTimestamp()} ${colors.red}× ${tokenPreview} error: ${err.message}${colors.reset});
        });

        ws.on('close', (code, reason) => {
            console.log(${getTimestamp()} ${colors.yellow}WS closed for ${tokenPreview} (code ${code || 'unknown'}, reason: ${reason || 'none'})${colors.reset});
            if (heartbeatIntervalId) clearInterval(heartbeatIntervalId);
            // Your reconnect loop will recreate wsJoin anyway
        });

        // Removed forced close - let Discord manage, reconnect loop will handle
        // setTimeout(() => ws.close(), INTERVAL - 2000);  ← commented out
    }

    async function main() {
        try {
            const tokens = readAndSortTokens(FILEPATH);
            const validTokens = await validateTokens(tokens);
           
            if (!validTokens.length) {
                console.log(${getTimestamp()} ${colors.red}No valid tokens. Exiting... ☠ ${colors.reset});
                return;
            }
            console.log(${getTimestamp()} ${colors.bright}${colors.red}Starting connections with ${validTokens.length} tokens... ☠ ${colors.reset}\n);
            validTokens.forEach((token, i) => {
                setTimeout(() => wsJoin(token), i * 1800);
            });
            setInterval(() => {
                console.log(${getTimestamp()} ${colors.magenta}♻ Reconnecting all accounts... ☠ ${colors.reset});
                validTokens.forEach((token, i) => {
                    setTimeout(() => wsJoin(token), i * 1800);
                });
            }, INTERVAL);
        } catch (err) {
            console.error(${getTimestamp()} ${colors.bgRed}${colors.white} FATAL: ${err.message} ☠ ${colors.reset});
        }
    }

    // Start the main logic
    setTimeout(main, 1200);

  } catch (err) {
    console.log(${colors.bgRed}${colors.white} License invalid or expired: ${err.message} ☠ ${colors.reset});
    console.log(${colors.yellow}Contact seller for a new key.${colors.reset});
    process.exit(1);
  }
});
