import {createStore} from 'vuex';
import axios from 'axios';

export default createStore({
    state: {
        online: false,
        username: '',
        messageList: [],
        dates: []
    },
    mutations: {
        setLogin(state, username) {
            state.online = true
            state.username = username
        },
        setLogout(state) {
            state.online = false
            state.username = ''
        },
        setMessageList(state, messageList) {
            state.messageList = messageList
        },
        addMessage(state, message) {
            state.messageList.push(message);
        },
        setDates(state, dates) {
            state.dates = dates;
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
        },
        getDates(state) {
            return state.dates;
        }
    },
    actions: {
        async singUp(_, {username, password}) {
            await axios.post('http://localhost:3000/api/users/signup', {username, password})
                .then(res => {
                    console.log(res);
                    if (res.status === 200) {
                        alert('注册成功');
                    }
                })
                .catch(err => {
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
            await axios.post('http://localhost:3000/api/messages/save-messages', {message})
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
        },
    },
    modules: {}
})