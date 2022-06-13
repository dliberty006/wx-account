// pages/index/index.js
const videoAd = null;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    accountMoney:0,
    incomeMoney:0,
    descVoList:[],
    delIndex:0,
    recordId:'',
    showMeng:false,
    parentindex:-1,
    liindex:-1,
    month:"",
    endMonth:"",
    year:"",
    endYear:"",
    height:'100%',
    top:'0%',
    budgetMoney:'--',
    availableMoney:'--',
    hiddenmodalput:true,
    hiddenModal:true,
    setBudgetMoney:'',
    email:'',
    hiddenRemind:true,
    remind:'20:30',
    isSubscribe:'',
    multiArray:[['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23'],['00','30']],
    multiIndex:[0,0],
    backUrl: 'http://image.dliberty.com/ZG9jX2ZpbGUxNTMxNDcwNjQwNDgx.jpg',
    callback:null,
    currentTime:'',
    emailDate:'',
    emailYear:null,
    emailMonth:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { 
    this.createVideoAd();
    
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
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    this.setData({
      year: year,
      month: month,
      endMonth:month,
      endYear:year,
      currentTime:year+'-'+month+'-'+day
    });
    var that = this;
    getApp().globalData.isBackInfo = false;
    
    that.loadHeadData();
    that.loadData();
  },

  loadHeadData:function(){
    var that = this;
    wx.request({
      url: getApp().globalData.host + '/account-web/account/headData',
      dataType: 'json',
      data: {
        session: wx.getStorageSync('3rd_session'),
        year: that.data.year,
        month: that.data.month
      },
      header: {
        "Content-Type": "application/json"
      },
      method: "GET",
      success: function (result) {
        let email = result.data.email
        if (email == undefined) {
          email = ''
        }
        let isSubscribe = result.data.isSubscribe
        if (isSubscribe == undefined) {
          isSubscribe = ''
        }
        let remind = result.data.remind
        if (remind == undefined) {
          remind = "20:30"
        }
        that.setData({
          accountMoney: result.data.accountMoney / 100,
          incomeMoney: result.data.incomeMoney / 100,
          email: email,
          isSubscribe: isSubscribe,
          remind: remind
        });
        that.calcyusuan(result.data.budgetMoney, result.data.accountMoney / 100);
      }
    })
  },
  loadData: function () {
    // wx.showLoading({
    //   title: '加载中',
    //   mask: true
    // })
    var that = this;
    that.setData({
      descVoList: [],
    })
    wx.request({
      url: getApp().globalData.host + '/account-web/account/accountIndex',
      dataType: 'json',
      data: {
        session: wx.getStorageSync('3rd_session'),
        year: that.data.year,
        month: that.data.month
      },
      header: {
        "Content-Type": "application/json"
      },
      method: "GET",
      success: function (result) {

        that.setData({
          descVoList: result.data.descVoList,
        });
        
        wx.hideLoading();
      }
    })
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
  jiyibi:function(){
  
    let that = this

    const version = wx.getSystemInfoSync().SDKVersion

    if (that.compareVersion(version, '2.8.2') >= 0) {
      wx.requestSubscribeMessage({
        tmplIds: ['LTG010rHiE_0YW2gNQkA77U9bDp8wPQ1KrZ4_TTn7A8'],
        success(res) {
          if (JSON.stringify(res).toString().indexOf('accept') > -1) {
            that.subscribe();
          }
        },
        error(err) {
          console.log(err)
        },
        complete(com) {
          wx.navigateTo({
            url: '/pages/ji/ji'
          })
        }
      })
    } else {
      wx.navigateTo({
        url: '/pages/ji/ji'
      })
    }
    
    
    
    
    
  },
  
  calcyusuan: function (budgetMoney, accountMoney){
    var that = this;
    that.setData({
      budgetMoney: '--',
      availableMoney: '--',
      height: '100%',
      top:'0'
    })
    if (isNaN(budgetMoney)) {
      return;
    }
    budgetMoney = budgetMoney/100;
    
    var availableMoney = (parseFloat(budgetMoney) - parseFloat(accountMoney)).toFixed(2);
    if (availableMoney < 0 ) {
      availableMoney = 0;
    }
    var bilei = (availableMoney / parseFloat(budgetMoney)).toFixed(2);
    var height = bilei*100 + '%';
    var top = (1-bilei)*100 + '%';
    that.setData({
      budgetMoney: budgetMoney,
      availableMoney: availableMoney,
      height:height,
      top:top
    })
  },
  modifyAccount:function(e){
    var recordid = e.currentTarget.dataset.recordid;
    this.setData({
      recordId: "",
      showMeng: false
    })
    wx.navigateTo({
      url: '/pages/ji/ji?recordId=' + recordid
    })
  },
  delMeng:function(e) {
    var recordid = e.currentTarget.dataset.recordid;
    var parentindex = e.currentTarget.dataset.parentindex;
    var liindex = e.currentTarget.dataset.liindex;
    this.setData({
      recordId: recordid,
      showMeng:true,
      parentindex: parentindex,
      liindex: liindex
    })
  },
  cancelMeng:function(e){
    this.setData({
      recordId: "",
      showMeng: false
    })
  },
  cancelSetBudget:function(e){
    this.setData({
      showSetBudget: false
    })
  },
  subscribe:function(e) {
    wx.request({
      url: getApp().globalData.host + '/account-web/weixin/subscribe',
      dataType: 'json',
      data: {
        session: wx.getStorageSync('3rd_session'),
      },
      header: {
        "Content-Type": "applciation/json"
      },
      method: "GET",
      success: function (result) {
        

      }
    })
  },
  delRecord:function(e){
    var that = this;
    that.setData({
      recordId: "",
      showMeng: false
    });
    var parentindex = e.currentTarget.dataset.parentindex;
    var liindex = e.currentTarget.dataset.liindex;
    var recordid = e.currentTarget.dataset.recordid;
    wx.request({
      url: getApp().globalData.host + '/account-web/account/deleteAccount',
      dataType: 'json',
      data: {
        session: wx.getStorageSync('3rd_session'),
        recordId: recordid
      },
      header: {
        "Content-Type": "applciation/json"
      },
      method: "GET",
      success: function (result) {
        if (result.data.code == '0') {
          that.loadHeadData();
          that.loadData();
        } else {
          wx.showModal({
            title: '提示',
            content: result.data.message,
            showCancel: false,
            success: function (res) {
            }
          })
        }
       
      }
    })
  },
  /**
   * 选择时间
   */
  changeDate: function(e){
    var date = e.detail.value;
    var year = date.substring(0, 4);
    var month = date.substring(5, 7);
    this.setData({
      year:year,
      month:month
    });
    this.loadHeadData();
    this.loadData();
  },
  bindEmailDateChange:function(e) {
    var date = e.detail.value;
    var year = date.substring(0, 4);
    var month = date.substring(5, 7);
    this.setData({
      emailDate:date,
      emailYear:year,
      emailMonth:month
    });
  },
  setbudget:function(e) {
    let that = this
    that.setData({
      hiddenmodalput: false
    })
    // wx.showModal({
    //   title: '提示',
    //   content: '观看视频可设置预算金额',
    //   showCancel: true,
    //   cancelText: '取消',
    //   confirmText: '观看视频',
    //   success: function (res) {
    //     if (res.confirm) {
    //       that.loadVideo(function () {
    //         that.setData({
    //           hiddenmodalput: false
    //         })
    //       })
    //     }
        
    //   }
    // })
    
  },
  cancelSetbudget:function(e) {
    this.setData({
      hiddenmodalput: true
    })
  },
  changeMoney:function(e) {
    this.setData({
      setBudgetMoney: e.detail.value
    })
  },
  setbudgetConfirm:function(e) {
    var that = this;
    var setBudgetMoney = that.data.setBudgetMoney;
    if (setBudgetMoney == '' || setBudgetMoney == undefined) {
      return;
    }
    wx.request({
      url: getApp().globalData.host + '/account-web/budget/setBudget',
      dataType: 'json',
      data: {
        session: wx.getStorageSync('3rd_session'),
        money: setBudgetMoney,
        year: that.data.endYear,
        month: that.data.endMonth
      },
      method: "PUT",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (result) {
        if (result.data.code == '0') {
          that.setData({
            hiddenmodalput: true
          })
          that.loadHeadData();
        } else {
          wx.showModal({
            title: '提示',
            content: result.data.message,
            showCancel: false,
            success: function (res) {
            }
          })
        }

      }
    })
  },
  setRemind:function() {
    
    let that = this
    that.setData({
      hiddenRemind: false
    })
    
    // wx.showModal({
    //   title: '提示',
    //   content: '观看视频可修改提醒时间',
    //   showCancel: true,
    //   cancelText: '取消',
    //   confirmText: '观看视频',
    //   success: function (res) {
    //     if (res.confirm) {
    //       that.loadVideo(function () {
    //         that.setData({
    //           hiddenRemind: false
    //         })
    //       })
    //     }
        
    //   }
    // })
  },
  cancelRemind:function(){
    this.setData({
      hiddenRemind: true
    })
  },
  setEmail:function(){
    let that = this
    that.setData({
      hiddenModal: false
    })
    // wx.showModal({
    //   title: '提示',
    //   content: '观看视频可备份至邮箱',
    //   showCancel: true,
    //   cancelText:'取消',
    //   confirmText:'观看视频',
    //   success: function (res) {
    //     if (res.confirm) {
    //     that.loadVideo(function(){
    //         that.setData({
    //           hiddenModal: false
    //         })
    //     })
    //     }
    //   }
    // })
    
  },
  
  cancelMask:function(){
    this.setData({
      hiddenModal: true
    })
  },
  changeEmail: function (e) {
    this.setData({
      email: e.detail.value
    })
  },
  submitEmail:function(){
    let that = this;
    let emailYear = that.data.emailYear
    let emailMonth = that.data.emailMonth
    if (!emailYear || !emailMonth) {
      wx.showToast({
        title: '请选择日期',
        icon: "none"
      })
      return ;
    }
    let email = this.data.email;
    let reg = new RegExp("^\\w+((-\\w+)|(\\.\\w+))*\\@[A-Za-z0-9]+((\\.|-)[A-Za-z0-9]+)*\\.[A-Za-z0-9]+$");
    if (reg.test(email)){
      wx.request({
        url: getApp().globalData.host + '/account-web/email/create',
        dataType: 'json',
        data: {
          'session': wx.getStorageSync('3rd_session'),
          'email': email,
          'year':parseInt(emailYear),
          'month':parseInt(emailMonth)
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        success: function (result) {
          if (result.data.code == '0') {
            that.setData({
              hiddenModal: true
            })
            wx.showModal({
              title: '提示',
              content: '备份成功，稍后可在邮件记录里面查询',
              showCancel: false,
              success: function (res) {
              }
            })
            
            
          } else {
            wx.showModal({
              title: '提示',
              content: result.data.message,
              showCancel: false,
              success: function (res) {
              }
            })
          }

        }
      })
    }else{
      wx.showToast({
        title: '请输入正确格式的邮箱',
        icon: "none"
      })
    }
    
  },
  /**
  * @method createVideoAd 创建广告视频
  */
  createVideoAd() {
    // 创建广告位
    if (wx.createRewardedVideoAd) {
      // 加载激励视频广告
      this.videoAd = wx.createRewardedVideoAd({
        adUnitId: 'adunit-d2d7ba32fe834215'
      })
     
      //捕捉错误
      this.videoAd.onError(err => {
        // 进行适当的提示
        wx.showToast({
          title: '视频异常',
          icon: 'none'
        })
        this.finishVideoAd()
      })
      // 监听关闭
      this.videoAd.onClose((status) => {
        if (status && status.isEnded || status === undefined) {
          console.log('11111');
          // 正常播放结束，下发奖励
          this.finishVideoAd()
        } else {
          // 播放中途退出，进行提示
          wx.showToast({
            title: '未完整观看视频',
            icon: 'none'
          })
        }
      })
    }
  },
  /**
   * @method loadVideo 加载视频并播放
   */
  loadVideo(callback) {
    this.setData({
      callback:callback
    })
    if (this.videoAd) {
      this.videoAd.load()
        .then(() => {
          this.videoAd.show()
        })
        .catch(err => {
          // 视频加载失败重试,酌情添加
          this.videoAd.load()
            .then(() => {
              this.videoAd.show()
            })
            .catch(err => {
              wx.showToast({
                title: '视频加载失败！',
                icon: 'none'
              })
              this.finishVideoAd()
            })
        })
    }
  },
  finishVideoAd:function(){
    let callback = this.data.callback;
    typeof callback == "function" && callback();
    this.setData({
      callback:null
    })
  },
  //多列选择器：
  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let index1 = e.detail.value[0]
    let index2 = e.detail.value[1]
    let multiArray = this.data.multiArray
    let remind = multiArray[0][index1] + ":" + multiArray[1][index2]
    this.setData({
      remind: remind
    })
  },
  bindMultiPickerColumnChange: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    
  },
  submitRemind: function () {
    let that = this;
    let remind = this.data.remind;
    
    if (!remind) {
      wx.showModal({
        title: '提示',
        content: '请选择需要提醒的时间',
        showCancel: false,
        success: function (res) {
        }
      })
      return;
    }
    
    wx.request({
      url: getApp().globalData.host + '/account-web/weixin/modifyRemind',
      dataType: 'json',
      data: {
        'session': wx.getStorageSync('3rd_session'),
        'remind': remind
      },
      header: {
        "Content-Type": "application/json"
      },
      method: "GET",
      success: function (result) {
        if (result.data.code == '1') {
          wx.showModal({
            title: '提示',
            content: result.data.message,
            showCancel: false,
            success: function (res) {
            }
          })

        } else {
          that.setData({
            hiddenRemind: true
          })
          wx.showModal({
            title: '提示',
            content: '设置成功',
            showCancel: false,
            success: function (res) {
            }
          })
        }

      }
    })
   

  },
  compareVersion:function(v1, v2) {
    v1 = v1.split('.')
    v2 = v2.split('.')
    const len = Math.max(v1.length, v2.length)

    while(v1.length <len) {
        v1.push('0')
      }
    while(v2.length <len) {
        v2.push('0')
      }

    for(let i = 0; i<len; i++) {
    const num1 = parseInt(v1[i])
    const num2 = parseInt(v2[i])

    if (num1 > num2) {
      return 1
    } else if (num1 < num2) {
      return -1
    }
  }

  return 0
}

})