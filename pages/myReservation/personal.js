// pages/myReservation/personal.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      info: null,
      reservation: null,
      attribute: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    var Pages = getCurrentPages();
    var Page = Pages[Pages.length - 1];//当前页
    var prevPage = Pages[Pages.length - 2];  //上一个页面
    that.setData({
      reservation: prevPage.data.info_reservation
    })
    that.getInfo()
    that.getAttribute()
  },


  getInfo:function(){

  },

  getAttribute:function(){

  },

  backToprevPage: function () {
    wx.navigateBack({
    })
  },

  goToCoupon:function(){

  },

  goToConsumption:function(){

  }
})