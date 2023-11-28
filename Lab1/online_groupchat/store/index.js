import {createStore} from 'vuex'

export default createStore({
    state: {
        username: '',
    },
    // setters
    mutations: {
        setUsername(state, username) {
            state.username = username
        }
    },
    getters:{
        getUsername(state){
            return state.username
        }
    },
    actions: {},
    modules: {}
})