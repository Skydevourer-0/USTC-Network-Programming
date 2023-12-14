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
  const online = await store.dispatch('login', {
    username: username.value,
    password: password.value
  })
  if (online) {
    console.log("登录成功")
    await router.push('/chat')
  } else {
    console.log("登录失败")
  }
}

const handleSignUp = async () => {
  console.log(`Username: ${username.value}\nPassword: ${password.value}`);
  const success = await store.dispatch('singUp', {
    username: username.value,
    password: password.value
  });
  if (success) {
    alert("注册成功");
  } else {
    alert("注册失败");
  }
}
</script>

<template>
  <div class="login-container">
    <img src="/logo.png" alt="Logo" class="logo"/>
    <h2>登录</h2>
    <form @submit.prevent="handleLogin">
      <input type="text" v-model="username" placeholder="Username" required/>
      <input type="password" v-model="password" placeholder="Password" required/>
      <button type="submit">登录</button>
      <button type="button" @click="handleSignUp">注册</button>
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