<script setup>
import {ref, onMounted} from 'vue'
import {useStore} from 'vuex'
import {useRouter} from "vue-router";

const store = useStore()
const messageContent = ref('')
const messages = store.getters.getMessageList

onMounted(()=>{
  if(!store.getters.getOnline){
    useRouter().push('/')
  }
})

const handleSend = () => {
  let message = {
    username: store.getters.getUsername,
    time: new Date().toLocaleString(),
    content: messageContent.value
  }
  store.commit('addMessage', message)
  messageContent.value = ''
}

</script>

<template>
  <div class="container">
    <div class="messages">
      <div class="message" v-for="message in messages" :key="message.id">
        <div class="message-header">
          <img src="/favicon.ico" alt="icon"/>
          <span class="username">{{ message.username }}</span>
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
  border-radius: 10px;
  background: #dcedf5;
}

.time {
  display: flex;
  align-items: center;
  padding: 5px 10px;
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