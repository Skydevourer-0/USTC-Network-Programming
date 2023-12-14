import {createStore} from 'vuex';
import axios from 'axios';

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
        async singUp(_, {username, password}) {
            await axios.post('/api/users/signup', {username, password})
                .then(res => {
                    if (res.status === 200) {
                        alert('注册成功');
                        return true;
                    } else if (res.status === 400) {
                        alert('用户名已存在');
                        return false;
                    } else {
                        alert('服务器出错，请联系工作人员');
                        return false;
                    }
                })
                .catch(err => {
                    console.error('Login error: ', err);
                })
        },
        async login({commit}, {username, password}) {
            await axios.post('/api/users/login', {username, password})
                .then(res => {
                    if (res.status === 200) {
                        commit('setLogin', username);
                        return true;
                    } else if (res.status === 400) {
                        alert('用户名或密码错误');
                        return false;
                    } else {
                        alert('服务器出错，请联系工作人员');
                        return false;
                    }
                })
                .catch(err => {
                    console.error('Login error: ', err);
                });
        },
        async loadMessages({commit}, date) {
            await axios.get('/api/messages/load-messages', date)
                .then(res => {
                    if (res.status === 200) {
                        commit('setMessageList', res.data);
                        return true;
                    } else {
                        alert('服务器出错，请联系工作人员');
                        return false;
                    }
                })
                .catch(err => {
                    console.error('Login error: ', err);
                });
        },
        async saveMessages({getters}) {
            const messages = getters.getMessageList;
            await axios.post('/api/messages/save-messages', messages)
                .then(res => {
                    if (res.status === 200) {
                        return true;
                    } else {
                        alert('服务器出错，请联系工作人员');
                        return false;
                    }
                })
                .catch(err => {
                    console.error('Login error: ', err);
                });
        }
    },
    modules: {}
})