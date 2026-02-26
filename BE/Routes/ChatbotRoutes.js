const express = require('express');
const { handleChatbotRequest } = require('../Controllers/Chatbot');

const router = express.Router();
router.post('/ask', handleChatbotRequest);

module.exports = router;