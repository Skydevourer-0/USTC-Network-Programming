const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// 用户注册
router.post('/signup', (req, res) => {
    const {username, password} = req.body;
    const file = path.join(__dirname, '..', 'public', 'userList.json');
    fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error reading file...');
        }
        const userList = JSON.parse(data);
        const exists = userList.some(user => user.username === username);
        if (exists) {
            return res.status(400).send('Username already exists...');
        } else {
            userList.push({username, password});
            fs.writeFile(file, JSON.stringify(userList, null, 2), err => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Error writing file...');
                }
                return res.status(200).send('User registration success...');
            });
        }
    });
});

// 用户登录
router.post('/login', (req, res) => {
    const {username, password} = req.body;
    const file = path.join(__dirname, '..', 'public', 'userList.json');
    fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error reading file...');
        }
        const userList = JSON.parse(data);
        const exists = userList.some(user => user.username === username && user.password === password);
        if (exists) {
            return res.status(200).send('Login success...');
        } else {
            return res.status(400).send('Username or password error...');
        }
    });
});

module.exports = router;