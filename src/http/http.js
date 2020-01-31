/**
 * Created by cdt on 17/12/13
 * http配置
 */
import axios from 'axios'
import store from '@/store/store'
import * as types from '@/store/types'
import router from '@/router/index'
import { Indicator,MessageBox } from 'mint-ui';
import cookie from '../assets/js/cookie.js'

axios.defaults.timeout = 20000; // 超时10s

// http request 拦截器
axios.interceptors.request.use(
    config => {
        Indicator.open();
        config.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
        config.headers['Access-Control-Allow-Credentials'] = true;
        if(store.state.token){
            config.headers['access-token'] = `${store.state.token}`;
        }
        //console.log("请求头部:",config.headers);
        return config;
    },
    err => {
        Indicator.close();
        return Promise.reject(err);
    });

// http response 拦截器
axios.interceptors.response.use(
    response => {
        let code = response.data.code || '';
        if(code == 401){
            MessageBox.alert('请求超时,请重新登录').then(() => {
                Indicator.close();
                cookie.clearAllCookie();
                store.commit(types.LOGOUT);
                router.replace({
                    path: '/login',
                    query: {redirect:router.currentRoute.fullPath, loginFail: true}
                });
            });
        }
        else if(code == 500){
            MessageBox.alert('session失效,请重新登录').then(() => {
                Indicator.close();
                cookie.clearAllCookie();
                store.commit(types.LOGOUT);
                router.replace({
                    path: '/login',
                    query: {redirect:router.currentRoute.fullPath, loginFail: true}
                });
            });
        }
        Indicator.close();
        return response;
    },
    error => {

        Indicator.close();
        MessageBox('提示', error);
        return Promise.reject(error);
    }
);

export default axios;
