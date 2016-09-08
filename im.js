var userId=$("#userId").val();
var socket = null;  // 判断当前浏览器是否支持WebSocket
if ('WebSocket' in window) {    
       socket = new WebSocket("ws://localhost:8080/cyberhouse/api/LL_ws/"+userId);
} else {
	alert('该浏览器不支持本系统部分功能，请使用谷歌或火狐浏览器！');
}
layui.use('layim', function(layim){
  var autoReplay = [
    '您好，我现在有事不在，一会儿再和您联系。'
  ];
 layim.config({ 
    init: {
      url: 'api/friend/getInitList?userId='+userId
      ,data: {}
    }
    ,brief: false
    //查看群员接口
    ,members: {
       url: 'api/qun/getByGroupId'
      ,data: {}
    }
    ,uploadImage: {
       url: 'sns/uploadFile?userId='+userId 
      ,type: '' //默认post
    }
    ,uploadFile: {
       url: 'sns/uploadFile?userId='+userId 
      ,type: '' //默认post
    }
    ,min:true
    ,find:''  
    ,title: 'starc通讯'        //主面板最小化后显示的名称
    ,chatLog: 'api/friend/getHistoryMessageFromMongoPage'  //聊天记录地址
    ,copyright: true          //是否授权
    ,right: '30px' 
  });
 
	// 连接发生错误的回调方法
	socket.onerror = function() {
		console.log("连接失败!");
	};
	// 连接成功建立的回调方法
	socket.onopen = function(event) {
		console.log("链接成功!");
	}
	
	// 接收到消息的回调方法
	socket.onmessage = function(event) {
		console.log("收到消息啦:" +event.data);
		var obj=eval("("+event.data+")");
		layim.getMessage(obj);  
	}
	
	// 连接关闭的回调方法
	socket.onclose = function() {
		console.log("关闭连接！!");
	}
	// 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
	window.onbeforeunload = function() {
		socket.close();
	}  

    // 监听发送消息
    layim.on('sendMessage', function(data){
	   var obj={
			    "mine":{
				   "avatar":data.mine.avatar,             
				   "content":data.mine.content,          
				   "id":data.mine.id,        
				   "mine":true,                       
				   "username":data.mine.username      
				 },
				 "to":{
					   "avatar":data.to.avatar,
					   "id":data.to.id,
					   "name":data.to.groupname,
					   "sign":data.to.sign,
					   "type":data.to.type,       
					   "username":data.to.username
				 }
			   }
	    console.log(data);
		socket.send(JSON.stringify(obj));  	//发送消息倒Socket服务
   });
    
  //监听在线状态的切换事件
  layim.on('online', function(data){
    console.log(data);
  });
 
  //layim建立就绪
  layim.on('ready',function(res){
	  $(".fankui").click(function(){
		  var name=$(this).attr('data-name');
		  var logo=$(this).attr('data-logo');
		  var id=$(this).attr('data-id');
		  var sign=$(this).attr('data-sign');
		  fankui(name,id,logo,sign);
	  })
  });

  //监听查看群员
  layim.on('members', function(data){
    //console.log(data);
  });
  
  //监听聊天窗口的切换
  layim.on('chatChange', function(data){
    //console.log(data);
  }); 
  
  function fankui(name,id,logo,sign){
	  var iid=Number(id);
	  layim.chat({
		   sign:sign
		  ,name: name
		  ,type: 'fankui'  
		  ,avatar: logo 
		  ,id:iid  
		});
   }
  
});



