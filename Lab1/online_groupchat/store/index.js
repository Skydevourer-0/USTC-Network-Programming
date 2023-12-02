import {createStore} from 'vuex'

export default createStore({
    state: {
        online: false,
        username: '',
        messageList: [],
    },
    mutations: {
        setLogin(state, username) {
            state.online = true
            state.username = username
        },
        setMessageList(state, messageList) {
            state.messageList = messageList
        },
        addMessage(state, message) {
            state.messageList.push(message)
        }
    },
    getters: {
        getOnline(state) {
            return state.online
        },
        getUsername(state) {
            return state.username
        },
        getMessageList(state) {
            return state.messageList
        }
    },
    actions: {
        login({commit}, {username, password}) {
            return fetch('/userList.json')
                .then(response => response.json())
                .then(userList => {
                    let exists = userList.some(user => user.username === username && user.password === password)
                    if (exists) {
                        commit('setLogin', username)
                        return true
                    } else {
                        alert("用户名或密码错误")
                        return false
                    }
                })
                .catch(err=>{
                    console.log(err)
                    return false
                })
        },
    },
    modules: {}
})