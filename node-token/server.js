// server.js
import express from 'express';
import { AccessToken } from 'livekit-server-sdk';

const createToken = async (roomName, identity) => {
  const room = roomName || 'quickstart-room';
  const participantId = identity || `user-${Date.now()}-${Math.random().toString(36).slice(2)}`;

  const at = new AccessToken("API7YeAqJ3neqUe","E6xrfOOhfADpmW2f3vIrBedLKePeXEJe3vehpSJek48jB", {
    identity: participantId,
    ttl: '10m',
  });
  at.addGrant({ roomJoin: true, room: room, canPublish: true, canSubscribe: true });

  console.log(`Generated token for participant: ${participantId} in room: ${room}`);
  return await at.toJwt();
};

const app = express();

// Enable CORS for all origins
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/getToken', async (req, res) => {
  const { room, identity } = req.query;
  const token = await createToken(room, identity);
  res.send(token);
});

app.get('/', (req, res) => {
  res.send('LiveKit Token Server - Use /getToken to get a token');
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const port = 3000;
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

// Export for Vercel
export default app;
