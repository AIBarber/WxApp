// pages/Reservation/reserve.js
var app = getApp();
var util = require('../../utils/util.js');
var api = require('../../config/api.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    barberId: null,
    barberInfo: [],
    timeToReserve: [],
    works: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options)
    that.setData({
      barberId: options.barberid
    })
    console.log(that.data.barberId)
    that.getDataList_barber()
    that.getDataList_time()
    that.getDataList_works()
  },

  getDataList_barber: function () {
    console.log('getDataList ' + api.StoreBarberDetail);
    wx.showNavigationBarLoading();
    var that = this;
    util.weshowRequest(
      api.StoreBarberDetail,
      {
        'size': 10,
        'barberid': that.data.barberId
      },
      'POST').then(res => {
        //if (res.data) {}
        console.log('getDataList ');
        console.log(res.data);
        // success
        that.setData({ barberInfo: res.data });
        // console.log(that.data);
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
        that.setData({ barberInfo: (wx.getStorageSync('barberInfo') || [])});
      });
  },

  getDataList_time :function () {
    console.log('getDataList ' + api.BarberSubscribeList);
    wx.showNavigationBarLoading();
    var that = this;

    util.weshowRequest(
      api.BarberSubscribeList,
      {
        'size': 10,
        'barberid': that.data.barberId
      },
      'POST').then(res => {
        //if (res.data) {}
        console.log('getDataList ');
        console.log(res.data.data);
        // success
        that.setData({ timeToReserve: res.data.data });
        // console.log(that.data);
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
        that.setData({ timeToReserve: (wx.getStorageSync('timeToReserve') || []) });
      });
  },

  getDataList_works: function () {
    console.log('getDataList ' + api.BarberSubscribeList);
    wx.showNavigationBarLoading();
    var that = this;

    util.weshowRequest(
      api.BarberSubscribeList,
      {
        'size': 10,
        'barberid': that.data.barberId
      },
      'POST').then(res => {
        //if (res.data) {}
        console.log('getDataList ');
        console.log(res.data.data);
        // success
        that.setData({ works: res.data.data });
        // console.log(that.data);
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
        that.setData({ works: (wx.getStorageSync('works') || []) });
      });
  },

  goToSubscribe:function(){
    wx.navigateTo({
      url: '../Subscribe_action/subscribe?barberid=barberId&customerid=1',
    })
  },

  backToprevPage: function () {
    wx.navigateBack({
    })
  }
})