// pages/Main/Main.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },
  Login:function(){
  wx.navigateTo({
    url: '../FaceLogin/Login',  //跳转页面的路径，可带参数 ？隔开，不同参数用 & 分隔；相对路径，不需要.wxml后缀
    // success: function() { }       //成功后的回调；
    // fail：function() { }   ,      //失败后的回调；
    // complete：function() { }      //结束后的回调(成功，失败都会执行)
  })
  },

  Identity() {
    wx.navigateTo({
      url: '../FaceIdentity/Identity',  
    })
  },
  ULogin() {
    wx.navigateTo({
      url: '../UserLogin/ULogin',  
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {}
})