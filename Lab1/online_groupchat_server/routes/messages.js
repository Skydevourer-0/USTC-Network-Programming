const express = require('express');
const fs = require('fs');
const path = require("path");
const router = express.Router();

// 获取消息记录
router.get('/load-messages', (req, res) => {
    const date = req.body;
    const file = path.join(__dirname, '..', 'public', 'messageList.json');
    fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error reading file...');
        }
        const messageList = JSON.parse(data);
        const messages = messageList.filter(message => message.date === date);
        return res.status(200).send(messages);
    });
});

// 存储消息记录
router.post('/save-messages', (req, res) => {
    const messages = req.body;
    console.log(messages)
    const file = path.join(__dirname, '..', 'public', 'messageList.json');
    fs.readFile(file, 'utf-8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error reading file...');
        }
        let messageList = JSON.parse(data || '[]');
        messageList = messageList.concat(messages);
        fs.writeFile(file, JSON.stringify(messageList, null, 2), err => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error writing file...');
            }
            return res.status(200).send('Message saved successfully...');
        });
    });
});

module.exports = router;