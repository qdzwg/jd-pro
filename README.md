# y

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

```
├── Readme.md       // help
├── bin/www         // 启动文件
|
├── router          // 路由
│── http            // 请求拦截器，接口地址
│── store           // vuex：登录，退出
|
├── assets          // 静态资源
│   ├── images      // 取名同views
│   ├── css         // 取名同views
│   ├── js          // 取名同views
├── components      // 页面
│   ├── plan        // 工作计划 首页
│   ├── account     // 导游报账
│   ├── manage      // 人事管理
│   ├── member      // 个人中心
│   ├── comm        // 通用组件模板
│   ├── index       // 首页
For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
