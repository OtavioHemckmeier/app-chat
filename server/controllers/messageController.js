const Message = require("../models/Message");

// Realiza conexão com o redis
const redis = require('redis');
const publisher = redis.createClient({
  port: 6379,
  host: "localhost"
});

const addMessage = async (req, res) => {
  try {
    const message = await Message.create({
      user: req.body.user,
      message: req.body.message,
      date: req.body.date,
    });

    publisher.publish("newMessage", JSON.stringify(message))

    return res.json({
      success: true,
      message: "Message added.",
    });

  } catch (error) {
    console.log("Error with adding message: ", error);
    return res.json({
      success: false,
      message: "Error with adding message.",
    });
  }
};

const getMessages = async (req, res) => {
  try {
    const messages = await Message.find().select(["-__v"]);

    return res.json({
      success: true,
      messages,
    });
  } catch (error) {
    console.log("Error with fetching messages: ", error);
    return res.json({
      success: false,
      message:
        "Error with fetching messages.",
    });
  }
};

module.exports = {
  addMessage,
  getMessages,
};
