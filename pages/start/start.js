//login.js
//获取应用实例
var app = getApp();
Page({
  data: {
    remind: '加载中',
    angle: 0,
   
  },
  goToIndex: function () {
    wx.switchTab({
      url: '/pages/index/index',
    });
  },
  onLoad: function () {
   
  },
  onShow: function () {

  },
  onShareAppMessage: function () {
    return {
      title: '让记账成为一种习惯，快来和我一起记账吧'
    }
  },
  onReady: function () {
    var that = this;
    setTimeout(function () {
      that.setData({
        remind: ''
      });
    }, 1000);
    wx.onAccelerometerChange(function (res) {
      var angle = -(res.x * 30).toFixed(1);
      if (angle > 14) { angle = 14; }
      else if (angle < -14) { angle = -14; }
      if (that.data.angle !== angle) {
        that.setData({
          angle: angle
        });
      }
    });
  }
});