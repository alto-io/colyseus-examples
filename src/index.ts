// // https://docs.colyseus.io/server/transport/#__tabbed_2_2

import { Server } from "@colyseus/core";
import { monitor } from "@colyseus/monitor";
import { WebSocketTransport } from "@colyseus/ws-transport";
import express from "express";
import { createServer } from "http";
import path from 'path';
import serveIndex from 'serve-index';

// Import demo room handlers
import { LobbyRoom, RelayRoom } from 'colyseus';
import { ChatRoom } from "./rooms/01-chat-room";
import { StateHandlerRoom } from "./rooms/02-state-handler";
import { AuthRoom } from "./rooms/03-auth";
import { ReconnectionRoom } from './rooms/04-reconnection';
import { CustomLobbyRoom } from './rooms/07-custom-lobby-room';

const app = express();
const server = createServer(app); // create the http server manually

const gameServer = new Server({
  transport: new WebSocketTransport({
    server // provide the custom server for `WebSocketTransport`
  })
});

// Define "lobby" room
gameServer.define("lobby", LobbyRoom);

// Define "relay" room
gameServer.define("relay", RelayRoom, { maxClients: 4 })
    .enableRealtimeListing();

// Define "chat" room
gameServer.define("chat", ChatRoom)
    .enableRealtimeListing();

// Register ChatRoom with initial options, as "chat_with_options"
// onInit(options) will receive client join options + options registered here.
gameServer.define("chat_with_options", ChatRoom, {
    custom_options: "you can use me on Room#onCreate"
});

// Define "state_handler" room
gameServer.define("state_handler", StateHandlerRoom)
    .enableRealtimeListing();

// Define "auth" room
gameServer.define("auth", AuthRoom)
    .enableRealtimeListing();

// Define "reconnection" room
gameServer.define("reconnection", ReconnectionRoom)
    .enableRealtimeListing();

// Define "custom_lobby" room
gameServer.define("custom_lobby", CustomLobbyRoom);

gameServer.onShutdown(function(){
    console.log(`game server is going down.`);
});

const port = Number(process.env.PORT) || 2567;
gameServer.listen(port);
console.log(`Listening on port: ${port}`)

// serve HTML files from src/static directory
app.use('/', serveIndex(path.join(__dirname, "static"), {'icons': true}))
app.use('/', express.static(path.join(__dirname, "static")));

// (optional) attach web monitoring panel
app.use("/colyseus", monitor());
