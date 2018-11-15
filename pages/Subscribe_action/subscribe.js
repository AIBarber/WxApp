// pages/Subscribe_action/subscribe.js
var app = getApp();
var util = require('../../utils/util.js');
var api = require('../../config/api.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    shopList: [],
    barberId:null,
    customerId:null,
    time: null,
    shopid: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    that.setData({
      barberId:options.barberid,
      customerId: app.globalData.userid
    })
    that.getDataList()
  },

  getDataList: function () {
    console.log('getDataList ' + api.StoreList);
    wx.showNavigationBarLoading();
    var that = this;

    util.weshowRequest(
      api.StoreList,
      {
        'size': 10
      },
      'POST').then(res => {
        //if (res.data) {}
        console.log('getDataList ');
        console.log(res);
        // success
        that.setData({ shopList: res.data.data.list });
        console.log(that.data);
        //that.stopRefreshing();
        //that.waitUpdate();
      }).catch((err) => {
        console.log('getDataList err' + err);
        // fail
        //that.stopRefreshing();
        wx.showToast({
          title: '正在获取数据…',
          icon: 'loading',
          duration: 3000,
          mask: true
        });
        that.setData({ shopList: (wx.getStorageSync('shopList') || []) });
      });
  },

  radioChange:function(e){
    this.setData({
      shopid:e.detail.value
    })
    console.log(this.data.shopid)
  },

  subscribe_Confirm:function(){
    console.log('getDataList ' + api.BarberSubscribe);
    wx.showNavigationBarLoading();
    var that = this;

    util.weshowRequest(
      api.BarberSubscribe,
      {
        'barberid': that.data.barberId,
        'store_id': that.data.shopid,
        'time': that.data.time,
        'customerid': that.data.userid
      },
      'POST').then(res => {
        //if (res.data) {}
        console.log(res);
      }).catch((err) => {
        console.log('getDataList err' + err);
      });
    wx.navigateTo({
      url: '../subscribe_Success/sub_Success',
    })
  },

  backToprevPage: function () {
    wx.navigateBack({
    })
  }
})