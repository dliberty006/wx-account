// pages/ji/ji.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentDate: '',
    date: '',
    addCate: true,
    cateList: [],
    accountCategory: [],
    cateType: '0',
    cateName: '',
    selectLi: 0,
    accountMoneys: '',
    remarks: '',
    remarksCount: 0,
    recordId: '',
    isSubmit: true,
    formId: '',
    butDisable:false,
    showMeng:false,
    showDelete:false,
    showFinish:false,
    delIndex:-1,
    delName:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getApp().globalData.isBackInfo = true;
    var recordId = options.recordId;
    this.loadCate('0', recordId);
    console.log(this.data.butDisable)
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
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  cateInput: function (e) {
    this.setData({
      cateName: e.detail.value
    })
  },
  loadCate: function (cateType, recordId) {
    var that = this;
    if (recordId == undefined || recordId == '') {
      recordId = -1;
    }
    wx.request({
      url: getApp().globalData.host + '/account-web/category/category',
      dataType: 'json',
      data: {
        session: wx.getStorageSync('3rd_session'),
        type: cateType,
        recordId: recordId
      },
      header: {
        "Content-Type": "application/json"
      },
      method: "GET",
      success: function (result) {
        var recordId = result.data.recordId;
        var date = result.data.nowDate;
        var remarks = "";
        var remarksCount = 0;
        var accountMoneys = "";
        var cateList = result.data.cateList;
        var accountCategory = cateList[0];
        var selectLi = 0;
        if (recordId != '' && recordId != undefined) {
          var record = result.data.record;
          cateType = record.cateType;
          date = record.accountTime;
          remarks = record.accountRemarks;
          if (remarks != null) {
            remarksCount = remarks.length;
          }
          accountMoneys = record.accountMoney / 100;
          for (var i = 0; i < cateList.length; i++) {
            var cate = cateList[i];
            if (record.cateId == cate.id) {
              accountCategory = cate;
              selectLi = i;
            }

          }
        } else {
          recordId = '';
        }


        that.setData({
          cateList: cateList,
          accountCategory: accountCategory,
          cateType: cateType,
          selectLi: selectLi,
          date: date,
          currentDate: result.data.nowDate,
          remarks: remarks,
          remarksCount: remarksCount,
          recordId: recordId,
          accountMoneys: accountMoneys,
          butDisable:false
        })
      }
    })
  },
  addCateConfirm: function (e) {
    var that = this;
    var cateName = e.detail.value;
    if (cateName == '' || cateName == undefined) {
      return;
    }
    if (cateName.length > 3) {
      wx.showModal({
        title: '提示',
        content: '最多3个字',
        showCancel: false,
        success: function (res) {

        }
      })
      return;
    }
    wx.request({
      url: getApp().globalData.host + '/account-web/category/addCate',
      dataType: 'json',
      data: {
        session: wx.getStorageSync('3rd_session'),
        type: that.data.cateType,
        cateName: cateName
      },
      header: {
        "Content-Type": "applciation/json"
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
          return;
        } else {
          var cateList = that.data.cateList;
          var accountCategory = result.data.cate;
          cateList.push(result.data.cate);
          that.setData({
            cateName: '',
            cateList: cateList,
            accountCategory: accountCategory,
            selectLi: cateList.length - 1
          })
          var isSubmit = that.data.isSubmit;
          if (!isSubmit) {
            that.submit(e);
          }
        }


      }
    })
  },
  clickLi: function (e) {
    var index = e.currentTarget.dataset.index;
    var that = this;
    var cateList = that.data.cateList;
    that.setData({
      selectLi: index,
      accountCategory: cateList[index]
    })
  },
  changeType: function (e) {
    var that = this;
    var cateType = e.currentTarget.dataset.type;
    that.loadCate(cateType);
  },
  delLi: function (e) {
    var index = e.currentTarget.dataset.index;
    var cate = this.data.cateList[index];
    this.setData({
      showMeng: true,
      showDelete:true,
      delIndex:index,
      delName: cate.cateName
    }); 
  },
  cancelMeng: function (e) {
    this.setData({
      delIndex: -1,
      showMeng: false,
      showDelete:false,
      showFinish:false,
      delName:""
    })
  },
  changeMoney: function (e) {
    this.setData({
      accountMoneys: e.detail.value
    })
  },
  changeRemarks: function (e) {
    this.setData({
      remarks: e.detail.value,
      remarksCount: e.detail.value.length
    })
  },
  changeDate: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  showFinish:function(e){
    this.setData({
      showMeng:true,
      showFinish:true
    })
  },
  hideFinish: function (e) {
    this.setData({
      showMeng: false,
      showFinish: false
    })
  },
  againRecord:function(){
    this.hideFinish();
  },
  finishRecord: function () {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  submit: function (e) {
    var that = this;
    that.setData({
      butDisable:true,
    });
    var cateName = that.data.cateName;
    console.log(cateName);
    var formId = e.detail.formId;

    if (cateName != '' && cateName != undefined) {
      that.setData({
        isSubmit: false,
        formId: formId
      });
      console.log(1);
      return;
      console.log(2);
    }
    console.log(3);
    if (formId == undefined) {
      formId = that.data.formId;
    }
    var accountMoneys = that.data.accountMoneys;
    var reg = /^[0-9]{1}\d*(\.\d{1,2})?$/;
    if (!reg.test(accountMoneys)||accountMoneys==0) {
      wx.showModal({
        title: '提示',
        content: '请输入正确的金额',
        showCancel: false,
        success: function (res) {
          that.setData({
            butDisable: false,
          });
        }
      })
      return;
    }

    if (accountMoneys.length>7) {
      wx.showModal({
        title: '提示',
        content: '输入的金额不能超过7位数',
        showCancel: false,
        success: function (res) {
          that.setData({
            butDisable: false,
          });
        }
      })
      return;
    }
    
    accountMoneys = (parseFloat(accountMoneys) * 100).toFixed(0);
    var remarks = that.data.remarks;
    console.log(remarks);
    var date = that.data.date;
    console.log(date);
    var cate = that.data.accountCategory;
    if (cate == undefined || cate == null || cate == '' || cate == []) {
      wx.showModal({
        title: '提示',
        content: '请先添加分类',
        showCancel: false,
        success: function (res) {
          that.setData({
            butDisable: false
          });
        }
      })
      return;
    }
    var cateId = that.data.accountCategory.id;
    var cateType = that.data.cateType;
    wx.request({
      url: getApp().globalData.host + '/account-web/account/saveRecord',
      dataType: 'json',
      data: {
        session: wx.getStorageSync('3rd_session'),
        type: cateType,
        cateId: cateId,
        accountMoney: accountMoneys,
        accountRemarks: remarks,
        accountTime: date,
        recordId: that.data.recordId,
        formId: formId
      },

      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: function (result) {
        
        if (result.data.code == '1') {
          wx.showModal({
            title: '提示',
            content: result.data.message,
            showCancel: false,
            success: function (res) {

            }
          })
          return;
        } else {
          that.setData({
            date: that.data.currentDate,
            accountCategory: that.data.cateList[0],
            accountMoneys: '',
            selectLi: 0,
            remarks: '',
            remarksCount: 0,
            isSubmit: true,
            formId: '',
            recordId:''
          })
          that.showFinish();
        }


      },
      complete:function(){
        that.setData({
          butDisable: false
        });
      }
    })
  },
  delCate:function(e){
    console.log("点击了删除分类按钮");
    var that=this;
    var index = e.currentTarget.dataset.index;
    var cateList = this.data.cateList;
    console.log(cateList[index]);
    wx.request({
      url: getApp().globalData.host + '/account-web/category/delCate',
      data: {
        cateId: cateList[index].id
      },
      method: "GET",
      header: {
        "Content-Type": "applciation/json"
      },
      success: function (back) {
        console.log("删除成功！！！" + index);
        var cateList2 = that.data.cateList;        
        var accountCategory = cateList[0];
        if (cateList.length==1){
          accountCategory=[];
        }
        cateList2.splice(index, 1);
        var cate = [];
        if (cateList2.length > 0) {
          cate = cateList2[0];
        }
        that.setData({
          cateList:cateList2,
          accountCategory: accountCategory,
          delIndex:-1,
          showMeng:false,
          showDelete:false,
          delName:"",
          selectLi: 0,
          accountCategory: cate
        });
      }
    })
  }
})