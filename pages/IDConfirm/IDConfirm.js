// pages/IDConfirm/IDConfirm.js
var app = getApp()
var util = require('../../utils/util.js');
var api = require('../../config/api.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    srcFace: null,
    faceid: null,       //存储照片id
    srcID: null,         //存储身份证路径 
    url_ID: null,
    phone: null,         //存储手机号
    // code: null,          //存储用户输入验证码
    // Code: null,          //存储用户手机实际获取到的验证码
    // time: '获取验证码',   //用于倒计时 
    // currentTime: 60,     //限制60s
    // click: false,        //获取验证码按钮，默认允许点击
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取上一个页面照片的临时地址
    var pages = getCurrentPages();
    var Page = pages[pages.length - 1];//当前页
    var prevPage = pages[pages.length - 2];  //上一个页面
    this.setData({
      srcFace: prevPage.data.src,
      faceid: prevPage.data.faceid
    })
  },

  //返回拍照界面
  backToTakePhoto: function () {
    wx.navigateTo({
      url: '../FaceIdentity/Identity',
    })
  },

  //人像上传
  idUpLoad: function () {
    var that = this;
    wx.uploadFile({
      url: api.IDUpload,
      filePath: that.data.srcID,
      name: 'id_picture',
      formData: {
        'appid': app.globalData.appid,
        'openid': app.globalData.userid,
        'timestamp': util.getCurrentSecond()
      },
      success: function (res) {
        console.log(res)
        var data = JSON.parse(res.data);
        console.log(data)
        if (data.data.result == 'success') {
          that.setData({
            url_ID: data.data.id_url
          })
        }
        console.log(that.data.url_ID);
      },
      fail: function (res) {
        wx.showModal({
          title: '提示',
          content: '上传失败，请重试！',
        })
      }
    })
  },
  //身份证获取，调用微信API，可以拍照也可以从本地选择
  getID: function () {
    wx.chooseImage({
      count: 1, //最多可以选择的图片张数,默认9
      //sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: (res) => {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        this.setData({
          srcID: tempFilePaths[0]
        })
        this.idUpLoad()
      },
      fail: (res) => {
        wx.showModal({
          title: '提示',
          content: '上传失败，请重试！',
        })
      }
    })
  },

  //获取input输入框的值
  getPhoneValue: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  // getCodeValue: function (e) {
  //   this.setData({
  //     code: e.detail.value
  //   })
  // },
  //获取验证码事件处理
  // gainAuthCodeAction: function () {
  //   let that = this;
  //   /*第一步：验证手机号码*/
  //   var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;// 判断手机号码的正则
  //   if (that.data.phone.length == 0) {
  //     util.progressTips('手机号码不能为空')
  //     return;
  //   } else if (that.data.phone.length < 11) {
  //     util.progressTips('手机号码长度有误！')
  //     return;
  //   } else if (!myreg.test(that.data.phone)) {
  //     util.progressTips('无效的手机号码！')
  //     return;
  //   }
  //   /*第二步：设置计时器*/
  //   // 先禁止获取验证码按钮的点击
  //   that.setData({
  //     click: true,
  //   })
  //   // 60s倒计时 setInterval功能用于循环，常常用于播放动画，或者时间显示
  //   var currentTime = that.data.currentTime;
  //   interval = setInterval(function () {
  //     currentTime--;
  //     that.setData({
  //       time: currentTime + '秒后重新获取'
  //     })
  //     if (currentTime <= 0) {
  //       clearInterval(interval)
  //       that.setData({
  //         time: '获取验证码',
  //         currentTime: 60,
  //         click: false
  //       })
  //     }
  //   }, 1000);
  //   /*第三步：请求验证码接口，并记录服务器返回的验证码用于判断*/
  //   // wx.request({
  //   //   data: {},
  //   //   'url': '接口地址',
  //   //   success(res) {
  //   //     console.log(res.data.data)
  //   //     that.setData({
  //   //       Code: res.data.data  //从接口获取到的验证码
  //   //     })
  //   //   }
  //   // })
  // },

  //获取验证码
  // getVerificationCode() {
  //   this.gainAuthCodeAction();
  // },

  // 提交表单信息，对验证码进行匹配
  // save: function () {
  //   var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
  //   if (this.data.phone == "") {
  //     wx.showToast({
  //       title: '手机号不能为空',
  //       icon: 'none',
  //       duration: 1000
  //     })
  //     return false;
  //   } else if (!myreg.test(this.data.phone)) {
  //     wx.showToast({
  //       title: '请输入正确的手机号',
  //       icon: 'none',
  //       duration: 1000
  //     })
  //     return false;
  //   }
  //   if (this.data.code == "") {
  //     wx.showToast({
  //       title: '验证码不能为空',
  //       icon: 'none',
  //       duration: 1000
  //     })
  //     return false;
  //   } else if (this.data.code != this.data.Code) {
  //     wx.showToast({
  //       title: '验证码错误',
  //       icon: 'none',
  //       duration: 1000
  //     })
  //     return false;
  //   } else {
  //     wx.setStorageSync('phone', this.data.phone);
  //     wx.navigateTo({
  //       url: '../FaceIdentity/idSuccess',
  //     })
  //   }
  //},

  vetify:function(){
    console.log('getapi: ' + api.BarberRegister);
    wx.showNavigationBarLoading();
    var that = this;
    app.getUserInfoEvent
    util.weshowRequest(
      api.BarberRegister,
      {
        'phone ': that.data.phone,
        'id_card_url': that.data.url_ID,
        'face_id': that.data.faceid,           
        'userid':  app.globalData.userid, 
        // 'country': app.globalData.userInfo.country,             
        // 'province': app.globalData.userInfo.province, 
        // 'city':  app.globalData.userInfo.city,              
        // 'gender':  app.globalData.userInfo.gender,   
        // 'language':  app.globalData.userInfo.language,              
        // 'avatarUrl': app.globalData.userInfo.avatarUrl,    
        // 'name':  app.globalData.userInfo.nickName,             
        // 'inviter_id': app.globalData.shareOpenid, 
        // 'inviter_code': app.globalData.shareInviterCode,            
        'add_time': Math.floor((new Date()).getTime() / 1000)          
      },
      'POST').then(res => {
        console.log(res);
        // success
      }).catch((err) => {
        wx.navigateTo({
          url: '../IDSuccess/idSuccess',
        })
      });
    wx.navigateTo({  //
      url: '../IDSuccess/idSuccess',
    })
  },
})