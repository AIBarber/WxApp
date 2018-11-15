
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var model = require('../../utils/model.js');
import myDialog from '../template/dialog';

var app = getApp();

var isPullDownRefreshing = false;

Page({
  data: {
    faceid: app.globalData.faceid,
    isBarber: false,
    userInfo: app.globalData.userInfo,
    accountInfo: app.globalData.accountInfo,
    //accountInfo: { popularity: '-', power_of_up: '-'},
    hasUserInfo: app.globalData.hasUserInfo,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  onShow: function () {
    //this.getAccount(app.globalData.userid);
    console.log('onShow... data');
    console.log(this.data.faceid);
    console.log(this.data.isBarber);
    console.log('onShow... end');
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log('onReady... data');
  },

  onLoad: function (options) {
    console.log('onLoad...');
    var that = this;

    console.log('onLoad... global');
    console.log(app.globalData.faceid);

    if (app.globalData.faceid == null) {
    }
    else {
      wx.redirectTo({
        url: '../Customer_detial/Cdetial'
      });
    }

    this.setData({
      userInfo: app.globalData.userInfo,
      faceid: app.globalData.faceid
    })

    /*if (!app.globalData.hasUserInfo) {
      myDialog.showModal({
        title: "微信授权",
        content: "登录我的页面，需要授权获得你的公开信息（昵称、头像等）",
        confirmOpenType: "getUserInfo",
        success: (e) => {
          console.log("e", e);
          that.saveUserInfo(e.detail.userInfo);
          that.authorize(true, info => {
            console.log('authorize');
            console.log(info);
          });
        }
      });
    }

    if (app.globalData.faceid == null) {
      myDialog.showModal({
        title: "人脸验证",
        content: "为了更好的服务，需要进行人脸验证，请点击按钮进行人脸验证或理发师注册。",
        cancelText: "人脸登录",
        cancelType: "button",
        confirmText: "理发师注册",
        confirmType: "button",
        success: (e) => {
          console.log("e", e);
          wx.redirectTo({
            url: '../FaceLogin/Login'
          });
        },
        fail: (e) => {
          console.log("e", e);
          wx.redirectTo({
            url: '../FaceIdentity/Identity'
          });
        }
      });
    }
    else {
      wx.redirectTo({
        //url: '../BarBer/personal'
        url: '../Customer_detial/Cdetial'
      });
    }*/

    util.login().then(res => {
      console.log('home login success');
      console.log(res);
      that.onLogin(res);
    }).catch((err) => {
      // fail
      console.log('home login fail');
      console.log(err);
      that.onLogin(null);
      that = null;
    });
    //model.getNetShareTitle();
  },

  onLogin: function (res) {
    if (res == null) {
      this.setData({
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo')
      });
      this.showLoad(false);
    }
    else {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
        canIUse: wx.canIUse('button.open-type.getUserInfo')
      })
      //this.getAccount(app.globalData.userid);
      this.userRegister();
    }
  },

  onShareAppMessage: function (res) {
    return {
      title: model.getNewsShareTitle(),
      path: '/pages/index/index',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },

  saveUserInfo: function (userInfo) {
    console.log('saveUserInfo');
    app.globalData.userInfo = userInfo;
    app.globalData.hasUserInfo = true;
    wx.setStorageSync('userInfo', userInfo);
    util.addUserInfo();
    this.onLogin(userInfo);
  },

  onGotUserInfo: function (e) {
    console.log('onGotUserInfo');
    console.log(e);
    if (e.detail.userInfo) {
      this.saveUserInfo(e.detail.userInfo);

      this.authorize(true, info => {
        console.log('authorize');
        console.log(info);
      });
      console.log('login redirect');
      console.log(app.globalData.faceid);
      if (app.globalData.faceid == null) {
        wx.redirectTo({
          url: '../FaceLogin/Login'
        });
      }
      else {
        wx.redirectTo({
          url: '../Customer_detial/Cdetial'
        });
      }
    }
  },

  /*
   * 授权获取用户信息
   * @withCredentials 是否带上登录态信息
   * @doSuccess 成功获取用户信息的回调
   */
  authorize: function (withCredentials, doSuccess) {
    let _pageCxt = this;
    // 通过 wx.getSetting 先查询一下用户是否授权了 "scope.userInfo" 这个 scope
    wx.getSetting({
      success: res => {
        // 先判断用户是否授权获取用户信息，如未授权，则会弹出授权框
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          //_pageCxt.doWxGetUserInfo(withCredentials, doSuccess);
        } else {
          wx.authorize({
            scope: 'scope.userInfo',
            success() {
              //_pageCxt.doWxGetUserInfo(withCredentials, doSuccess);
            },
            fail() {
              wx.showToast({
                title: '授权获取信息失败',
                icon: 'loading',
                duration: 1500
              });
            }
          });
        }
      }
    });
  },

  doWxGetUserInfo: function (withCredentials, doSuccess) {
    console.log('doWxGetUserInfo')
    let _pageCxt = this;
    wx.getUserInfo({
      withCredentials: withCredentials,
      success: function (res) {
        console.log(res);
        app.globalData.userInfo = res.userInfo;
        app.globalData.hasUserInfo = true;
        wx.setStorageSync('userInfo', res.userInfo);
        _pageCxt.onLogin(res.userInfo);
        _pageCxt.onSuccess(res, doSuccess);
      },
      fail: function () {
        wx.showToast({
          title: '获取用户信息失败',
          icon: 'loading',
          duration: 1200
        });
      }
    });
  },

  /**
   * 获取信息成功的回调
   */
  onSuccess: function (data, doSuccess) {
    if (typeof doSuccess == 'function') {
      doSuccess(data);
    }
  },

  getAccount: function (uid) {
    console.log("getAccount");
    console.log(uid);
    var that = this;
    util.weshowRequest(api.UserInfo,
      {
        'userid': uid
      }, 'GET').then(res => {
        console.log(res);
        //if (res.data.level == api.USER_LEVEL_PUBLIC) {
        //  res.data.strLevel = '(公众号)';
        //}
        app.globalData.accountInfo = res.data;
        that.setData({ accountInfo: res.data });
        console.log("accountInfo");
        console.log(that.data.accountInfo);
        // success
      }).catch((err) => {
        // fail
        console.log(err);
      });
  },

  userRegister: function () {
    console.log("userRegister");
    var that = this;
    var faceid = app.globalData.faceid;
    if (faceid == null || faceid == '') {
      faceid = '0';
    }
    util.weshowRequest(api.UserRegister,
      {
        'userid': app.globalData.userid,
        'country': app.globalData.userInfo.country,
        'province': app.globalData.userInfo.province,
        'city': app.globalData.userInfo.city,
        'gender': app.globalData.userInfo.gender,
        'language': app.globalData.userInfo.language,
        'avatarUrl': app.globalData.userInfo.avatarUrl,
        'name': app.globalData.userInfo.nickName,
        'type': 2,
        'face_id': faceid
      }, 'POST').then(res => {
        console.log(res);
      }).catch((err) => {
        // fail
        console.log(err);
      });
  },

  Login: function () {
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

})
