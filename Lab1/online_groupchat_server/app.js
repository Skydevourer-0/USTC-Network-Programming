const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

const users = require('./routes/users')
const messages = require('./routes/messages')

app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:8080',
    methods: ['GET', 'POST'],
    credentials: true
}))
app.use('/api/users', users);
app.use('/api/messages', messages);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});