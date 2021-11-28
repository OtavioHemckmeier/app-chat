const express = require("./config/express.js"),
  mongoose = require("mongoose");
cron = require("node-cron");

//Cria conecxão com o redis
const redis = require('redis');
const publisher = redis.createClient({
  port: 6379,
  host: "localhost"
});

// Usa env ou default
const port = process.env.PORT || 5000;

// Inicia o server
const app = express.init();
const server = require("http").createServer(app);
server.listen(port, () => console.log(`Server now running on port ${port}!`));

// Conecta com o db
mongoose.connect(process.env.DB_URI || require("./config/config").db.uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const connection = mongoose.connection;

// Descomentando o publisher abaixo, o servidor irá publicar os eventos no redis através dos eventos capturados na collection "messages"
// Atualmente está publicando no redis através do controller addMessage em controllers/messageController.js
connection.once("open", () => {
  console.log("MongoDB database connected");

  // Fica escutando eventos na collection messages
  const messagestChangeStream = connection.collection("messages").watch();

  messagestChangeStream.on("change", (change) => {
    switch (change.operationType) {
      case "insert":
        const message = change.fullDocument;

        // publisher.publish("newMessage", JSON.stringify(message))
        break;
    }
  });
});

connection.on("error", (error) => console.log("Error: " + error));
