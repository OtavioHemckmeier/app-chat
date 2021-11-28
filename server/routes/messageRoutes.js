const { addMessage, getMessages } = require("../controllers/messageController"),
  express = require("express"),
  router = express.Router();

router.post("/addMessage", addMessage);
router.get("/getMessages", getMessages);

module.exports = router;
