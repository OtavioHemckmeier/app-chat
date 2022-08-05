const express = require("express")
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const PORT = 8080;

//conexão redis
const redis = require('redis');
const subscriber = redis.createClient({
    port: 6379,
    host: "localhost"
});

// Inicio conexão websocket
io.of("/api/socket").on("connection", (socket) => {
    console.log("socket.io: User connected: ", socket.id);
    socket.emit("newConnection", socket.id)

    socket.on("disconnect", () => {
        console.log("socket.io: User disconnected: ", socket.id);
    });
});

// Captura todas a messagens publicadas no redis
subscriber.on("message", (channel, message) => {
    io.of("/api/socket").emit(channel, JSON.parse(message));
})

// Determina quais sao os canais que o redis vai se increver
subscriber.subscribe("newMessage");

// Inícia o server
http.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
});
