// pages/ShopList/BarBer/personal.js
var app = getApp();
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var model = require('../../utils/model.js');
import myDialog from '../template/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reservations:[],
    orders:[],
    barberDetails:[],
    barberID:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDataList_details();
    this.getDataList_reservations();
    this.getDataList_orders();
    // getApp().editTabBar();
  },

  getDataList_details: function () {
    console.log('getDataList ' + api.StoreDetail);
    wx.showNavigationBarLoading();
    var that = this;

    util.weshowRequest(
      api.StoreDetail,
      {
        'size': 10,
        'storeid': that.data.barberID
      },
      'POST').then(res => {
        //if (res.data) {}
        console.log('getDataList ');
        console.log(res.data.data);
        // success
        that.setData({ barberDetails: res.data.data });
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
        that.setData({ barberDetails: (wx.getStorageSync('barberDetails') || []) });
      });
  },

  getDataList_reservations: function () {
    console.log('getDataList ' + api.StoreDetail);
    wx.showNavigationBarLoading();
    var that = this;

    util.weshowRequest(
      api.StoreDetail,
      {
        'size': 10,
        'storeid': that.data.barberID
      },
      'POST').then(res => {
        //if (res.data) {}
        console.log('getDataList ');
        console.log(res.data.data);
        // success
        that.setData({ reservations: res.data.data });
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
        that.setData({ reservations: (wx.getStorageSync('reservations') || []) });
      });
  },

  getDataList_orders: function () {
    console.log('getDataList ' + api.StoreDetail);
    wx.showNavigationBarLoading();
    var that = this;

    util.weshowRequest(
      api.StoreDetail,
      {
        'size': 10,
        'storeid': that.data.barberID
      },
      'POST').then(res => {
        //if (res.data) {}
        console.log('getDataList ');
        console.log(res.data.data);
        // success
        that.setData({ orders: res.data.data });
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
        that.setData({ orders: (wx.getStorageSync('orders') || []) });
      });
  },

  backToprevPage: function () {
    wx.navigateBack({
    })
  }
})