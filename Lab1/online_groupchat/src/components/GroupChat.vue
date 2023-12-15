<script setup>
import {ref, onMounted, watch} from 'vue'
import {useStore} from 'vuex'
import {useRouter} from "vue-router";

const store = useStore()
const router = useRouter()
const messageContent = ref('')

onMounted(async () => {
  await store.dispatch('checkSession');
  if (!store.getters.getOnline) {
    await router.push('/')
  } else {
    const date = new Date().toLocaleDateString();
    await store.dispatch('loadMessages', date);
    const messages = document.getElementsByClassName("messages")[0];
    messages.scrollTop = messages.scrollHeight;
  }
});

watch(
    () => store.getters.getMessageBuffer.length,
    async (length) => {
      const threshold = 1;
      if (length >= threshold) {
        await store.dispatch('saveMessages');
      }
    });

const handleSend = () => {
  const dateTime = new Date();
  let message = {
    username: store.getters.getUsername,
    date: dateTime.toLocaleDateString(),
    time: dateTime.toLocaleTimeString(),
    content: messageContent.value
  }
  store.commit('addMessage', message)
  messageContent.value = ''
  const messages = document.getElementsByClassName("messages")[0];
  messages.scrollTop = messages.scrollHeight;
}

const handleLogout = async () => {
  await store.dispatch('logout');
  await store.dispatch('saveMessages');
  await router.push('/');
}

</script>

<template>
  <div class="container">
    <div class="logout">
      <button type="button" @click="handleLogout">退出</button>
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

.logout button {
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

.send form {
  margin: 10px;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 90vw;
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