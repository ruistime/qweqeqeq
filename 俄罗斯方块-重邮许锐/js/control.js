window.onload = function(){
	// 配置项，可设置width，height来设置盘子大小
	var game_config = {
		width : 20,
		height : 20
	}
	
	// 初始化预览框
	function init(w,h){
		var td,tr;
		var gameTable = document.getElementById('game_table');
		for(var j=0;j<game_config.height;j++){
			tr = document.createElement('tr');
			gameTable.insertBefore(tr,gameTable.firstChild);
			for(var i =0;i<game_config.width;i++){
				td = document.createElement('td');
				tr.insertBefore(td,tr.firstChild);
			}
		}
	}
	init();
	// 表格对象，运动方块，下一个方块，定时器，难度选择等
var tbl = document.getElementById('game_table');
	var activeBlock;
	var nextBlock;
	var timer;
	var game_bar = document.getElementById('game_bar');
	game_bar.innerHTML = 0;
	var ChangeDifficult=document.getElementsByClassName('diffucult');
	
	// 砖块构造函数
	function generateBlock(blockType){
		var block = new Array(4);
		switch(blockType){
			//   田
			case 0:
				block[0] = {x:9,y:0};
				block[1] = {x:9,y:1};
				block[2] = {x:10,y:0};
				block[3] = {x:10,y:1};
				break;
			//    l  形状
			case 1:
				block[0] = {x:9,y:0};
				block[1] = {x:9,y:1};
				block[2] = {x:9,y:2};
				block[3] = {x:9,y:3};
				break;
			//   类似于【-！-】这个样子
			case 2:  
				block[0] = {x:9,y:0};
				block[1] = {x:10,y:0};
				block[2] = {x:10,y:1};
				block[3] = {x:11,y:1};
				break;
			// 类似于【-！-】与上面那个方向相反。
			case 3:
				block[0] = {x:10,y:0};
				block[1] = {x:11,y:0};
				block[2] = {x:9,y:1};
				block[3] = {x:10,y:1};
				break;
			// 土字上面那部分倒着写
			case 4:   
				block[0] = {x:9,y:0};
				block[1] = {x:10,y:0};
				block[2] = {x:11,y:0};
				block[3] = {x:10,y:1};
				break;
			// L     L形状
			case 5:  
				block[0] = {x:9,y:0};
				block[1] = {x:9,y:1};
				block[2] = {x:9,y:2};
				block[3] = {x:10,y:2};
				break;
			// L 反着写形状，
			default:     
				block[0] = {x:10,y:0};
				block[1] = {x:10,y:1};
				block[2] = {x:10,y:2};
				block[3] = {x:9,y:2};
				break;
		}
		return block;
	}

	// 绘制砖块
	function paintBlock(block){
		var x,y;
		for(var i=0;i<4;i++){
			x = block[i].x;
			y = block[i].y;
			tbl.rows[y].cells[x].style.background = 'black';
		}
	}
	//擦除图像
	function eraseBlock(block){
		var x,y;
		for(var i=0;i<4;i++){
			x = block[i].x;
			y = block[i].y;
			tbl.rows[y].cells[x].style.background = '';
		}
	}
	// 消除行
	function eraseRow(){
		var flag = true;
		var flagArray = [];
		var tempRow;
		for(var i=0;i<game_config.height;i++){
			for (var j=0;j<game_config.width;j++){
				if(tbl.rows[i].cells[j].style.background != 'black'){
					flag = false;
					break;
				}
			};
			if(flag){
				flagArray.push(i);
			}else{
				flag = true;
			}
		}
		for(var k=flagArray.length;k>=0;k--){
			// alert(flagArray[k]);
			if(flagArray[k]){
				tbl.deleteRow(flagArray[k]);
				game_bar.innerHTML = parseInt(game_bar.innerHTML)+100;
				
			}
			
		}
		for(var k=flagArray.length;k>=0;k--){
			if(flagArray[k]){
				
				tempRow = tbl.insertRow(0);
				
				for(var i=0;i<game_config.width;i++){
					tempRow.insertCell(0);
				}
			}
		}
	}
	// 向左移动
	function moveToLeft(){
		var tempBlock = copyBlock(activeBlock);
		for(var i=0; i<4; i++){
			if(tempBlock[i].x<1){
				return;
			}else{
				tempBlock[i].x-=1;
			}
		}
		// 检查碰撞
		if(!checkImpact(tempBlock)){
			eraseBlock(activeBlock);
			paintBlock(tempBlock);
			activeBlock = tempBlock;
		}
	}
	// 向右移动
	function moveToRight(){
		var tempBlock = copyBlock(activeBlock);
		for(var i=0; i<4; i++){

			if(tempBlock[i].x>=game_config.width){
				return;
			}else{
				tempBlock[i].x+=1;
			}
		}
		// 检查碰撞
		if(!checkImpact(tempBlock)){
			
			eraseBlock(activeBlock);
			paintBlock(tempBlock);
			activeBlock = tempBlock;
		}
	}
	//向下移动
	function moveToDown(){
		// 检查触底
		if(checkBottomBorder()){
			//尝试消行
			eraseRow();
			next();
		}

		var tempBlock = copyBlock(activeBlock);
		for(var i=0; i<4; i++){
			tempBlock[i].y+=1;
		}
		
		// 检查碰撞
		if(checkImpact(tempBlock)){
			eraseRow();
			next();
			return;
		}
		// 移动合法，重新绘制
		eraseBlock(activeBlock);
		paintBlock(tempBlock);
		activeBlock = tempBlock;
	

		

	}
	function change(){
		tempBlock = copyBlock(activeBlock);
		// 计算中心点
		var centerX = Math.round((activeBlock[0].x+activeBlock[1].x+activeBlock[2].x+activeBlock[3].x)/4);
		var centerY = Math.round((activeBlock[0].y+activeBlock[1].y+activeBlock[2].y+activeBlock[3].y)/4);
		
		// 绕中心逆时针旋转90度
		for(var i=0;i<4;i++){
			tempBlock[i].x = centerX+centerY-activeBlock[i].y;
			tempBlock[i].y = centerY-centerX+activeBlock[i].x;
		}
		
		if(!checkImpact(tempBlock)){
			eraseBlock(activeBlock);
			paintBlock(tempBlock);
			activeBlock = tempBlock;
		}

	}
	// 下一个
	function next(){
		// 检测游戏是否结束
		if (checkOver()) {
			clearInterval(timer);
			alert('您的得分是_'+game_bar.innerHTML+' ，请再接再厉');
			start.removeEventListener('click',star,false);
			comparescores();
			game_bar.innerHTML=0;
			
			return;
		};
		nextBlock = generateBlock(Math.round(Math.random()*100)%7);
		activeBlock = nextBlock;
		
		paintBlock(activeBlock);

	}
	// 检测结束
	function checkOver(){
		for(var i=0;i<game_config.width;i++){
			if(tbl.rows[0].cells[i].style.background == 'black') return true;
		}
		return false;
	}
	// 检查触底
	function checkBottomBorder(){
		for(var i=0;i<4;i++){
			if(activeBlock[i].y>=(game_config.height-1)) return true;
		}
		return false;
	}
	// 检查碰撞
	function checkImpact(block){
		var x,y;
		for(var i=0;i<4;i++){
			x = block[i].x;
			y = block[i].y;
			if(!checkPointIn(block[i])&& tbl.rows[y].cells[x].style.background==  'black' ){
				// console.log(tbl.rows[y].cells[x].style.background);
				return true;
			}
		}
		return false;
	}
	// 检查下一个将要移动到的砖块中的黑点是否在移动前砖块中
	function checkPointIn(point){
		for(var i=0;i<4;i++){
			if(activeBlock[i].x == point.x && activeBlock[i].y == point.y) return true;
		}
		return false;
	}
	
	// 拷贝一个blcok
	function copyBlock(old){  
        var o = new Array(4);
        //初始化  
    	for(var i=0; i<4; i++){    
            o[i] = {x:0, y:0};    
    	}  
    	//复制
    	for(var i=0; i<4; i++){    
        	o[i].x = old[i].x;    
            o[i].y = old[i].y;    
        }  
        return o;  
    }  

//比较每次结束后的分数并修改相应
    function comparescores(){
        var  scores=document.getElementsByClassName('scores');  
      
          for(var i=0;i<4;i++)

          	{   if(scores[i].innerHTML<game_bar.innerHTML)
          		scores[i+3].innerHTML=scores[i+2].innerHTML;
          		scores[i+2].innerHTML=scores[i+1].innerHTML;
          		scores[i+1].innerHTML=scores[i].innerHTML;
          		scores[i].innerHTML=game_bar.innerHTML;
          		


bb

        }
    }

    //重新启动
function restar(){
for(var i=0;i<game_config.height;i++){
			for (var j=0;j<game_config.width;j++){
				tbl.rows[i].cells[j].style.background = '';




}
}
clearInterval(timer);
game_bar.innerHTML=0;	
start.removeEventListener('click',star,false);

star();
		};






ChangeDifficult[0].onclick=function(){
	diffucult=700;
	for(var i=0;i<4;i++){
		ChangeDifficult[i].style.backgroundColor='';
	}
ChangeDifficult[0].style.backgroundColor="red"
}
	ChangeDifficult[1].onclick=function(){
	diffucult=500;
for(var i=0;i<4;i++){
		ChangeDifficult[i].style.backgroundColor='';
	}
ChangeDifficult[1].style.backgroundColor="red"}
	ChangeDifficult[2].onclick=function(){
	 diffucult=185;
for(var i=0;i<4;i++){
		ChangeDifficult[i].style.backgroundColor='';
	}
ChangeDifficult[2].style.backgroundColor="red"}
	ChangeDifficult[3].onclick=function(){
	diffucult=95;
for(var i=0;i<4;i++){
		ChangeDifficult[i].style.backgroundColor='';
	}
ChangeDifficult[3].style.backgroundColor="red"}

    // 测试区域
    
var diffucult=700;

	

	var start=document.getElementById('start');
	start.addEventListener('click',star,false);
var restart=document.getElementById('restart');
	restart.addEventListener('click',restar,false);

 function   star(){

 	activeBlock = generateBlock(Math.round(Math.random()*100)%7);
	nextBlock = generateBlock(Math.round(Math.random()*100)%7);
	paintBlock(activeBlock);
	timer = setInterval(function(){
		moveToDown();
	},diffucult);

}

	document.onkeydown = function(e){
		var keyMap = {
			right:39,
			left:37,
			down:40,
			change:38
		}
		var event = e || window.event;
		// alert(e.keyCode);
		switch(e.keyCode){
			case keyMap.left:
				moveToLeft();
				break;
			case keyMap.right:

				moveToRight();
				break;
			case keyMap.change:
				change();
				break;
			case keyMap.down:
				moveToDown();
				break;
		}
	}

}




