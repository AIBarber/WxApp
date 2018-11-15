// pages/subscribe_Success/sub_Success.js
var app = getApp();
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var model = require('../../utils/model.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
   info_reservation:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  backToprevPage: function () {
    wx.navigateBack({
    })
  },


  getInfoOfReservation:function(){

  },
  
  goToSelf:function(){
    wx.navigateTo({
      url: '../myReservation/personal',
    })
  }
  
})