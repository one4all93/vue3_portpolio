import { createApp } from 'vue';
import '@/style.css';
import '@/assets/css/marker.css';
import App from '@/App.vue';
import { createPinia } from 'pinia';

createApp(App)
    .use(createPinia())
    .mount('#app');
