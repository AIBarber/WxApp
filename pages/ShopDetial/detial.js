// pages/ShopList/shopDetial/detial.js
//获取应用实例
var app = getApp();
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var model = require('../../utils/model.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    current_barber:[],
    current_customer:[],
    id:null,
    shop_detials: [],
    face_id: null,
    people_barber: 0,
    people_cus: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    console.log(options)
    that.setData({
      id:options.shop_id,
      user_id: app.globalData.faceid
    })
    that.getDataList_shop();
    that.getDataList_barber();
    that.getDataList_customer();
  },

// 获取数据列表
  getDataList_shop: function () {
    console.log('getDataList ' + api.StoreDetail);
    wx.showNavigationBarLoading();
    var that = this;

    util.weshowRequest(
      api.StoreDetail,
      {
        'size': 10,
        'storeid':that.data.id
      },
      'POST').then(res => {
        //if (res.data) {}
        console.log('getDataList ');
        console.log(res.data.data);
        // success
        that.setData({ shop_detials: res.data.data });
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
        that.setData({ shop_detials: (wx.getStorageSync('shop_detials') || []) });
      });
  },

  getDataList_barber: function () {
    console.log('getDataList ' + api.StoreBarberList);
    wx.showNavigationBarLoading();
    var that = this;

    util.weshowRequest(
      api.StoreBarberList,
      {
        'size': 10,
        'storeid': that.data.id
      },
      'POST').then(res => {
        //if (res.data) {}
        console.log('getDataList ');
        console.log(res.data.data.list);
        // success
        that.setData({ current_barber: res.data.data.list });
        console.log(that.data.current_barber);
        that.setData({
          people_barber: res.data.data.list.length
        })
        console.log(that.data.people_barber)
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
        that.setData({ current_barber: (wx.getStorageSync('current_barber') || []) });
      });
  },

  getDataList_customer: function () {
    console.log('getDataList ' + api.StoreCustomerList);
    wx.showNavigationBarLoading();
    var that = this;

    util.weshowRequest(
      api.StoreCustomerList,
      {
        'size': 10,
        'storeid': that.data.id
      },
      'POST').then(res => {
        //if (res.data) {}
        console.log('getDataList ');
        console.log(res.data);
        // success
        that.setData({ current_customer: res.data.data.list });
        that.setData({
          people_cus: res.data.data.list.length
        })
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
        that.setData({ current_customer: (wx.getStorageSync('current_customer') || []) });
      });
  },

  // 跳转到预约界面
  goToOrder:function(){
    if(app.globalData.userType==2){
      wx.navigateTo({
        url: 'pages/Reservation/reserve',
      })
    }
  },

  backToprevPage: function () {
    wx.navigateBack({
    })
  }
})

