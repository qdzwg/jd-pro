/**
 * Created by cdt on 17/12/13
 */
import Vuex from 'vuex'
import Vue from 'vue'
import * as types from './types'

Vue.use(Vuex);

export default new Vuex.Store({
    state:{
        user:{
            guiderId:'',
            loginName:''
        },
        token: null,
        title: '',
    },
    mutations:{
        [types.LOGIN]:(state,data) => {
            console.log("vuex里的值：",state,data);
            state.token = data.sessionId;
            state.user.guiderId = data.guiderId;
            state.user.loginName = data.loginName;
            localStorage.setItem('token',data.sessionId);
            localStorage.setItem('loginName',data.loginName);
            localStorage.setItem('guiderId',data.guiderId);
        },
        [types.LOGOUT]:(state) => {
            localStorage.clear();
            state.token = null;
            state.user = {};
        },
        [types.TITLE]: (state, data) => {
            state.title = data;
        }
    }
})
