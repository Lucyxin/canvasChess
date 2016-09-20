var chessBoard=[];
var me=true;
var over=false;//表示此盘棋还未结束

//定义三维的赢法数组
var wins=[];
//人机赢法的一维统计数组
var myWin=[];
var computerWin=[];


for(var i=0;i<15;i++){
	chessBoard[i]=[];	
	for(var j=0;j<15;j++){
		chessBoard[i][j]=0;
		}
	}

for(var i=0;i<15;i++){
	wins[i]=[];
	for(var j=0;j<15;j++){
		wins[i][j]=[];
		}
	}

var count=0;//count代表所有赢法种类的所有
//所有横线的赢法
for(var i=0;i<15;i++){
	for(var j=0;j<11;j++){
		//wins[0][0][0]=true;
		//wins[0][1][0]=true;
		//wins[0][2][0]=true;
		//wins[0][3][0]=true;
		//wins[0][4][0]=true;
		
		//wins[0][1][1]=true;
		//wins[0][2][1]=true;
		//wins[0][3][1]=true;
		//wins[0][4][1]=true;
		//wins[0][5][1]=true;

		for(var k=0;k<5;k++){
			wins[i][j+k][count]=true;
			}
		count++;
		}
	
	}
//所有竖线的赢法
for(var i=0;i<15;i++){
	for(var j=0;j<11;j++){
		for(var k=0;k<5;k++){
			wins[j+k][i][count]=true;
			}
		count++;
		}
	
	}
//所有斜线的赢法
for(var i=0;i<11;i++){
	for(var j=0;j<11;j++){
		for(var k=0;k<5;k++){
			wins[i+k][j+k][count]=true;
			}
		count++;
		}
	
	}

//所有反斜线的赢法
for(var i=0;i<11;i++){
	for(var j=14;j>3;j--){
		for(var k=0;k<5;k++){
			wins[i+k][j-k][count]=true;
			}
		count++;
		}
	
	}

for(var i=0;i<count;i++){
	myWin[i]=0;
	computerWin[i]=0;
	
	}



var chess=document.getElementById('chess');
var context=chess.getContext('2d');

var logo=new Image();

var watermarkCanvas=document.getElementById('watermark-canvas');
var watermarkContext=watermarkCanvas.getContext('2d');

logo.src="image/logo.jpg";
logo.onload=function(){//回调函先加载图片，然后画线
	context.drawImage(logo,0,0,450,450);
	drawChessBoard();
    context.drawImage(watermarkCanvas,
                      chess.width-watermarkCanvas.width,chess.height-watermarkCanvas.height);
		}
//设置水印
watermarkCanvas.width=180;
watermarkCanvas.height=80;

watermarkContext.font='bold 30px Arial';
watermarkContext.fillStyle='rgba(0,0,0,0.5)';
watermarkContext.textBaseline='middle';
watermarkContext.fillText('Lucyxin',65,65);

var drawChessBoard=function(){
	for(var i=0;i<15;i++){
	//划横线
	context.moveTo(15+i*30,15);
	context.lineTo(15+i*30,435);
	context.stroke();
	//画竖线
	context.moveTo(15,15+i*30);
	context.lineTo(435,15+i*30);
	context.stroke();
	
	}

}
var oneStep=function(i,j,me){
	//画圆
	context.beginPath();
	context.arc(15+i*30,15+j*30,13,0,2*Math.PI);
	context.closePath();
	//返回渐变对象
	var gradient=context.createRadialGradient(15+i*30+2,15+j*30-2,13,15+i*30+2,15+j*30-2,0);
	//设置渐变颜色,0,1分别代表第一和第二个圆的位置
	if(me){
	gradient.addColorStop(0,"#0A0A0A");
	gradient.addColorStop(1,"#636766");
	}else{
	gradient.addColorStop(0,"#D1D1D1");
	gradient.addColorStop(1,"#F9F9F9");
		}
	context.fillStyle=gradient;
	context.fill();
	}
//鼠标点击事件
chess.onclick=function(e){
	if(over){
		return;
	}
	if(!me){
		return;
		}
	var x=e.offsetX;
	var y=e.offsetY;
	var i=Math.floor(x/30);
	var j=Math.floor(y/30);
	if(chessBoard[i][j]==0){
	oneStep(i,j,me);	
	chessBoard[i][j]=1;
	//在我方落子前对赢法数组进行更新
	for(var k=0;k<count;k++){
		if(wins[i][j][k]){//若第k中赢法在（i,j）位置已经落下黑子，则白子不可能赢，me向赢法更近了一步
			myWin[k]++;
			computerWin[k]=6;//6表示不可能再赢
			//如果存在一个k,使得myWin[k]==5，说明第k种赢法被实现（若此赢法的五颗子均已被黑子占领，则此赢法被实现）
			if(myWin[k]==5){
				window.alert("你赢了");
				over=true;
				}
			}
		}
	if(!over){
		me=!me;
		computerAI();
		}
	}
}

var computerAI=function(){
	var myScore=[];
	var computerScore=[];
	var max=0;//最高分数
	var u=0,v=0;//最高分数的坐标
	for(var i=0;i<15;i++){
		myScore[i]=[];
		computerScore[i]=[];
		for(var j=0;j<15;j++){
			myScore[i][j]=0;
			computerScore[i][j]=0;	
			}
		}
	//遍历整个棋盘
	for(var i=0;i<15;i++){
		for(var j=0;j<15;j++){
			if(chessBoard[i][j]==0){
				//若（i,j）位置为空，则遍历所有赢法,进行分数计算;若（i,j）点出现在多种赢法上，那么分数会累加
				for(var k=0;k<count;k++){
					//若第k种赢法在（i,j）位置为true,则在此点落子有价值(实现计算机拦截)
					if(wins[i][j][k]){
						if(myWin[k]==1){//第k种赢法黑棋已经实现一颗子,则在（i,j）位置进行下子可进行有效的拦截
						myScore[i][j]+=200;
						}else if(myWin[k]==2){
						myScore[i][j]+=400;
						}else if(myWin[k]==3){
						myScore[i][j]+=2000;
						}else if(myWin[k]==4){
						myScore[i][j]+=10000;
							}
						//计算机本身
						if(computerWin[k]==1){//白棋在第k种赢法上已经连上一颗子
						computerScore[i][j]+=220;
						}else if(computerWin[k]==2){
						computerScore[i][j]+=420;
						}else if(computerWin[k]==3){
						computerScore[i][j]+=2100;
						}else if(computerWin[k]==4){
						computerScore[i][j]+=20000;
							}
						}
					}
					//myScore里分数最高的点
					if(myScore[i][j]>max){
						max=myScore[i][j];
						u=i;
						v=j;
					}else if(myScore[i][j]==max){
						if(computerScore[i][j]>computerScore[u][v]){
							u=i;
							v=j;
							}
					}
					//computerScore里分数最高的点
					if(computerScore[i][j]>max){
						max=computerScore[i][j];
						u=i;
						v=j;
					}else if(computerScore[i][j]==max){
						if(myScore[i][j]>myScore[u][v]){
							u=i;
							v=j;
							}
					}
				}
			
			}
		}
		oneStep(u,v,false);
		chessBoard[u][v]=2;//计算机在（u,v）落子，然后去更新赢法的统计数组
		//在我方落子前对赢法数组进行更新
		for(var k=0;k<count;k++){
			if(wins[u][v][k]){//若第k中赢法在（u,v）位置已经落下白子，则黑子不可能赢,计算机向赢法更近了一步
				computerWin[k]++;
				myWin[k]=6;//6表示不可能再赢
				//如果存在一个k,使得computerWin[k]==5，说明第k种赢法被实现（若此赢法的五颗子均已被黑子占领，则此赢法被实现）
				if(computerWin[k]==5){
					window.alert("计算机赢了");
					over=true;
					}
				}
			}
		//如果此盘棋还未结束，就将下棋的权利进行反转
		if(!over){
			me=!me;
			
			}
	}




