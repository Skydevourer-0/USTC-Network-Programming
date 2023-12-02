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
