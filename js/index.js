var app=angular.module("weixinyuyue",["ng","ngRoute"]);
app.config(function ($routeProvider) {
    $routeProvider
        .when('/start', {templateUrl: 'tpl/start.html',controller:'startCtrl'})
        .when('/order/:did', {templateUrl: 'tpl/order.html',controller:'orderCtrl'})
        .when('/myorder/:did', {templateUrl: 'tpl/myorder.html',controller:'myorderCtrl'})
        .when('/ordersuccess', {templateUrl:'tpl/ordersuccess.html',controller:'ordersuccessCtrl'})
        .when('/detail/:did', {templateUrl: 'tpl/detail.html',controller:'detailCtrl'})
        .when('/orderdetail/:did', {templateUrl: 'tpl/orderdetail.html',controller:'orderdetailCtrl'})
//      .when('/orderdetail/:did', {templateUrl: 'tpl/orderdetail.html',controller:'orderdetailCtrl'})
        .otherwise({redirectTo: '/start'})
});
app.controller('parentCtrl', function ($scope,$location) {
	$scope.addActive=function(){
		sessionStorage.setItem("idx","footbtn2")
	}
		$("body").css("height",$(window).height()-50+"px");
    $scope.jump = function (path) {
        $location.path(path);
    }
    
    $scope.uRl="http://123.123.123.17:8090/appserver.aspx";
   
});
//首页
app.controller('startCtrl', function ($scope,$http,$timeout) {
	$("body .ng-scope>.container").css("height",$("body").height()+"px");
	$scope.loadingShow=true;
	$scope.startActive=function(){
		$scope.addActive();
	}
	var srcollTop=$("body .ng-scope>.container").scrollTop();
	var scrollHeight=$("body .ng-scope>.container").height();
	var bodyHeight=$("body").height();
	$scope.loadMore=false;
	if(srcollTop+bodyHeight>=scrollHeight){
		$scope.loadMore=true;
		$scope.t=$timeout(function(){$scope.loadMore=false}, 2000);
	}
	$scope.getAll=function(){
		$http.get($scope.uRl+"?method=getAllYyt")
        .success(function (data) {
         	var list=data.data;
         	$scope.wdList=JSON.parse(list).paster_list;
         	$scope.loadingShow=false;
  		 });
	}
	 $scope.getAll();
 	$scope.$watch('cxwd', function () {
        if($scope.cxwd)
        {
        	$scope.loadingShow=true;
	       $http.get($scope.uRl+"?method=getAllYytByName&yytName="+$scope.cxwd)
	        .success(function (data) {
	        	if(data.data){
	        		var list=data.data;
	         		$scope.wdList=JSON.parse(list).paster_list;
	        	}else{
	        		$scope.wdList="";
	        	}
	        	$scope.loadingShow=false;
	         	
	  		 });
        }else{
        	$scope.getAll();
        }
    });
});

//网点详情
app.controller('detailCtrl', function ($scope,$http,$routeParams) {
$("body .ng-scope>.container").css("height",$("body").height()+"px");
    	$("#detail_container .panel-body ul.xqxinxi span.xqcontent").css("width",$("#detail_container .panel-body ul.xqxinxi li").width()-$("#detail_container .panel-body ul.xqxinxi span.xqcontent").prev().width()-5+"px");
    	$scope.loadingShow=true;
    	$scope.detailActive=function(code){
    		sessionStorage.setItem("orderCode",code);
    		$scope.addActive();
    	}
     $http.get($scope.uRl+"?method=getYytByID&yytID="+$routeParams.did)
        .success(function (data) {
         	$scope.wdList=JSON.parse(data.data);
         
        });
    $http.get($scope.uRl+"?method=getQueuesAndWaitByyytID&yytID="+$routeParams.did)
        	.success(function (data) {
            	$scope.detailList=JSON.parse(data.data);
            	$scope.loadingShow=false;
       	 });
    	
//  $scope.hasMore = true;
//  $http.get('data/dish_getbypage.php?start=0')
//      .success(function (data) {
//          //console.log(data);
//          $scope.dishList = data;
  });
//预约取号
app.controller('orderCtrl', function ($scope,$http,$routeParams,$location) {
$("body .ng-scope>.container").css("height",$("body").height()+"px");
	$("#order-wangd>div.wangDsel").css("marginTop",($(window).height()-50>$("#order-wangd>div").height()?($(window).height()-50-$("#order-wangd>div").height())/2:10)+"px");
	$("form input,form select").css("width",$("form .form-group").width()-$("form input,form select").prev().width()-20+"px");
	
//		获取所有网点列表
		 $http.get($scope.uRl+"?method=getAllYyt")
        .success(function (data) {
         	var list=data.data;
         	var wdList=JSON.parse(list).paster_list;
         	var wdfrag=document.createDocumentFragment();
         	for(var i=0;i<wdList.length;i++){
         		$(wdfrag).append("<option value='"+wdList[i].ID+"'>"+wdList[i].name+"</option>")
         	}
         		$("#selWd").append(wdfrag).val($routeParams.did);
         	
  		 });
  		 
//		 获取业务列表
  		 $scope.selYWfcn=function(ywSel,morenYw){
   	  		 $http.get($scope.uRl+"?method=getQueuesByyytID&yytID="+ywSel)
			        .success(function (data) {
			         	var list=data.data;
			         	var ywList=JSON.parse(list);
			         	var ywfrag=document.createDocumentFragment();
			         	for(var i=0;i<ywList.length;i++){
			         		$(ywfrag).append("<option value='"+ywList[i].code+"'>"+ywList[i].name+"</option>")
			         	}
			         	$("#selYW option").slice(1).remove();
			         	$("#selYW").append(ywfrag);
			         	if(morenYw){
			         		$("#selYW").val(morenYw);
			         		sessionStorage.removeItem("orderCode");
			         		$scope.selTY();
			         	}
			         
			  		 });
  		 }
  		if($routeParams.did){
 				var ywSel=$routeParams.did;
 				if(sessionStorage.getItem("orderCode")){
	 				var moren=sessionStorage.getItem("orderCode");
	 				$scope.selYWfcn(ywSel,moren);
 				}else{
 					$scope.selYWfcn(ywSel,0);
 				}
  		 	 		
  		 }
//		 时间或业务变化,剩余票数变化
  		$scope.selTY=function(){
		 	 	if($("#selYW").val()&&$("#selTime").val()){
		 	 			
	$http.get($scope.uRl+"?method=getNumByQueueCodeAndDate&yytID="+ywSel+"&queuecode="+$("#selYW").val()+"&orderdate="+$("#selTime").val()).success(function(data){
		 			$scope.shengyu=data.data;
		 	});		
		 		
			}
		 }
//		 监听网点变换
		$scope.$watch("selWD",function(){
			if($("#selWd").val()){
  		 		ywSel=$("#selWd").val();
				$scope.selYWfcn(ywSel);
			}else{
			}
			$scope.shengyu="0";
		})
//		监听业务变化
  		 $scope.$watch("selYw",function(){
  		 	if($scope.selYw){
   		 		$scope.selTY(); 		 		
  		 	}
		 });
		 if($("#selTime").val()){
		 	$scope.selTY();
		 }
//		 默认时间为今天
  	$scope.mindata=	new Date().getFullYear()+"-"+((new Date().getMonth()+1)>=10?(new Date().getMonth()+1):"0"+(new Date().getMonth()+1))+"-"+(new Date().getDate()>=10?(new Date().getDate()):("0"+(new Date().getDate())));
  		   	
  	$("#selTime").val($scope.mindata);
//		 监听时间变化
		$("#selTime").on("input",function(){
			if($("#selTime").val()){
				if((new Date($("#selTime").val().replace(/-/g,'/')).getTime())>=(new Date(new Date().toLocaleDateString()).getTime())){
					$scope.selTY();
				}else{
					window.alert("预约日期须为今日及以后日期！");
					$("#selTime").val($scope.mindata);
				}
			}else{
				alert("预约日期不能为空！");
			}
		});
//	电话号码失去焦点后判断手机号是否正确
	$scope.texttel=function(){
		if(!(/^1[34578]\d{9}$/.test($("#tel").val()))){
			$scope.telOk=false;
			$scope.aLer=false;
			window.alert("手机号码输入有误，请重新输入");
			setTimeout(function(){$scope.aLer=true;},1000);
		}else{
			$scope.telOk=true;
		}
		$scope.telsign=!$scope.telOk;
	}
	$scope.aLer=true;
//	检验身份证是否正确 

	$scope.textid=function(){
		if(!(/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|[xX])$/.test($("#uId").val()))){
			$scope.idOk=false;
			$scope.aLer=false;
    		window.alert("输入信息有误，请重新输入！");
    		setTimeout(function(){$scope.aLer=true;},1000);
		}else{
			$scope.idOk=true;
		}
		$scope.idsign=!$scope.idOk;
	}

$("#mymodal button").click(function(){
	$("#mymodal").hide();
});

//预约
$("#orderCLick").click(function(){
	if($("#selWd").val()&&$("#selYW").val()&&$("#selTime").val()&&($("span.sy-num").html()!="0")&&($scope.telOk==true)&&($scope.idOk==true)){
		postMsg();
	}else{
		if($scope.aLer){
			if(!($("#selWd").val())){
				alert("营业厅不能为空，请选择营业厅！");
			}else if(!($("#selYW").val())){
				alert("业务不能为空，请选择所要办理的业务！");
			}else if(!($("#selTime").val())){
				alert("办理时间不能为空，请选择要办理业务的时间！");
			}else if(!($scope.telOk==true)){
				if($("#tel").val()){
					alert("手机号码不能为空！");
				}else{
					alert("手机号码输入有误，请重新输入！");
				}
			}else if(!($scope.idOk==true)){
				if($("#uId").val()){
					alert("身份证号码不能为空！");
				}else{
					alert("身份证号码输入有误，请重新输入！");
				}
			}
		}
		
	}
	
});
//	点击预约传输数据
var postMsg=function(){
		$scope.send=[ywSel,$scope.selYw];
		$.ajax({
			type:"post",
			url:$scope.uRl+"?method=orderQueue&yytID="+ywSel+"&IDno="+$("#uId").val()+"&queuecode="+$("#selYW").val()+"&orderdate="+$("#selTime").val()+"&phone="+$scope.tel,
			success:function(data){
			$scope.codeNum=JSON.parse(data).code;
				if(JSON.parse(data).code==1){
			 		$scope.send.push(JSON.parse(JSON.parse(data).data).ordernum);
			 		sessionStorage.removeItem("sendparam");
			 		sessionStorage.setItem("sendparam",$scope.send);
			 		sessionStorage.removeItem("userPhone");
	    			sessionStorage.setItem("userPhone",$scope.tel);
	    			sessionStorage.removeItem("userID");
	    			sessionStorage.setItem("userID",$("#uId").val());
			 		$location.path('/ordersuccess');
			 		$scope.$apply();
			 		
				}else{
					$scope.missMsg=JSON.parse(data).msg;
						$("#missMsg").html($scope.missMsg);
						$("#mymodal").show();
				}
			}
			
		});
}

//重置
$("#logIn .resetbtn").click(function(e){
	e.preventDefault();
	$("#order-wangd form input,#order-wangd form select").val("");
	$("#order-wangd form .sy-num").html("0");
});

	$scope.timeOk=false;
	$scope.timesign=false;

	
    });
//预约成功
app.controller('ordersuccessCtrl', function ($scope,$http,$routeParams) {
$("body .ng-scope>.container").css("height",$("body").height()+"px");
$scope.loadingShow=true;
$scope.addActive2=function(){
    		sessionStorage.setItem("idx","footbtn3");
    }
		$scope.getsend=sessionStorage.getItem("sendparam").split(",");
		$scope.wd=$scope.getsend[0];
		$scope.yw=$scope.getsend[1];
		$http.get($scope.uRl+"?method=getYytByID&yytID="+$scope.wd)
        .success(function (data) {
         	$scope.wdList=JSON.parse(data.data);
         	$scope.ornum=$scope.getsend[2];
         	$http.get($scope.uRl+"?method=getQueuesAndWaitByyytID&yytID="+$scope.wd)
        	.success(function (data) {
            	$scope.detailList=JSON.parse(data.data);
            	$scope.loadingShow=false;
       	 });
        });
    	
		
});
//我的预约
app.controller('myorderCtrl', function ($scope,$http,$routeParams) {
$("body .ng-scope>.container").css("height",$("body").height()+"px");
    	$scope.solution=function(ordersol){
    		sessionStorage.setItem("ordersol",ordersol);
    	}
    	
    	
    	$scope.handel=function(num){
    		$scope.loadingShow=true;
    		$http.get($scope.uRl+"?method=getOrder&idno="+sessionStorage.getItem("userID")+"&phone="+sessionStorage.getItem("userPhone")+"&isqueue="+num)
        	.success(function (data) {
            	$scope.orderList=JSON.parse(data.data);
            	$scope.loadingShow=false;
       	 });
    	}
    	
    	
    	//	点击确定判断手机号和身份证是否正确
if($routeParams.did=="3"){
	$scope.logIn=true;
    	$scope.logInBtn=function(){
    		if((/^1[34578]\d{9}$/.test($scope.searchphone))&&(/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|[xX])$/.test($("#searchid").val()))){
    			sessionStorage.removeItem("userPhone");
    			sessionStorage.setItem("userPhone",$scope.searchphone);
    			sessionStorage.removeItem("userID");
    			sessionStorage.setItem("userID",$("#searchid").val());
   				$scope.handel(0);
    			$scope.logIn=false;
    		}else{
    			alert("输入信息有误，请重新输入！");
    			
    		}
    		
    	}
}else if($routeParams.did=="2"){
	$scope.logIn=false;
   	$scope.handel(0);
}else{
	$scope.logIn=false;
	$scope.num=$routeParams.did;
	if($scope.num==0){
		$scope.handel($scope.num);
	}else{
		$("#orderChange li.active").removeClass("active");
		$("#orderChange li:last-child").addClass("active");
		$scope.handel($scope.num);
	}
	
}
    	

    	$("#orderChange li").click(function(){
    		if(!($(this).hasClass("active"))){
    			$("#orderChange li.active").removeClass("active");
    			$(this).addClass("active");
    		}
    	}
    		
    	);
//  $scope.hasMore = true;
//  $http.get('data/dish_getbypage.php?start=0')
//      .success(function (data) {
//          //console.log(data);
//          $scope.dishList = data;
    });
    
//  我的预约详情
     app.controller('orderdetailCtrl', function ($scope,$http,$routeParams) {
$("body .ng-scope>.container").css("height",$("body").height()+"px");
    	$("#_orderDetail ul.list-group li.list-group-item span.myorder_content").css("width",$("#_orderDetail ul.list-group li.list-group-item").width()-$("#_orderDetail ul.list-group li.list-group-item span.myorder_content").prev().width()+"px");
    	$scope.orDetail=JSON.parse($routeParams.did);   	
    	$scope.back=function(){
    	$scope.morenSol=sessionStorage.getItem("ordersol");
    	}
    });
    

  app.controller('footerCtrl', function ($scope,$http) {
$("body .ng-scope>.container").css("height",$("body").height()+"px");
  	if(!(sessionStorage.getItem("idx"))){
  		sessionStorage.setItem("idx","footbtn1");
  	}  	
   	$("#footbtn").on("click","li",function(){
   		if(!($(this).children("a").hasClass("active"))){
   			var idx=$(this).attr("id");
   			sessionStorage.setItem("idx",idx);
   		}
   	});
   		$("#footbtn li a.active").removeClass("active");
   		$("#"+sessionStorage.getItem("idx")).children("a").addClass("active");
   		$scope.initDid=0;
});
