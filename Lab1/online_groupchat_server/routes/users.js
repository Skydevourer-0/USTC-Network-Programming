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
            // 登录成功后，将用户名存入 session
            req.session.username = username;
            res.status(200).send('Login success...');
        } else {
            res.status(400).send('Username or password error...');
        }
    });
});

// 用户登出
router.get('/logout', (req, res) => {
    // 登出后，将 session 销毁
    req.session.destroy(err => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error in logout...');
        }
        res.clearCookie('SESSION_ID', {path: '/'});
        res.status(200).send('Logout success...');
    });
});

// 检查 session
router.get('/check_session', (req, res) => {
    if (req.session.username) {
        return res.status(200).send(req.session.username);
    } else {
        return res.status(400).send('No session...');
    }
});

module.exports = router;