import { createApp } from 'vue';
import App from './App';
import router from './router';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
// 在创建之后，挂载之前，通过use安装、应用路由
createApp(App).use(router).use(ElementPlus).mount(document.getElementById('app'));