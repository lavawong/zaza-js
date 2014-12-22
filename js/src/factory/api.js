mask.factory('API', function(){
    return {
        ADD_MASK : 'http://yifei2.sinaapp.com//api/secret/add_mimi',
        
        ADD_USER : 'test-data/user_add.json',//'http://yifei2.sinaapp.com/api/user/add',

        GET_LIST :'http://yifei2.sinaapp.com/api/secret/getlist',

        ADD_SECRET_ATT : 'http://yifei2.sinaapp.com/api/attitude/add_secret_att',
        GET_CMT_LIST : 'http://yifei2.sinaapp.com/api/comment/getlist',

        ADD_CMT_ATT : 'http://yifei2.sinaapp.com/api/attitude/add_cmt_att',

        GET_MY_SECRET_LIST : 'http://yifei2.sinaapp.com/api/secret/get_my_secret_list',

        GET_MY_LIST : 'http://yifei2.sinaapp.com/api/comment/getMylist',

        ADD_CMT : 'http://yifei2.sinaapp.com/api/comment/add',

        GET_HOT_PLACE_LIST : 'test-data/hot-place-list.json',//http://yifei2.sinaapp.com/api/hotRecomment/get_hot_place_secret',

        GET_HOT_TOPIC_LIST : 'test-data/hot-topic-list.json',//'http://yifei2.sinaapp.com/api/hotRecomment/get_secret_list',

        GET_HOT_RECOMMENT : 'test-data/hotRecomment-list.json',//'http://yifei2.sinaapp.com/api/hotRecomment/getlist',

        UPDATE_NICK : 'test-data/update-nick.json',//'http://yifei2.sinaapp.com/api/user/update_nickname',

        ADD_SECRET_REPORT : 'http://yifei2.sinaapp.com/api/garbage/add_secret_report',
		
        DEL_SECRET: 'http://yifei2.sinaapp.com/api/secret/del',

        DEL_CMT : 'http://yifei2.sinaapp.com/api/comment/del',

        SEND_TOKEN: 'http://yifei2.sinaapp.com/api/user/add_token',

        MAP_URL : 'http://webapi.amap.com/maps?v=1.3&key=e8fe5b88f7eb073acccb31d0562023fa',

        SUDA_URL : 'http://hits.sinajs.cn/A2/b.html'
    }
});
