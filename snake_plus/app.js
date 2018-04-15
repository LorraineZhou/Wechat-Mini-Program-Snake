App({
  onLaunch: function () {

  },
  getUserInfo: function (cb) {
    var that = this;
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口  
      wx.login({
        success: function (res) {
          if (res.code) {
            //发起网络请求
    //url:https://api.weixin.qq.com/sns/jscode2session?appid=wx3180910b97182e56&     secret=ddec4c2fa30f86a4f72938de297597d4&js_code=021BZYvQ1XwSt81acTsQ1q7JvQ1BZYvZ&grant_type=authorization_code
            wx.request({
              url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wx3180910b97182e56&secret=ddec4c2fa30f86a4f72938de297597d4&js_code=' + res.code +'&grant_type=authorization_code',
              method: 'GET',
              //请求成功
              success: (res) => {
                that.globalData.openid = res.data.openid;
                wx.request({
                  url: 'https://www.seanxu.club/snake?operation=select&name=' + res.data.openid,
                  method: 'GET',
                  //请求成功
                  success: (res) => {
                    // 返回状态码 200
                    that.globalData.maxscore = res.data.score;
                  },
                  fail: (res) => {
                    console.log("fail");
                    console.log(res.errMsg);
                  },
                });
              },
              fail: (res) => {
                console.log("fail");
                console.log(res.errMsg);
              },
            });

          }
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo;
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      });
    }
  },
  globalData: {
    userInfo: null,
    openid:null,
    maxscore:null,
  }
})  