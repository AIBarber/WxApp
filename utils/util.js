'use strict';

var app = getApp();
var api = require('../config/api.js');

function getCurrentTime() {
  return (new Date()).getTime();
}

function getCurrentSecond() {
  return Math.floor((new Date()).getTime() / 1000);
}

function getSecurityTimestamp() {
  return parseInt((new Date()).getTime() / 1000);
}

function getNonce() {
  return Math.round(Math.random() * 100000);
}

/* 随机数 */
function getRandomString() {
  var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  var maxPos = chars.length;
  var pwd = '';
  for (var i = 0; i < 32; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}

function getHourMin(time) {
  var cur = new Date();
  var curTime = cur.getTime() / 1000;
  var date = new Date(time * 1000);
  var hour = date.getHours();
  if (hour < 10) {
    hour = '0' + hour;
  }
  var min = date.getMinutes();
  if (min < 10) {
    min = '0' + min;
  } 
  if (cur.getDate() != date.getDate()) {
    if (cur.getDate() - date.getDate() < 7) {
      return (cur.getDate() - date.getDate()) + '天前' + ' ' + hour + ':' + min;
    }
    return (date.getMonth() + 1) + '/' + date.getDate() + ' ' + hour + ':' + min;
  }
  return hour + ':' + min;
}

function getFullDateTime(time) {
  var date = new Date(time * 1000)
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatTime(time) {
  var date = new Date(time * 1000);
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

  return [hour, minute].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function getCurHour() {
  var date = new Date();
  var cur = date.getTime() / 1000;
  var show = cur + 600 - cur % 300;
  return formatTime(show);
  /*var min = date.getMinutes();
  min = min / 10;
  //console.log('getCurHour');
  //console.log(min);
  var fl = Math.floor(min + 1);
  min = Math.round(min + 1);
  var change = false;
  if (fl != min) {
    change = true;
  }
  var hour = date.getHours();
  if (min == 6) {
    min = 0;
    hour = hour + 1;
  }
  else if (min > 6) {
    min = 1;
    hour = hour + 1;
  }
  if (hour < 10) {
    hour = '0' + hour;
  }
  min = min * 10;
  if (change) {
    //min = min - 5;
  }
  if (min < 10) {
    min = '0' + min;
  }
  var strTime = hour + ':' + min;
  return strTime;*/
}

function getCurTime(start_time) {
  var date = new Date();
  console.log(start_time);
  var strTime = date.getFullYear() + '/' + (date.getMonth() + 1) +
    '/' + date.getDate() + ' ' + start_time + ':00';
  console.log(strTime);
  var stime = Date.parse(new Date(strTime)) / 1000;
  if (stime < getCurrentSecond()) {
    //stime = stime + 24 * 3600;
  }
  if (date.getHours() > 20 && (new Date(strTime).getHours() < 8)) {
    stime = stime + 24 * 3600;
  }
  console.log(stime);
  return stime;
}

/**
 * 根据时间格式化显示
 * @param time
 * @returns {string}
 */
function formatDateTime(time) {
  var cur = new Date();
  var date = new Date(time * 1000);
  var out = "";
  var curTime = cur.getTime() / 1000;

  if (isNaN(time)) {
    return time;
  }
  if (curTime - time < 3600) {
    out = Math.round((curTime - time) / 60) + '分钟前';
  }
  else if (curTime - time < 3600 * 24) {
    out = Math.round((curTime - time) / 3600) + '小时前';
  }
  else if (curTime - time < 3600 * 24 * 7) {
    out = (cur.getDate() - date.getDate()) + '天前';
  }
  else if (cur.getYear() == date.getYear()) {
    out = date.getMonth() + '月' + (date.getDay() + 1) + '日';
  }
  else {
    out = date.getFullYear() + '/' + date.getMonth() + '/' + (date.getDay() + 1);
  }
  return out;
}

function jsonToUrl(param) {
  let params = {}, data = [];
  let arr = Object.keys(param).sort();
  for (let i = 0; i < arr.length; i++) {
    let key = arr[i];
    params[arr[i]] = param[arr[i]];
  }
  for (let key in params) {
    //data.push(encodeURIComponent(key) + '=' + encodeURIComponent(params[key]));
    data.push(key + '=' + params[key]);
  }
  data = data.join('&');
  return data.toString();
}

function mergeJson(j1, j2) {
  var result = {};
  for (var attr in j1) {
    result[attr] = j1[attr];
  }
  for (var attr in j2) {
    result[attr] = j2[attr];
  }
  return result;
}


/**
 *  封装Server Request
 */
function weshowRequest(url, data = {}, method = "GET") {
  //wx.showLoading({
  //  title: '正在加载',
  //})
  var commonParams = {
    'appid': app.globalData.appid,
    'openid': app.globalData.userid,
    'timestamp': getCurrentSecond(),
    'refresh': 0,
    'nonce': getNonce(),
    'signMethod': 'HmacSHA1'
  };
  data = mergeJson(commonParams, data);
  if (api.NETWORK_DEBUG) {
    console.log(url);
  }
  url = url + '';
  if (api.NETWORK_DEBUG) {
    console.log('weshowRequest ' + url);
  }
  return new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      data: data,
      method: method,
      header: {
        'Content-Type': 'application/json',
        //'Content-Type': 'text/html; charset=UTF-8',
        //'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36 appservice webview/100000',
        'X-WxApp-ID': app.globalData.appid,
        'X-WxOpenid': app.globalData.userid,
        //'X-Weshow-Token': wx.getStorageSync('token')
        //'X-Weshow-Token': app.globalData.accountInfo.wxtoken
      },
      success: function (res) {
        if (api.NETWORK_DEBUG) {
          console.log('success for: ' + url);
        }
        //wx.hideLoading();
        resolve(res);

        /*if (res.statusCode == 200) {

          if (res.data.errno == 401) {
            //需要登录后才可以操作

            let code = null;
            return login().then((res) => {
              code = res.code;
              return getUserInfo();
            }).then((userInfo) => {
              //登录远程服务器
              request(api.AuthLoginByWeixin, { code: code, userInfo: userInfo }, 'POST').then(res => {
                if (res.errno === 0) {
                  //存储用户信息
                  wx.setStorageSync('userInfo', res.data.userInfo);
                  wx.setStorageSync('token', res.data.token);

                  resolve(res);
                } else {
                  reject(res);
                }
              }).catch((err) => {
                reject(err);
              });
            }).catch((err) => {
              reject(err);
            })
          } else {
            resolve(res.data);
          }
        } else {
          reject(res.errMsg);
        }*/

      },
      fail: function (err) {
        //wx.hideLoading();
        console.log('failed for: ' + url);
        reject(err);
      }
    })
  });
}

/**
 * 检查微信会话是否过期
 */
function checkSession() {
  return new Promise(function (resolve, reject) {
    wx.checkSession({
      success: function () {
        resolve(true);
      },
      fail: function () {
        reject(false);
      }
    })
  });
}

/**
 * 调用微信登录
 */
function login() {
  return new Promise(function (resolve, reject) {
    if (app.globalData.userInfo) {
      resolve(app.globalData.userInfo);
      return;
    }
    else if (wx.canIUse('button.open-type.getUserInfo')) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回  
      // 所以此处加入 callback 以防止这种情况  
      app.userInfoReadyCallback = res => {
        console.log(res);
        app.globalData.userInfo = res;
        resolve(app.globalData.userInfo);
      }
    }
    else if (!wx.canIUse('button.open-type.getUserInfo')) {
      reject(null);
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理  
      /*wx.getUserInfo({
        //withCredentials: true,
        success: res => {
          app.globalData.userInfo = res.userInfo
          resolve(app.globalData.userInfo);
        },
        fail: function (err) {
          console.log('log in err');
          reject(err);
        }
      })*/
    }
    /*wx.login({
      success: function (res) {
        console.log(res);
        if (res.code) {
          //登录远程服务器
          parseLogin(res).then(res0 => {
            console.log(res0);
            getUserInfo().then(resl => {
              console.log(resl);
              // 可以将 res 发送给后台解码出 unionId
              app.globalData.userInfo = resl.userInfo;
              app.globalData.hasUserInfo = true;
              wx.setStorageSync('userInfo', resl.userInfo);
              addUserInfo().then(res2 => {
                resolve(res2);
              }).catch (err2 => {
                reject(err2);
              });

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(resl)
              }
            }).catch((error3) => {
              reject(error3);
            });
            //do something
          }).catch((err) => {
            // fail
            reject(err);
          });
        } else {
        }
      },
      fail: function (err1) {
      }
    });*/
  });
}

function parseLogin(res0) {
  console.log('parseLogin');
  // 发送 res.code 到后台换取 openId, sessionKey, unionId
  if (res0.code) {
    return new Promise(function (resolve, reject) {
      weshowRequest(api.GetWxSession,
      {
        'code': res0.code
        }, 'POST').then(res => {
          console.log(res);
          app.globalData.userid = res.data.data.openid;
          app.globalData.sessionKey = res.data.data.session_key;
          wx.setStorageSync('userid', res.data.data.openid);
          wx.setStorageSync('session_key', res.data.data.session_key);
          getUserLevel();
          resolve(res);
        }).catch((err) => {
        // fail
          reject(res);
        });
    });
  }
}

function getGroupId(ticket, sessionKey) {
  console.log('getGroupId');
  console.log(ticket);
  console.log(sessionKey);
  return new Promise(function (resolve, reject) {
    if (ticket == '' || ticket == undefined) {
      reject('');
      return;
    }
    console.log('wx.getShareInfo');
    wx.getShareInfo({
      shareTicket: ticket,
      success: function (res) {
        console.log(res);
        weshowRequest(api.DecryptShare,
          {
            'data': res.encryptedData,
            'iv': res.iv,
            'appid': app.globalData.appid,
            'session_key': sessionKey
          }, 'POST').then(res0 => {
            console.log('decryptShare success');
            console.log(res0);
            resolve(res0);
          }).catch((err) => {
            console.log('decryptShare fail');
            console.log(err);
            reject(err);
          });
      },
      fail: function (res) {
        console.log('getShareInfo fail');
        console.log(res);
        reject(res);
      }
    })
  });
}

function decryptShare(data, iv) {
  console.log('decryptShare');
  console.log(app.globalData.sessionKey);
  var that = this;
  weshowRequest(api.DecryptShare,
    {
      'data': data,
      'iv': iv,
      'appid': app.globalData.appid,
      'session_key': app.globalData.sessionKey
    }, 'POST').then(res => {
      console.log('decryptShare result');
      console.log(res);
      app.globalData.openGid = res.data.data.dedata.openGId;
      app.globalData.hasGetGid = true;
      addUserGroup(app.globalData.userid, app.globalData.openGid);
      // success
    }).catch((err) => {
      // fail
    });
}

function addUserInfo() {
  console.log('addUserInfo');
  console.log(app.globalData.userInfo);
  console.log(app.globalData.userid);
  console.log(app.globalData.shareOpenid);
  var name = filterEmojiName(app.globalData.userInfo.nickName);
  return new Promise(function (resolve, reject) {
    weshowRequest(api.UserAdd,
      {
        'userid': app.globalData.userid,
        'country': app.globalData.userInfo.country,
        'province': app.globalData.userInfo.province,
        'city': app.globalData.userInfo.city,
        'gender': app.globalData.userInfo.gender,
        'language': app.globalData.userInfo.language,
        'avatarUrl': app.globalData.userInfo.avatarUrl,
        'name': name,
        'inviter_id': app.globalData.shareOpenid,
        'inviter_code': app.globalData.shareInviterCode,
        'add_time': getCurrentSecond()
      }, 'POST').then(res => {
        console.log(res);
        resolve(res);
        // success
      }).catch((err) => {
        // fail
        reject(err);
      });
  });
}

function getUserLevel() {
  console.log('getUserLevel');
  weshowRequest(
    api.UserLevel,
    {
      'userid': app.globalData.userid
    },
    'GET',
  ).then(res => {
      console.log('getUserLevel res');
      console.log(res);
      app.globalData.userLevel = res.data;
      wx.setStorageSync('userLevel', res.data);
  });
}

function loadUserInfo() {
  console.log('loadUserInfo');
    /*if (app.globalData.userInfo) {
      console.log('app.globalData.userInfo');
      console.log(app.globalData.userInfo);
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      console.log('this.data.canIUse');
      app.userInfoReadyCallback = res => {
        console.log('this.data.canIUse succ ' + res);
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else */{
    // 在没有 open-type=getUserInfo 版本的兼容处理
    console.log('getUserInfo');
    wx.getUserInfo({
      success: res => {
        console.log('getUserInfo sucess');
        console.log(res);
        app.globalData.userInfo = res.userInfo;
        app.globalData.hasUserInfo = true;
      },
      fail: function () {
        console.log('getUserInfo fail');
        login();
      }
    })
  }
}

function getUserInfo() {
  return new Promise(function (resolve, reject) {
    wx.getUserInfo({
      withCredentials: true,
      success: function (res) {
        resolve(res);
      },
      fail: function (err) {
        reject(err);
      }
    })
  });
}

function redirect(url) {
  //判断页面是否需要登录
  if (false) {
    wx.redirectTo({
      url: '/pages/auth/login/login'
    });
    return false;
  } else {
    wx.redirectTo({
      url: url
    });
  }
}

function showErrorToast(msg) {
  wx.showToast({
    title: msg,
    image: '/static/images/icon_error.png'
  })
}

function filterEmojiName(name) {
  // 过滤emoji
  //return name.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "*");
  return name;
}

//获取手机型号函数begin
function getPhoneType() {
  var info = wx.getSystemInfoSync();
  console.log(info);
  //正则,忽略大小写
  var pattern_phone = new RegExp("iphone", "i");
  //var pattern_android = new RegExp("android", "i");
  //var isAndroid = pattern_android.test(userAgent);
  var isIphone = pattern_phone.test(info.model);
  console.log(isIphone);
  return isIphone;
}

function hasButtonClicked() {
  if (app.globalData.buttonClicked) {
    return true;
  }
  app.globalData.buttonClicked = true;
  var time = setTimeout(function () {
    app.globalData.buttonClicked = false;
  }, 600);
  return false;
}

function goHome(fromhome) {
  app.globalData.homeShowHistory = true;
  if (fromhome == 1) {
    wx.navigateBack({
      delta: 1
    })
  }
  else {
    jumpTo('../home/home');
  }
}

function jumpTo(url) {
  if (hasButtonClicked()) {
    return;
  }
  wx.navigateTo({
    url: url
  })
}

function clearAndJumpTo(url) {
  if (hasButtonClicked()) {
    return;
  }
  wx.redirectTo({
    url: url
  })
}

function updateTitle(msg) {
  wx.setNavigationBarTitle({
    title: msg + '的答题专场'
  })
}

function showDialog(msg) {
  wx.showModal({
    title: '',
    content: msg,
    showCancel: false,
    cancelText: '',
    confirmText: '知道了',
    success: function (res) {
    }
  });
}

function showTitleDialog(title, msg) {
  wx.showModal({
    title: title,
    content: msg,
    showCancel: false,
    cancelText: '',
    confirmText: '知道了',
    success: function (res) {
    }
  });
}

module.exports = {
  getCurrentTime,
  getCurrentSecond,
  getNonce,
  getRandomString,
  getHourMin,
  getCurHour,
  getCurTime,
  getFullDateTime,
  formatTime,
  formatDateTime,
  mergeJson,
  weshowRequest,
  redirect,
  showErrorToast,
  checkSession,
  login,
  getUserInfo,
  loadUserInfo,
  getPhoneType,
  decryptShare,
  getGroupId,
  addUserInfo,
  hasButtonClicked,
  goHome,
  jumpTo,
  clearAndJumpTo,
  updateTitle,
  showDialog,
  showTitleDialog,
  filterEmojiName,
}
