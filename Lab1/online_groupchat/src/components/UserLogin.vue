<script setup>
import {ref} from 'vue'
import {useStore} from 'vuex'
import {useRouter} from "vue-router";

const username = ref('')
const password = ref('')
const store = useStore()
const router = useRouter()

const handleLogin = async () => {
  console.log(`Username: ${username.value}\nPassword: ${password.value}`)
  await store.dispatch('login', {
    username: username.value,
    password: password.value
  });
  const online = store.getters.getOnline;
  if (online) {
    console.log("登录成功")
    await router.push('/chat')
  } else {
    console.log("登录失败")
  }
}

const handleSignUp = async () => {
  console.log(`Username: ${username.value}\nPassword: ${password.value}`);
  await store.dispatch('singUp', {
    username: username.value,
    password: password.value
  });
}
</script>

<template>
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
</template>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 20px;
}

.login-container form {
  display: flex;
  flex-direction: column;
  padding: 10px;
}

.login-container form input {
  margin: 5px;
  padding: 5px;
  font-size: 14px;
}

.login-container form button {
  margin: 5px;
  font-size: 14px;
}
</style>