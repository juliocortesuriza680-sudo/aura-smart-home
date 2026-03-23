import express from 'express';
import { createServer as createViteServer } from 'vite';
import WebSocket from 'ws';
import wol from 'wake_on_lan';
import path from 'path';

const app = express();
app.use(express.json());
const PORT = 3000;

// --- API ROUTES ---

// 1. Samsung TV Control API
app.post('/api/tv/command', (req, res) => {
  const { ip, command, mac = '00:00:00:00:00:00' } = req.body; // Default MAC for testing
  
  if (command === 'KEY_POWER') {
    // Wake on LAN for turning on (using provided or dummy MAC)
    wol.wake(mac, (error: any) => {
      if (error) {
        console.error('Error waking up TV:', error);
        // We don't return here because we still want to try the WebSocket connection
        // in case the TV is already on and just in standby.
      } else {
        console.log('WOL magic packet sent to', mac);
      }
    });
  }

  // WebSocket connection to Samsung TV (Tizen)
  // Note: Samsung TVs use self-signed certificates, so rejectUnauthorized: false is needed
  const wsUrl = `wss://${ip}:8002/api/v2/channels/samsung.remote.control?name=${Buffer.from('AURA Smart Home').toString('base64')}`;
  
  try {
    const ws = new WebSocket(wsUrl, { rejectUnauthorized: false });

    ws.on('open', () => {
      console.log(`Connected to TV at ${ip}`);
      
      // If it's a specific app launch (like Netflix)
      if (command.startsWith('Launch ')) {
        const appId = command === 'Launch Netflix' ? '11101200001' : '';
        // Send app launch command (Samsung specific payload)
        const payload = {
          method: 'ms.channel.emit',
          params: {
            event: 'ed.apps.launch',
            to: 'host',
            data: {
              action_type: 'NATIVE_LAUNCH',
              appId: appId
            }
          }
        };
        ws.send(JSON.stringify(payload));
      } else {
        // Send standard remote key
        const payload = {
          method: 'ms.remote.control',
          params: {
            Cmd: 'Click',
            DataOfCmd: command,
            Option: 'false',
            TypeOfRemote: 'SendRemoteKey'
          }
        };
        ws.send(JSON.stringify(payload));
      }

      // Close the connection after sending the command
      setTimeout(() => ws.close(), 1000);
      res.json({ status: 'Command sent', command });
    });

    ws.on('error', (error) => {
      console.error('TV WS Error:', error);
      res.status(500).json({ error: 'Failed to connect to TV' });
    });
  } catch (err) {
    console.error('Error creating WebSocket:', err);
    res.status(500).json({ error: 'WebSocket initialization failed' });
  }
});

// 2. Camera RTSP API (Scaffolding)
app.post('/api/camera/test', (req, res) => {
  const { rtspUrl } = req.body;
  // Here you would normally use fluent-ffmpeg to test the stream
  // For now, we return success to simulate the backend validation
  console.log('Testing RTSP URL on backend:', rtspUrl);
  setTimeout(() => {
    res.json({ status: 'success', message: 'RTSP connection successful' });
  }, 1500);
});

// --- VITE MIDDLEWARE ---
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
