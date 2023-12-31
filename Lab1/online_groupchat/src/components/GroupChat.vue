<script setup>
import {ref, onMounted} from 'vue'
import {useStore} from 'vuex'
import {useRouter} from "vue-router";
import {io} from 'socket.io-client';

const store = useStore()
const router = useRouter()
const username = ref('')
const messageContent = ref('')
const showDates = ref(false)
const dates = ref([])
const socket = io('http://localhost:3000')

socket.on('chat message', (message) => {
  console.log('Received from server: ', message);
  if (message.username === store.getters.getUsername)
    return;
  store.commit('addMessage', message);
  const messages = document.getElementsByClassName("messages")[0];
  messages.scrollTop = messages.scrollHeight;
})

onMounted(async () => {
  await store.dispatch('checkSession');
  if (!store.getters.getOnline) {
    await router.push('/')
  } else {
    await store.dispatch('getDates');
    dates.value = store.getters.getDates;
    username.value = store.getters.getUsername;
    const date = new Date().toLocaleDateString();
    await store.dispatch('loadMessages', date);
    const messages = document.getElementsByClassName("messages")[0];
    messages.scrollTop = messages.scrollHeight;
  }
});

const handleSend = async () => {
  const dateTime = new Date();
  const message = {
    username: store.getters.getUsername,
    date: dateTime.toLocaleDateString(),
    time: dateTime.toLocaleTimeString(),
    content: messageContent.value
  }
  store.commit('addMessage', message)
  await store.dispatch('saveMessages', message);
  socket.emit('chat message', message);
  messageContent.value = ''
  const messages = document.getElementsByClassName("messages")[0];
  messages.scrollTop = messages.scrollHeight;
}

const handleLogout = async () => {
  await store.dispatch('logout');
  await store.dispatch('saveMessages');
  await router.push('/');
}

const handleShowDates = async () => {
  showDates.value = !showDates.value;
  if (showDates.value === false) {
    const date = new Date().toLocaleDateString();
    await store.dispatch('loadMessages', date);
    const messages = document.getElementsByClassName("messages")[0];
    messages.scrollTop = messages.scrollHeight;
  }
}

const handleHistory = async (event) => {
  const date = event.target.value;
  await store.dispatch('loadMessages', date);
  const messages = document.getElementsByClassName("messages")[0];
  messages.scrollTop = messages.scrollHeight;
}

</script>

<template>
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
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 90vh;
  padding: 20px;
  justify-content: center;
  align-items: center;
}

.dates select {
  padding: 5px;
  font-size: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
}

.menu button {
  font-size: 14px;
  margin: 5px;
  padding: 5px;
}

.messages {
  overflow-y: scroll;
  height: 80vh;
  width: 90vw;
  margin-bottom: 20px;
}

.message {
  display: flex;
  flex-direction: column;
  padding: 5px;
  margin: 5px;
}

.message-header {
  display: flex;
  flex-direction: row;
}

.message-header img {
  margin: 2px;
}

.username {
  display: flex;
  align-items: center;
  padding: 5px 10px;
  margin: 0 5px;
  border-radius: 10px;
  background: #dcedf5;
}

.time {
  display: flex;
  align-items: center;
  padding: 5px 5px;
}

.message-content {
  margin: 5px;
  padding: 5px;
  text-align: left;
  border-style: solid;
  border-width: 1px;
  border-radius: 5px;
  border-color: #aaa;
}

.send {
  display: flex;
  flex-direction: row;
  width: 90vw;
  padding: 10px;
}

.send form {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.send form input {
  font-size: 16px;
  margin: 5px;
  padding: 5px;
  flex: 1
}


.send form button {
  font-size: 15px;
  margin: 5px;
  padding: 5px;
}
</style>