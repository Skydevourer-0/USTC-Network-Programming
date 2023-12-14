const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const users = require('./routes/users')
const messages = require('./routes/messages')

app.use(bodyParser.json());
app.use('/api/users',users);
app.use('/api/messages',messages);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});