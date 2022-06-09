var Charts = require('wxcharts.js');
var util = require('../../utils/util.js');
var ringChart = null;
var ringChart2 = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    accountMoney:'',
    comeinMoney:'',
    reportList:[],
    comeinList:[],
    showActivityMeng:false,
    noAddCom:0,
    endMonth:"",
    endYear:"",
    endDay:'',
    beginTime:'',
    endTime:''
  },

  touchHandler: function (e) {
    var index = ringChart.getCurrentDataIndex(e);
    var list = this.data.reportList;
    if (index == -1 || list.length == 1) {
      return;
    }
    var cateType = '0';
    this.loadReportList(list, cateType,index);
  },
  touchHandler2: function (e) {
    var index = ringChart2.getCurrentDataIndex(e);
    var list = this.data.comeinList;
    if (index == -1 || list.length == 1) {
      return;
    }
    
    var cateType = '1';
    this.loadReportList(list, cateType, index);
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    

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
    var isBack = getApp().globalData.isBackInfo;
    this.data.noAddCom = 0;
    this.setData({
      noAddCom: 0
    })
    if (!isBack){
      var date = new Date();
      var year = date.getFullYear();
      var month = date.getMonth() + 1; 
      month = month.toString().length>1 ? month : '0' + month;
      var day = date.getDate(); 
      day = day.toString().length>1 ? day : '0' + day;    
      this.setData({
        beginTime: year + "-" + month + "-01",
        endTime:year+"-" + month + "-" + day,
        endMonth: month,
        endYear:year,
        endDay:day
        
      })
      // wx.showLoading({
      //   title: '加载中',
      //   mask: true
      // })
      this.loadAccount();
      this.isOrNotShowModal();
    }
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
  //加载消费的图
  loadAccount:function(){
    var that = this;
    wx.request({
      url: getApp().globalData.host + '/account-web/account/findRe',
      dataType: 'json',
      data: {
        session: wx.getStorageSync('3rd_session'),
        cateType: '0',
        beginTime: that.data.beginTime,
        endTime:that.data.endTime
      },
      header: {
        "Content-Type": "applciation/json"
      },
      method: "GET",
      success: function (result) {
        
        that.setData({
          accountMoney:result.data.money/100,
          reportList: result.data.reportList
        })
       
        var windowWidth = 375;
        try {
          var res = wx.getSystemInfoSync();
          windowWidth = res.windowWidth;
        } catch (e) {
          console.error('getSystemInfoSync failed!');
        }
        var accountLength = result.data.reportList.length;       
        if (accountLength!=0){
          ringChart = new Charts({
            animation: true,
            canvasId: 'ringCanvas',
            type: 'ring',
            extra: {
              ringWidth: 25,
              pie: {
                offsetAngle: -45
              }
            },
            series: result.data.reportList,
            width: windowWidth,
            height: 300,
            disablePieStroke: true,
            dataLabel: true,
            legend: true,
            background: '#f5f5f5',
            padding: 50
          });
          ringChart.addEventListener('renderComplete', (e) => {
            console.log(e);
          })
        }else{
          var noAddCom = that.data.noAddCom;
          that.setData({
            noAddCom: noAddCom+1
          })
        }
        setTimeout(() => {
          if (ringChart != null) {
            ringChart.stopAnimation();
          }
        }, 500);
       
      },
      complete:function(){
        that.loadComein();
        wx.hideLoading();
      }
    })
  },
  //加载收入的图
  loadComein: function () {
    var that = this;
    wx.request({
      url: getApp().globalData.host + '/account-web/account/findRe',
      dataType: 'json',
      data: {
        session: wx.getStorageSync('3rd_session'),
        cateType: '1',
        beginTime: that.data.beginTime,
        endTime: that.data.endTime
      },
      header: {
        "Content-Type": "applciation/json"
      },
      method: "GET",
      success: function (result) {
        that.setData({
          comeinMoney: result.data.money / 100,
          comeinList: result.data.reportList
        })
        
        var windowWidth = 375;
        try {
          var res = wx.getSystemInfoSync();
          windowWidth = res.windowWidth;
        } catch (e) {
          console.error('getSystemInfoSync failed!');
        }    
        var comeinLength = result.data.reportList.length;
        if (comeinLength!=0){
          ringChart2 = new Charts({
            animation: true,
            canvasId: 'ringCanvas2',
            type: 'ring',
            extra: {
              ringWidth: 25,
              pie: {
                offsetAngle: -45
              }
            },
            series: result.data.reportList,
            width: windowWidth,
            height: 300,
            disablePieStroke: true,
            dataLabel: true,
            legend: true,
            background: '#f5f5f5',
            padding: 50
          }); 
        }else{
          var noAddCom = that.data.noAddCom;
          that.setData({
            noAddCom: noAddCom + 1
          })
        }
        setTimeout(() => {
          if (ringChart2 != null) {
           ringChart2.stopAnimation();
          }
        }, 500);
      },
      complete: function () {
        wx.hideLoading();
      }
    })
  },
  goitem:function(e){
    var name = e.currentTarget.dataset.name;
    var type = e.currentTarget.dataset.type;
    var money = e.currentTarget.dataset.money;
    var beginTime = this.data.beginTime;
    var endTime = this.data.endTime;
    wx.navigateTo({
      url: '/pages/reportList/reportList?cateName=' + name + '&cateType=' + type + '&beginTime=' + beginTime + '&endTime=' + endTime + '&money=' + money
    })
  },
  loadReportList : function(list,cateType,index) {
    var cateName = list[index].name;
    var money = list[index].data/100;
    var beginTime = this.data.beginTime;
    var endTime = this.data.endTime;
    wx.navigateTo({
      url: '/pages/reportList/reportList?cateName=' + cateName + '&cateType=' + cateType + '&beginTime=' + beginTime + '&endTime=' + endTime + '&money=' + money
    })
  },
 
  /**
   * 选择查看历史的方法
   */
  activity_report_history : function(e){
    var that=this;
    var date = e.detail.value;
    var endTime = this.data.endTime;
    if (new Date(date).getTime() > new Date(endTime).getTime()) {
      wx.showModal({
        title: '提示',
        content: '开始时间不能大于结束时间',
        showCancel: false,
        success: function (res) {

        }
      })
      return;
    }
    this.setData({
      beginTime:date,
      showActivityMeng: false,
      noAddCom:0
    })    
    // wx.showLoading({
    //   title: '加载中',
    //   mask: true
    // })
    console.log("选择了：" + date);
    this.loadUpdateData();
  },
  /**
  * 选择查看历史的方法
  */
  activity_report_history2: function (e) {
    var that = this;
    var date = e.detail.value;
    var beginTime = this.data.beginTime;
    if (new Date(date).getTime() < new Date(beginTime).getTime()) {
      wx.showModal({
        title: '提示',
        content: '结束时间不能小于开始时间',
        showCancel: false,
        success: function (res) {

        }
      })
      return;
    }
    this.setData({
      endTime: date,
      showActivityMeng: false,
      noAddCom: 0
    })
    // wx.showLoading({
    //   title: '加载中',
    //   mask: true
    // })
    console.log("选择了：" + date);
    this.loadUpdateData();
  },

 loadUpdateData:function(){
   var that = this;
   //修改消费的图
   wx.request({
     url: getApp().globalData.host + '/account-web/account/findRe',
     dataType: 'json',
     data: {
       session: wx.getStorageSync('3rd_session'),
       cateType: '0',
       beginTime: that.data.beginTime,
       endTime: that.data.endTime
     },
     header: {
       "Content-Type": "applciation/json"
     },
     method: "GET",
     success: function (result) {
       that.setData({
         accountMoney: result.data.money / 100,
         reportList: result.data.reportList
       })
       var comeinLength = result.data.reportList.length;
       if (comeinLength != 0) {
         var windowWidth = 375;
         try {
           var res = wx.getSystemInfoSync();
           windowWidth = res.windowWidth;
         } catch (e) {
           console.error('getSystemInfoSync failed!');
         }
         if (ringChart == null) {
           ringChart = new Charts({
             animation: true,
             canvasId: 'ringCanvas',
             type: 'ring',
             extra: {
               ringWidth: 25,
               pie: {
                 offsetAngle: -45
               }
             },
             series: result.data.reportList,
             width: windowWidth,
             height: 300,
             disablePieStroke: true,
             dataLabel: true,
             legend: true,
             background: '#f5f5f5',
             padding: 50
           });
         } else {
           ringChart.updateData({
             series: result.data.reportList
           });
         }
       } else {
         var noAddCom = that.data.noAddCom;
         that.setData({
           noAddCom: noAddCom + 1
         })
       }
       setTimeout(() => {
         if (ringChart != null) {
           ringChart.stopAnimation();
         }
       }, 500);
     },
     complete: function () {
       wx.hideLoading();
     }
   });
   //修改收入的图
   wx.request({
     url: getApp().globalData.host + '/account-web/account/findRe',
     dataType: 'json',
     data: {
       session: wx.getStorageSync('3rd_session'),
       cateType: '1',
       beginTime: that.data.beginTime,
       endTime: that.data.endTime
     },
     header: {
       "Content-Type": "applciation/json"
     },
     method: "GET",
     success: function (result) {
       that.setData({
         comeinMoney: result.data.money / 100,
         comeinList: result.data.reportList
       })

       var windowWidth = 375;
       try {
         var res = wx.getSystemInfoSync();
         windowWidth = res.windowWidth;
       } catch (e) {
         console.error('getSystemInfoSync failed!');
       }
       var comeinLength = result.data.reportList.length;
       if (comeinLength != 0) {
         if (ringChart2 == null) {
           ringChart2 = new Charts({
             animation: true,
             canvasId: 'ringCanvas2',
             type: 'ring',
             extra: {
               ringWidth: 25,
               pie: {
                 offsetAngle: -45
               }
             },
             series: result.data.reportList,
             width: windowWidth,
             height: 300,
             disablePieStroke: true,
             dataLabel: true,
             legend: true,
             background: '#f5f5f5',
             padding: 50
           });
         } else {
           ringChart2.updateData({
             series: result.data.reportList
           });
         }
       } else {
         var noAddCom = that.data.noAddCom;
         that.setData({
           noAddCom: noAddCom + 1
         })
       }
       setTimeout(() => {
         if (ringChart2 != null) {
           ringChart2.stopAnimation();
         }

       }, 500);
     },
     complete: function () {
       wx.hideLoading();
     }
   });
   this.isOrNotShowModal();
 },

  /**
   * 是否提示为记账
   */
  isOrNotShowModal: function(){
    setTimeout(() => {
      if(this.data.noAddCom==2){
        wx.showModal({
          content: '小主还没有记账，先添加一笔吧？',
          showCancel:'记一笔',
          cancelText:'再看看',
          success: function (res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/ji/ji'
              })
            } else {
              console.log('用户点击取消')
            }
          }
        })
      }
    }, 1000);
  },

  
})