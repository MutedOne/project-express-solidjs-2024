// src/app.ts
import express from 'express';
import { loginRoute } from './logincontroller';
import { userRoute } from './accountcontroller';
import { deptRoute } from './departmentcontroller';
import { classificationRoute } from './classcontroller';
import { eventRoute } from './eventcontroller';
import { environmentRoute } from './environmentcontroller';
import { actionRoute } from './actioncontroller';
import { projectRoute } from './projectcontroller';
import { ticketRoute } from './ticketcontroller';


const cors = require('cors');
const app = express();
const port = 4000;
const http = require('http');
const WebSocket = require('ws');
const server = http.createServer(app);
const wss = new WebSocket.Server({server:server});
const path = require('path');
const compression = require('compression')


wss.on('connection', (ws) => {
  console.log('WebSocket connected');

  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);

    // Broadcast the message to all connected clients
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  });
  ws.on('close', () => {
    console.log('WebSocket disconnected');
  });
});
app
.use(cors())
.use(express.json())
.use(express.urlencoded({ extended: true }))
.use(loginRoute)
.use(userRoute)
.use(deptRoute)

.use(eventRoute)
.use(environmentRoute)
.use(actionRoute)
.use(projectRoute)
.use(ticketRoute)
.use(classificationRoute)
.use(express.static(path.join(__dirname, '../../frontend/dist')))
 .get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../frontend/dist', 'index.html'));
})
;
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
