// pages/reportList/reportList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reportList:[],
    beginTime:"",
    endTime:"",
    money:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var cateName = options.cateName;
    var cateType = options.cateType;
    var beginTime = options.beginTime;
    var endTime = options.endTime;
    var money = options.money;
    getApp().globalData.isBackInfo=true;
    
    wx.setNavigationBarTitle({
      title: cateName//页面标题为路由参数
    })
    this.loadData(cateName, cateType, beginTime, endTime);
    this.setData({
      beginTime: beginTime,
      endTime: endTime,
      money: money
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
   
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '让记账成为一种习惯，快来和我一起记账吧',
      path: '/pages/start/start'
    }
  },
  loadData: function (cateName, cateType, beginTime, endTime){
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var that = this;
    wx.request({
      url: getApp().globalData.host + '/account-web/account/reportListDate',
      dataType: 'json',
      data: {
        session: wx.getStorageSync('3rd_session'),
        cateType: cateType,
        cateName: cateName,
        beginTime: beginTime,
        endTime: endTime
      },
      header: {
        "Content-Type": "applciation/json"
      },
      method: "GET",
      success: function (result) {
        that.setData({
          reportList:result.data
        })
      },
      complete:function(){
        wx.hideLoading();
      }

    })
  }
})