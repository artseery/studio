import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createRouter, createWebHistory } from "vue-router"
import TestWordStress from './components/TestWordStress.vue'
import AdminWordStress from './components/AdminWordStress.vue'

const app = createApp(App)

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', redirect: '/admin'},
        { path: '/admin', component: AdminWordStress, name: 'admin' },
        { path: '/test', component: TestWordStress, name: 'test' }
    ]
})

app.use(router)

app.mount('#app')
