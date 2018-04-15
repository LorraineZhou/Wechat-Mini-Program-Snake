//snake.js
var app = getApp();

Page({
   data:{
        userInfo: {},
        message_snake:"snake",
        message_count:0,
        message_lenth:5,
        score: 0,//比分
        stepadd:5,
        maxscore: 0,//最高分
        startx: 0,
        starty: 0,
        endx:0,
        endy:0,//以上四个做方向判断来用
        ground:[],//操场,二维数组
        rows:40,
        cols:32,//操场大小
        snake:[],//蛇所在点集合
        food:[],//存食物
        direction:'',//方向
        modalHidden: true,
        start_flag:0,//0 为未开始 1为开始游戏
        timer:'',
        //  https://www.seanxu.club/snake?operation=update&name=1678&score=57
        //  https://www.seanxu.club/snake?operation=select&name=1678
        url_select: 'https://www.seanxu.club/snake?operation=select&name=',
        url_update: 'https://www.seanxu.club/snake?operation=update&name=',
   } ,

   onLoad:function(){
        
     var that = this
     //调用应用实例的方法获取全局数据  
     app.getUserInfo(function (userInfo) {
       //更新数据  
       that.setData({
         userInfo: userInfo
       })
     }) 
     setTimeout(function () {
       that.setData({
         maxscore: app.globalData.maxscore,
       });
       console.log(that.data.maxscore);     
     }, 3000)
        this.initGround(this.data.rows,this.data.cols);//初始化操场
        this.initSnake(10);//初始化蛇
        this.initwall(1);//初始化噪点
        //this.creatFood();//初始化食物
        this.move();//蛇移动   
   },

  //操场
    initGround:function(rows,cols){
        for(var i=0;i<rows;i++){
            var arr=[];
            this.data.ground.push(arr);
            for(var j=0;j<cols;j++){
                this.data.ground[i].push(0);
            }
        }
    },

   //蛇
   initSnake:function(len){
       for(var i=0;i<len;i++){
           if(i==(len-1))
           {
             this.data.ground[0][i] = 3;
           }
           else
           {
             this.data.ground[0][i] = 1;
           }
           
           this.data.snake.push([0,i]);
       }
   },

   //噪点
   initwall: function (len) {
     var ground = this.data.ground;
     for(var i=0;i<len;i++)
     {
       var x = Math.floor(Math.random() * this.data.rows);
       var y = Math.floor(Math.random() * this.data.cols);

       if (ground[x][y] == 0) {
         ground[x][y] = 4;
       }
       else {
         this.initwall();
       }
     } 
     this.setData({
       ground: ground,
     });
   },

   //设定食物
   creatFood: function () {
     var x = Math.floor(Math.random() * this.data.rows);
     var y = Math.floor(Math.random() * this.data.cols);

     var ground = this.data.ground;
     if (ground[x][y] == 0) {
       ground[x][y] = 2;
       this.setData({
         ground: ground,
         food: [x, y]
       });
     }
     else {
       this.creatFood();
     }

   },

   //计分器
   storeScore: function () {

     if (this.data.maxscore < this.data.score) {
       this.setData({
         maxscore: this.data.score
       })
       wx.request({
         // 请求服务器 url
         //https://www.seanxu.club/snake?operation=update&name=1678&score=57
         url: this.data.url_update + app.globalData.openid + '&score=' + this.data.maxscore,
         //url: this.data.url_update + '1678' + '&score=' + this.data.maxscore,
         method: 'GET',
         //请求成功
         success: (res) => {
           // 返回状态码 200
           console.log(res.data);
           if (+res.statusCode == 200) {
            //  wx.showToast({
            //    title: '同步成功',
            //    icon: 'success',
            //    duration: 2000
            //  })
           } else {
            //  wx.showToast({
            //    title: '同步失败',
            //    icon: 'success',
            //    duration: 2000
            //  })
           }
         },
         fail: (res) => {
           console.log("fail");
           console.log(res.errMsg);
         },
       });
       //wx.request
     }
   },

   //移动函数
   move:function(){
       var that=this;  

       this.data.timer=setInterval(function(){
         that.changeDirection(that.data.direction);                
         that.setData({               
              ground:that.data.ground,              
         });  

       },300);
   },

   speedup: function () {
     var that = this;
     clearInterval(this.data.timer);
     this.data.timer = setInterval(function () {
       that.changeDirection(that.data.direction);
       that.setData({
         ground: that.data.ground,
       });
     }, 80);
   },

   speedlow: function () {
     var that = this;
     clearInterval(this.data.timer);
     this.data.timer = setInterval(function () {
       that.changeDirection(that.data.direction);
       that.setData({
         ground: that.data.ground,
       });
     }, 300);
   },

    btntop:function(){
      if (this.data.direction == 'bottom'){ return; }
      this.setData({
        direction: "top",
        start_flag:1,
      })
    },

    btnbottom: function () {
      if (this.data.direction == 'top') { return; }
      this.setData({
        direction: "bottom",
        start_flag: 1,
      })
    },

    btnright: function () {
      if (this.data.direction == 'left') { return; }
      this.setData({
        direction: "right",
        start_flag: 1,
      })
    },

    btnleft: function () {
      if (this.data.direction == 'right') { return; }
      this.setData({
        direction: "left",
        start_flag: 1,
      })
    },  

    changeDirection:function(dir){
        switch(dir){
        case 'left':
            return this.changeLeft();
            break;
        case 'right':
            return this.changeRight();
            break;
        case 'top':
            return this.changeTop();
            break;
        case 'bottom':
            return this.changeBottom();
            break;
        default:
        }
    },

    changeLeft:function(){
        
        var arr=this.data.snake;
        var len=this.data.snake.length;
        var snakeHEAD=arr[len-1];
        var snakeTAIL=arr[0];
        var ground=this.data.ground;
        ground[snakeTAIL[0]][snakeTAIL[1]]=0;  
        for(var i=0;i<len-1;i++){
                arr[i]=arr[i+1];   
        };

        var x=arr[len-1][0];
        var y=arr[len-1][1]-1;
        arr[len-1]=[x,y];
        this.checkGame(snakeTAIL);
        for(var i=1;i<len;i++){
            ground[arr[i][0]][arr[i][1]]=1;
        } 
        ground[arr[len-1][0]][arr[len-1][1]] = 3;
        
        this.setData({
            ground:ground,
            snake:arr
        });
        
        return true;
    },

    changeRight:function(){
        
        var arr=this.data.snake;
        var len=this.data.snake.length;
        var snakeHEAD=arr[len-1];
        var snakeTAIL=arr[0];
        var ground=this.data.ground;
        ground[snakeTAIL[0]][snakeTAIL[1]]=0;  
        for(var i=0;i<len-1;i++){
            arr[i]=arr[i+1];   
        };

        var x=arr[len-1][0];
        var y=arr[len-1][1]+1;
        arr[len-1]=[x,y];
        this.checkGame(snakeTAIL);
        for(var i=1;i<len;i++){
            ground[arr[i][0]][arr[i][1]]=1;
        } 
        ground[arr[len - 1][0]][arr[len - 1][1]] = 3;
        
        this.setData({
            ground:ground,
            snake:arr
        });

        return true;
    },

    changeTop:function(){
        
        var arr=this.data.snake;
        var len=this.data.snake.length;
        var snakeHEAD=arr[len-1];
        var snakeTAIL=arr[0];
        var ground=this.data.ground;
        ground[snakeTAIL[0]][snakeTAIL[1]]=0;  
        for(var i=0;i<len-1;i++){
            arr[i]=arr[i+1];   
        };

        var x=arr[len-1][0]-1;
        var y=arr[len-1][1];
        arr[len-1]=[x,y];
            this.checkGame(snakeTAIL);
        for(var i=1;i<len;i++){
            ground[arr[i][0]][arr[i][1]]=1;
        } 
        ground[arr[len - 1][0]][arr[len - 1][1]] = 3;
        this.setData({
            ground:ground,
            snake:arr
        });
      
        return true;
    },

    changeBottom:function(){
        
        var arr=this.data.snake;
        var len=this.data.snake.length;
        var snakeHEAD=arr[len-1];
        var snakeTAIL=arr[0];
        var ground=this.data.ground;
        
        ground[snakeTAIL[0]][snakeTAIL[1]]=0;  
        for(var i=0;i<len-1;i++){
            arr[i]=arr[i+1];   
        };
        var x=arr[len-1][0]+1;
        var y=arr[len-1][1];
        arr[len-1]=[x,y];
        this.checkGame(snakeTAIL);
        for(var i=1;i<len;i++){
            ground[arr[i][0]][arr[i][1]]=1;
        } 
        ground[arr[len - 1][0]][arr[len - 1][1]] = 3;
        this.setData({
            ground:ground,
            snake:arr
        });
        return true;
    },

    checkGame:function(snakeTAIL){
        var arr=this.data.snake;
        var len=this.data.snake.length;
        var snakeHEAD=arr[len-1];
        //越界检测
        if(snakeHEAD[0]<0||snakeHEAD[0]>=this.data.rows||snakeHEAD[1]>=this.data.cols||snakeHEAD[1]<0){
            clearInterval(this.data.timer);
            this.setData({
                  modalHidden: false,
            })
        }
        //撞到自身
        for(var i=0;i<len-1;i++){
            if(arr[i][0]==snakeHEAD[0]&&arr[i][1]==snakeHEAD[1]){
                clearInterval(this.data.timer);
                    this.setData({
                        modalHidden: false,
                    })
            }
        }

        //吃到食物
        if (this.data.ground[snakeHEAD[0]][snakeHEAD[1]]==4) {
          arr.unshift(snakeTAIL);
          this.setData({
            score: this.data.score + 1
          });
          this.storeScore();
          this.initwall(1);
        }  
    },
    modalChange:function(){
    this.setData({
        score: 0,
        ground:[],
        snake:[],
        food:[],
        modalHidden: true,
        direction:'',
        start_flag:0,
    })
    this.onLoad();
    }
  
});