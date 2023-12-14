const express = require('express');
const fs = require('fs');
const router = express.Router();

// 获取消息记录
router.get('/load-messages', (req, res) => {
    const {date} = req.body;
    const path = '/messageList.json';
    fs.readFile(path, 'utf8', (err, data) => {
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
    const {messages} = req.body;
    const path = '/messageList.json';
    fs.readFile(path, 'utf-8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error reading file...');
        }
        let messageList = JSON.parse(data || '[]');
        messageList = messageList.concat(messages);
        fs.writeFile(path, JSON.stringify(messageList, null, 2), err => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error writing file...');
            }
            return res.status(200).send('Message saved successfully...');
        });
    });
});

export default router;