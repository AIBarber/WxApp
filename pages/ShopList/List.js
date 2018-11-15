// pages/ShopList/List.js
var app = getApp();
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var model = require('../../utils/model.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
      shop_arrays:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDataList();
    //getApp().editTabBar();
  },

// 获取店铺列表
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
        that.setData({ shop_arrays: res.data.data.list });
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
        that.setData({ shop_arrays: (wx.getStorageSync('shop_arrays') || []) });
      });
  },

  gotoDetail: function (event) {
    var id = event.currentTarget.id;
    //app.globalData.current_store_id = id;
    var data = this.retriveDataById(id);
    if (data != null) {
      console.log('gotoDetail ' + id);
      //console.log('gotoDetail app ' + app.globalData.current_store_id);
      // setTimeout(function () {
      // console.log('gotoDetail wait ' + id);
      // util.jumpTo('../ShopList/ShopDetial/detial?shop_id=' + id);
      wx.navigateTo({
        url: '../ShopDetial/detial?shop_id=' + id,
      })
      // }, 300);
    }
  },

  retriveDataById: function (id) {
    for (var i = 0; i < this.data.shop_arrays.length; i++) {
      if (this.data.shop_arrays[i].id == id) {
        return this.data.shop_arrays[i];
      }
    }
    return null;
  },

  backToprevPage: function () {
    wx.navigateBack({
    })
  }
})

