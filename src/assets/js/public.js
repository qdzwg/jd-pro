/* 
*	封装公共方法
**/
import { Toast} from 'mint-ui';

var common = {
    showToast:showToast    // tips
};

function showToast(msg,timer){
    let instance = Toast(msg);
    setTimeout(() => {
        instance.close();
    }, timer);
};


export default common;
