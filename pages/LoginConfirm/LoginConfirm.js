// pages/LoginConfirm/LoginConfirm.js
// //获取应用实例
var app = getApp();
var util = require('../../utils/util.js');
var api = require('../../config/api.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    src: null,    //存储照片路径
    token: null,  
    flag: null ,
    userid: null
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取上一个页面拍照的临时地址
    var Pages = getCurrentPages();
    var Page = Pages[Pages.length - 1];//当前页
    var prevPage = Pages[Pages.length - 2];  //上一个页面
    var info = prevPage.data.src
    this.setData({
      src: info,
      userid: prevPage.data.userid,
      flag: prevPage.data.flag
    })
  },

  //返回拍照界面
  backToTakePhoto: function () {
    wx.navigateTo({
      url: '../FaceLogin/Login',
    })
  },

  Confirm: function () {
      wx.switchTab({ 
        url: '../ShopList/List'
      })
  },

  backToprevPage: function () {
    wx.navigateBack({
    })
  }

})