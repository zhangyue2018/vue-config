import { createApp } from 'vue';
import App from './App';
import router from './router';
// 在创建之后，挂载之前，通过use安装、应用路由
createApp(App).use(router).mount(document.getElementById('app'));