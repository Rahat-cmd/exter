const WebSocket = require('ws');
const token = "YOUR_TOKEN_HERE";

const ws = new WebSocket("wss://gateway.discord.gg/?v=10&encoding=json");

ws.on('open', () => {
    console.log('✅ Connected to Discord Gateway');

    // Identify
    ws.send(JSON.stringify({
        op: 2,
        d: {
            token: token,
            properties: { $os: 'linux', $browser: 'chrome', $device: 'desktop' },
            intents: 0
        }
    }));
});

ws.on('message', (data) => {
    const msg = JSON.parse(data);
    console.log(`📨 Op: ${msg.op}, Type: ${msg.t || 'None'}`);

    if (msg.op === 10) { // Hello
        console.log('📊 Heartbeat interval:', msg.d.heartbeat_interval);

        // Send heartbeat
        setInterval(() => {
            ws.send(JSON.stringify({ op: 1, d: null }));
        }, msg.d.heartbeat_interval);
    }

    if (msg.op === 0 && msg.t === 'READY') {
        console.log('✅ Bot ready:', msg.d.user.username);

        // Try to join VC
        setTimeout(() => {
            const vcPayload = {
                op: 4,
                d: {
                    guild_id: "1281850217406267393",
                    channel_id: "1443517997573738560",
                    self_mute: true,
                    self_deaf: true
                }
            };
            console.log('🎤 Attempting to join VC...');
            ws.send(JSON.stringify(vcPayload));
        }, 2000);
    }
});

ws.on('error', (err) => {
    console.log('❌ WebSocket error:', err.message);
});
