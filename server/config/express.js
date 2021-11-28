const path = require("path"),
  express = require("express"),
  morgan = require("morgan"),
  bodyParser = require("body-parser"), 
    messageRoutes = require("../routes/messageRoutes"),
  cors = require("cors");

module.exports.init = () => {
  // Inicializa o app
  const app = express();

  app.use(cors());

  // Middleware
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  // Rotas
  app.use("/api/messages", messageRoutes);

  return app;
};
