// pages/Customer_detial/Cdetial.js
//获取应用实例
var app = getApp();
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    customer_detail:[],
    cost_list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options)
    that.setData({
      id: options.customer_id
    })
    that.getDataList_customer();
    that.getDataList_cost();
  },

  // 获取数据列表
  getDataList_customer: function () {
    console.log('getDataList ' + api.StoreCustomerDetail);
    wx.showNavigationBarLoading();
    var that = this;

    util.weshowRequest(
      api.StoreCustomerDetail,
      {
        'size': 10,
        'customerid': that.data.id
      },
      'POST').then(res => {
        //if (res.data) {}
        console.log('getDataList ');
        console.log(res.data.data);
        // success
        that.setData({ customer_detail: res.data.data });
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
        that.setData({ customer_detail: (wx.getStorageSync('customer_detail') || []) });
      });
  },

  // 获取数据列表
  getDataList_cost: function () {
    console.log('getDataList ' + api.StoreCustomerOrderList);
    wx.showNavigationBarLoading();
    var that = this;

    util.weshowRequest(
      api.StoreCustomerOrderList,
      {
        'size': 10,
        'customerid': that.data.id
      },
      'POST').then(res => {
        //if (res.data) {}
        console.log('getDataList ');
        console.log(res.data.data);
        // success
        that.setData({ cost_list: res.data.data });
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
        that.setData({ cost_list: (wx.getStorageSync('cost_list') || []) });
      });
  },

// 开始理发
  startService:function(){

  },

  // 结束理发
  endService:function(){

  },

  backToprevPage: function () {
    wx.navigateBack({
    })
  }
})