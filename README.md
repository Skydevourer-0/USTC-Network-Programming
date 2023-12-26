# USTC 2023年 网络程序设计课程实验

## Lab1: 基于JavaScript的在线群聊系统的设计与实现
### 实验要求

1. 使用**Vue.js**设计在线群聊的前端应用；
2. 使用**Express**设计后端的RESTful API，由于是实验应用，不考虑数据库的使用，将用户列表和聊天记录均作为静态JSON文件保存在后端的文件系统中；
3. 使用**vuex**，**axios**将前后端整合；
4. 使用**session**机制，实现用户24小时内不用重复登录；
5. **专题实验**：使用**Websocket**方式实现群聊信息能够实时群发给所有在线用户。

### 系统框架

#### 前端

前端应用的UML类图如下所示：

![UML-前端](/Lab1/image/UML-前端.jpg)

其中，store目录下的index.js是vuex建立的store，用于管理应用中的状态；src目录下的main.js是Vue的启动文件；router.js是路由文件；App.vue是启动组件；而components下的UserLogin.vue和GroupChat.vue是登录页面组件和聊天页面组件。

#### 后端

后端应用的UML类图如下所示：

![UML-后端](/Lab1/image/UML-后端.jpg)

其中，routes目录下的users.js和messages.js文件使用了express.Router()创建了RESTful接口；app.js则是后端应用的启动文件，配置了cors，express-session，socket.io等。

### 系统实现

#### 1. 前端应用的实现

**创建项目**

- 下载相关依赖

```bash
npm install -g cnpm --registry=https://registry.npm.taobao.org
cnpm install vue-cli vuex vue-router
```

- 通过IDEA创建空白的Vue项目

**创建store**

- 使用vuex管理状态，创建store：

```bash
mkdir online_groupchat/store
cd online_groupchat/store && touch index.js
```

- 在store/index.js中，通过createStore()函数创建store，其中字段如下：
- state：要管理的状态；
- mutations：静态方法，用于修改状态；
- getters：静态方法，用于获取状态；
- actions：动态方法，调用后端接口进行相关操作。

**初步实现登录页面组件**

- 创建vue文件

```bash
cd online_groupchat
touch src/components/UserLogin.vue
```

- 创建变量username和password，用ref进行管理，用于表单中的输入框

```js
import {ref} from 'vue';
const username = ref('');
const password = ref('');
```

- 创建登录函数和注册函数

```js
const handleLogin = async () => {
  // 登录逻辑
}
const handleSignUp = async () => {
  // 注册逻辑
}
```

- 编写\<template>中的网页代码

```vue
<div class="login-container">
  <img src="/logo.png" alt="Logo" class="logo"/>
  <h2>登录</h2>
  <form @submit.prevent="handleLogin">
    <input id="username" type="text" v-model="username" placeholder="Username" required/>
    <input id="password" type="password" v-model="password" placeholder="Password" required/>
    <button id="login-button" type="submit">登录</button>
    <button id="signup-button" type="button" @click="handleSignUp">注册</button>
  </form>
</div>
```

- 编写\<style scoped>中的css代码，完成登录页面。

**初步实现聊天页面组件**

- 创建vue文件

```bash
touch src/components/GroupChat.vue
```

- 创建变量，用ref进行管理

```js
import {ref} from 'vue';
const username = ref('')
const messageContent = ref('')
const showDates = ref(false)
const dates = ref([])
```

- 通过onMounted函数，页面加载时调用store中的方法载入当日的消息记录，获取消息日期以及用户名

```js
import {onMounted} from 'vue';
import {useStore} from 'vuex';
const store = useStore();
onMounted(async () => {
  // 其他代码
  await store.dispatch('getDates');
  dates.value = store.getters.getDates;
  username.value = store.getters.getUsername;
  const date = new Date().toLocaleDateString();
  await store.dispatch('loadMessages',date);
  // 渲染消息列表后，将其滚动到最底部
  const messages = document.getElementsByClassName("messages")[0];
  messages.scrollTop = messages.scrollHeight;
  // 其他代码
});
```

- 发送消息函数

```js
const handleSend = async () => {
  const dateTime = new Date();
  const message = {
    username: store.getters.getUsername,
    date: dateTime.toLocaleDateString(),
    time: dateTime.toLocaleTimeString(),
    content: messageContent.value
  }
  // 调用store的方法进行消息的发送和保存
  // 其他代码
}
```

- 展开日期列表的函数，当查看聊天记录时，展开一个select列表，选择要查看的聊天记录的日期

```js
const handleShowDates = async () => {
  showDates.value = !showDates.value;
  if (showDates.value === false) {
    // 收起列表后重新渲染当日的消息记录
  }
}
```

- 获取聊天记录的函数

```js
const handleHistory = async (event) => {
  const date = event.target.value;
  await store.dispatch('loadMessages', date);
}
```

- 编写\<template>中的网页代码

```vue
<div class="container">
  <div class="menu">
    <button type="button" @click="handleShowDates">历史</button>
    <button type="button" @click="handleLogout">退出</button>
  </div>
  <div class="dates">
    <select v-if="showDates" @change="handleHistory">
      <option value="">选择一个日期</option>
      <option v-for="date in dates" :key="date">{{ date }}</option>
    </select>
  </div>
  <div class="messages">
    <div class="message" v-for="message in store.getters.getMessageList" :key="message.id">
      <div class="message-header">
        <img src="/favicon.ico" alt="icon"/>
        <span class="username">{{ message.username }}</span>
        <span class="time">{{ message.date }}</span>
        <span class="time">{{ message.time }}</span>
      </div>
      <div class="message-content">{{ message.content }}</div>
    </div>
  </div>
  <div class="send">
    <span class="username">{{ username }}</span>
    <form @submit.prevent="handleSend">
      <input type="text" v-model="messageContent" required/>
      <button type="submit">发送</button>
    </form>
  </div>
</div>
```

- 编写\<style scoped>中的css代码，完成聊天页面。

**实现路由操作**

- 创建路由文件

```bash
touch src/router.js
```

- 创建路由

```js
import {createRouter, createWebHashHistory} from "vue-router";
import UserLogin from "@/components/UserLogin.vue";
import GroupChat from "@/components/GroupChat.vue";

export default createRouter({
    history: createWebHashHistory(),
    routes: [
        {path: '/', component: UserLogin},
        {path: '/chat', component: GroupChat}
    ]
})
```

- 在组件中添加页面跳转代码

```js
// UserLogin.vue
const handleLogin = async () => {
  // 其他代码
  const online = store.getters.getOnline;
  if (online) {
    await router.push('/chat');
}
// GroupChat.vue
onMounted(async () => {
  if (!store.getters.getOnline) {
    await router.push('/')
  } else {
    // 其他代码
  }
});
```

**完成启动文件**

- 修改App.vue，在\<template>中添加代码

```vue
<div id="app">
  <router-view/>
</div>
```

- 修改main.js

```js
import { createApp } from 'vue'
import App from './App.vue'
import store from '../store'
import router from "@/router";

createApp(App)
    .use(store)
    .use(router)
    .mount('#app')
```

#### 2. 后端应用的实现

**创建项目**

- 下载相关依赖

```bash
cnpm install express fs path body-parser cors 
```

- 通过IDEA创建空白的Express项目

**创建静态文件存储用户列表和聊天记录**

```bash
cd online_groupchat_server
mkdir public
echo "[]" > public/messageList.json
echo "[]" > public/userList.json
```

**创建接口文件**

- 创建空白文件

```bash
mkdir routes
touch routes/messages.js routes/users.js
```

- 编写用户相关接口，包括登录接口，注册接口

```js
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// 用户注册
router.post('/signup', (req, res) => {
    const {username, password} = req.body;
    const file = path.join(__dirname, '..', 'public', 'userList.json');
    fs.readFile(file, 'utf8', (err, data) => {
        // 读取用户列表文件，若读写文件报错，返回码为500
        // 当用户列表中存在{username, password}的组合时，注册失败，返回码为400
        // 当用户列表中不存在该组合，将其写入文件，注册成功，返回码为200
    });
});

// 用户登录
router.post('/login', (req, res) => {
    const {username, password} = req.body;
    const file = path.join(__dirname, '..', 'public', 'userList.json');
    fs.readFile(file, 'utf8', (err, data) => {
        // 读取用户列表文件，若读写文件报错，返回码为500
        // 当用户列表中不存在该组合，登录失败，返回码为400
        // 当用户列表中存在{username, password}的组合时，登录成功，返回码为200
    });
});

module.exports = router;
```

- 编写消息相关接口，包括加载消息接口，保存消息接口，获取日期接口

```js
const express = require('express');
const fs = require('fs');
const path = require("path");
const router = express.Router();

// 获取消息记录
router.post('/load-messages', (req, res) => {
    const {date} = req.body;
    const file = path.join(__dirname, '..', 'public', 'messageList.json');
    fs.readFile(file, 'utf8', (err, data) => {
        // 读取聊天记录文件，若读文件报错，返回码为500
        // 将文件中所有date字段为{date}的记录保存到列表messages中
        return res.status(200).send(messages);
    });
});

// 存储消息记录
router.post('/save-messages', (req, res) => {
    const message = req.body;
    const file = path.join(__dirname, '..', 'public', 'messageList.json');
    fs.readFile(file, 'utf-8', (err, data) => {
        // 读取聊天记录文件，若读写文件报错，返回码为500
        // 读取JSON数组为messageList，将message添加到数组末端
        // 将新的messageList写入文件，保存成功，返回码为200
    });
});

router.get('/dates', (req, res) => {
    const file = path.join(__dirname, '..', 'public', 'messageList.json');
    fs.readFile(file, 'utf8', (err, data) => {
        // 读取聊天记录文件，若读文件报错，返回码为500
        // 读取JSON数组为messageList，将不重复的date字段保存为数组
        const uniqueDates = [...new Set(messageList.map(message => message.date))];
        return res.status(200).send(uniqueDates);
    });
});

module.exports = router;
```

**完成启动文件**

- 配置路由

```js
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const users = require('./routes/users')
const messages = require('./routes/messages')

app.use(bodyParser.json());
app.use('/api/users', users);
app.use('/api/messages', messages);
```

- 配置监听端口

```js
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});
```

#### 3. 前后端的结合

**下载相关依赖**

```bash
cnpm install axios
```

**前端调用后端接口**

- 在store/index.js中的actions字段中的方法中，通过axios调用后端接口，包括注册接口signUp，登录接口login，加载消息接口loadMessages，保存消息接口saveMessages，获取日期接口getDates。

```js
async singUp(_, {username, password}) {
    await axios.post('http://localhost:3000/api/users/signup', {username, password})
        .then(res => {
            console.log(res);
            if (res.status === 200) {
                alert('注册成功');
            }
        })
        .catch(err => {
            // 由于res的返回码为400或500时，axios均将其作为error处理，需要在catch中进一步识别
            if (err.response && err.response.status === 400) {
                alert('用户名已存在');
            } else {
                alert('服务器出错，注册失败');
            }
            console.error('Signup error: ', err);
        })
},
async login({commit}, {username, password}) {
    await axios.post('http://localhost:3000/api/users/login',
        {username, password},
        {withCredentials: true}
    ).then(res => {
        console.log(res);
        if (res.status === 200) {
            commit('setLogin', username);
        }
    }).catch(err => {
        if (err.response && err.response.status === 400) {
            alert('用户名或密码错误');
        } else {
            alert('服务器出错，登录失败');
        }
        console.error('Login error: ', err);
    });
},
async loadMessages({commit}, date) {
    await axios.post('http://localhost:3000/api/messages/load-messages', {date})
        .then(res => {
            console.log(res);
            if (res.status === 200) {
                commit('setMessageList', res.data);
            }
        })
        .catch(err => {
            alert('服务器出错，加载信息失败');
            console.error('Load message error: ', err);
        });
},
async saveMessages(_, message) {
    await axios.post('http://localhost:3000/api/messages/save-messages', message)
        .then(res => {
            console.log(res);
        })
        .catch(err => {
            alert('服务器出错，保存信息失败');
            console.error('Save message error: ', err);
        });
},
async getDates({commit}) {
    await axios.get('http://localhost:3000/api/messages/dates')
        .then(res => {
            console.log(res);
            if (res.status === 200) {
                commit('setDates', res.data);
            }
        })
        .catch(err => {
            alert('服务器出错，加载日期失败');
            console.error('Get dates error: ', err);
        })
}
```

**后端配置跨域资源共享（CORS）**

- 在后端的启动文件app.js中，配置cors

```js
const cors = require('cors');

app.use(cors({
    origin: 'http://localhost:8080',
    methods: ['GET', 'POST'],
    credentials: true
}));
```

#### 4. Session机制的应用

**下载相关依赖**

```bash
cnpm install express-session
```

**修改后端接口**

- 登录接口中，登录后将用户名记录到session中

```js
router.post('/login', (req, res) => {
    // 其他代码
    req.session.username = username;
    // 其他代码
});
```

- 添加登出接口，登出后将session和浏览器中对应的cookie销毁

```js
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
```

- 添加检查session接口，用于登录前的检查

```js
// 检查 session
router.get('/check_session', (req, res) => {
    if (req.session.username) {
        return res.status(200).send(req.session.username);
    } else {
        return res.status(400).send('No session...');
    }
});
```

**修改后端启动文件**

- 在启动文件app.js中使用中间件express-session

```js
const session = require('express-session');

app.use(session({
    key:'SESSION_ID',
    secret: 'A-RANDOM-SECRET-STRING',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        // 设置cookie过期时间为24小时
        maxAge: 1000 * 60 * 60 * 24
    }
}));
```

**修改前端store方法**

- 在store/index.js中的actions中，添加对应新的后端接口的函数

```js
async logout({commit}) {
    await axios.get('http://localhost:3000/api/users/logout',
        {withCredentials: true}
    ).then(res => {
        console.log(res);
        if (res.status === 200) {
            commit('setLogout');
        }
    }).catch(err => {
        alert('服务器出错，登出失败');
        console.error('Logout error: ', err);
    })
},
async checkSession({commit}) {
    await axios.get('http://localhost:3000/api/users/check_session',
        {withCredentials: true}
    ).then(res => {
        console.log(res);
        if (res.status === 200) {
            commit('setLogin', res.data);
        } else {
            console.log('Session not exists');
        }
    })
        .catch(err => {
            console.error('Check session error: ', err);
        });
}
```

**修改聊天页面组件**

- 在页面加载时，调用检查session的接口，判断是否已有用户登录，若没有，则跳转到登录页面

```js
onMounted(async () => {
  await store.dispatch('checkSession');
  if (!store.getters.getOnline) {
    await router.push('/')
  } else {
    // 其他代码
  }
});
```

#### 5. （**专题实验）**Websocket实现实时群发消息

**下载相关依赖**

```bash
# 前端应用中
cd online_groupchat
cnpm install socket.io-client
# 后端应用中
cd online_groupchat_server
cnpm install socket.io
```

**修改后端启动文件**

- 在后端启动文件app.js中配置socket，注意要单独配置CORS，且监听端口时改为server而不是app

```js
const http = require('http');
const {Server} = require('socket.io');

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
        // 服务端收到标记为‘chat message’的消息时，将其发送到所有客户端
        io.emit('chat message',message);
    })
})

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});
```

**修改前端聊天页面**

- 配置socket客户端，通过接受服务端发送的消息实现与消息发送方同步将新消息渲染到聊天页面中，即实现了实时群发消息

```js
import {io} from 'socket.io-client';

socket.on('chat message', (message) => {
  // 若收到的消息是自己发出的，则直接return
  if (message.username === store.getters.getUsername)
    return;
  // 否则添加到消息列表中
  store.commit('addMessage', message);
})
```

- 修改消息发送函数，当消息发出后，不只是添加到store的消息列表中，还要发送给socket的服务端

```js
const handleSend = async () => {
  // 其他代码
  socket.emit('chat message', message);
  // 其他代码
}
```

### 系统测试

详见 [《基于JavaScript的在线群聊系统的设计与实现》](https://zhuanlan.zhihu.com/p/674616141)

