const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const http = require('http');
const {Server} = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin: 'http://localhost:8080',
        methods: ['GET', 'POST'],
        credentials: true
    }
});

io.on('connection',(socket) =>{
    socket.on('chat message',(message)=>{
        io.emit('chat message',message);
    })
})

const users = require('./routes/users')
const messages = require('./routes/messages')

app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:8080',
    methods: ['GET', 'POST'],
    credentials: true
}));
app.use(session({
    key:'SESSION_ID',
    secret: 'A-RANDOM-SECRET-STRING',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60 * 24
    }
}));
app.use('/api/users', users);
app.use('/api/messages', messages);

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});