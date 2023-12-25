const express = require('express');
const fs = require('fs');
const path = require("path");
const router = express.Router();

// 获取消息记录
router.post('/load-messages', (req, res) => {
    const {date} = req.body;
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
    const message = req.body;
    const file = path.join(__dirname, '..', 'public', 'messageList.json');
    fs.readFile(file, 'utf-8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error reading file...');
        }
        let messageList = JSON.parse(data || '[]');
        messageList.push(message);
        fs.writeFile(file, JSON.stringify(messageList, null, 2), err => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error writing file...');
            }
            return res.status(200).send('Message saved successfully...');
        });
    });
});

router.get('/dates', (req, res) => {
    const file = path.join(__dirname, '..', 'public', 'messageList.json');
    fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error reading file...');
        }
        const messageList = JSON.parse(data);
        const uniqueDates = [...new Set(messageList.map(message => message.date))];
        return res.status(200).send(uniqueDates);
    });
});

module.exports = router;