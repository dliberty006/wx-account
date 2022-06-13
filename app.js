//app.js
App({
  onLaunch: function () {
    console.log("start");
    var that = this;
    var session = wx.getStorageSync('3rd_session');
    console.log(session);
    if (session == null || session=="" || session == undefined) {
        wx.login({
          success: res => {
            if (res.code) {
              //发起网络请求
              wx.request({
                url: getApp().globalData.host + '/account-web/weixin/getSessionKeyOropenid',
                dataType:'json',
                data: {
                  code: res.code
                },
                header: {
                  "Content-Type": "applciation/json"
                },
                method: "GET",
                success: function (result) {
                  wx.setStorageSync('3rd_session', result.data.key_3rd_session);
                  wx.request({
                    url: getApp().globalData.host + '/account-web/weixin/syncUser',
                    dataType: 'json',
                    data: {
                      session: wx.getStorageSync('3rd_session')
                    },
                    header: {
                      "Content-Type": "applciation/json"
                    },
                    method: "GET",
                    success: function (result) {

                    }
                  })
                }
              })
            } else {
              console.log('获取用户登录态失败！' + res.errMsg)
            }
          }
        })
    }
    const updateManager = wx.getUpdateManager();

    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调

    })

    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    });

    updateManager.onUpdateFailed(function () {
      return that.Tips({ title: '新版本下载失败' });
    })
  },
  globalData: {
    userInfo: null,
    isBackInfo: false,
    host:'https://www.dliberty.com'
  }
})