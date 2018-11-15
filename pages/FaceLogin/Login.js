//获取应用实例
var app = getApp();
var util = require('../../utils/util.js');
var api = require('../../config/api.js');

Page({
  data: {
    src: null,
    position: 'front',
    userid: null,
    flag: 0
  },

  //拍照事件处理
  takePhoto: function () {
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        this.setData({
          src: res.tempImagePath
        })
        this.Confirm()
      }
    })
  },

  //调用接口进行登录认证
  Confirm: function () {
    var that = this;
    wx.uploadFile({
      url: api.FaceRegister,
      filePath: that.data.src,
      name: 'face_image',
      formData: {
        'appid': app.globalData.appid,
        'openid': app.globalData.userid,
        'timestamp': util.getCurrentSecond()
      },
      success: function (res) {
        console.log(res)
        var data = JSON.parse(res.data)
        console.log(data)
        if (data.data.result != null && data.data.result.error_code == 0) {
          that.setData({
            userid: data.data.face_id
          })
          app.globalData.faceid = data.data.face_id;
          wx.navigateTo({
            url: '../BarBer/personal',
          })
        }
        else {
          console.log(data.data.result)
          if ((data.data.result.error_code >= 216200 && data.data.result.error_code <= 216300)
            || (data.data.result.error_code >= 222200 && data.data.result.error_code <= 222300)) {
            that.setData({
              flag: 3
            })
          } else {
            that.setData({
              flag: 2
            })
          }
          wx.navigateTo({
            url: '../LoginConfirm/LoginConfirm',
          })
        }
      },
      fail: function (res) {
        that.setData({
          flag: 1
        }),
          wx.navigateTo({
            url: '../LoginConfirm/LoginConfirm',
          })
      }
    })
  },

  switchCamera: function () {
    var that = this;
    if (that.data.position == 'front') {
      that.setData({
        position: 'back'
      })
    }
    else {
      that.setData({
        position: 'front'
      })
    }
  },

  backToprevPage: function () {
    wx.navigateBack({
    })
  }
})