'use strict';

var app = getApp();
var api = require('../config/api.js');
var util = require('./util.js');
var wss = require('./wss.js');


function sendLike(newsList, newsid, like) {
  console.log(newsid);
  //if (app.globalData.accountInfo.power_of_up <= 0) {
  //  util.showDialog('能量不足，请明日再赞。');
  //  return;
  //}
  return new Promise(function (resolve, reject) {
    util.weshowRequest(api.CommentLike,
      {
        'openid': app.globalData.userid,
        'create_time': util.getCurrentSecond(),
        'newsid': newsid,
        'like': like
      },
      'POST').then(res => {
        console.log(res);
        //do something
        wx.showToast({
          title: '点赞成功'
        });
        updateNewsLike(newsList, newsid);
        resolve(res);
      }
      );
  });
}

function updateNewsLike(newsList, id) {
  console.log('updateNewsLike ' + id);
  for (var i = 0; i < newsList.length; i++) {
    if (newsList[i].id == id) {
      newsList[i].hasLiked = true;
      newsList[i].likeCount = newsList[i].likeCount + 1;
      app.globalData.accountInfo.power_of_up -= 10;
      newsList[i].likes.push({ openid: '', user_photo: app.globalData.accountInfo.photo_url });
    }
  }
}

function addUserGroup(uid, gid) {
  console.log('addUserGroup');
  console.log(gid);
  util.weshowRequest(api.UserGroupAdd,
    {
      'userid': uid,
      'gid': gid,
      'note': '',
      'check_time': util.getCurrentSecond()
    }, 'POST').then(res => {
      console.log(res);
      // success
    }).catch((err) => {
      // fail
    });
}

function updateQuizShareInfo(qid, gid, ticket) {
  console.log('updateQuizShareInfo');
  util.weshowRequest(api.QuizUpdateShare,
    {
      'quiz_id': qid,
      'gid': gid,
      'share_ticket': ticket
    }, 'POST').then(res => {
      console.log(res);
      // success
    }).catch((err) => {
      // fail
    });
}

function updateQuizPay(qid, cash_val) {
  console.log('updateQuizPay');
  return new Promise(function (resolve, reject) {
    util.weshowRequest(api.QuizUpdatePay,
      {
        'quiz_id': qid,
        'openid': app.globalData.userid,
        'username': getMyUserName(),
        'cash_val': cash_val,
        'pay_status': 1,
        'add_time': util.getCurrentSecond()
      }, 'POST').then(res => {
        console.log(res);
        resolve(res);
        // success
      }).catch((err) => {
        reject(err);
        // fail
      });
  });
}

function addGroupInfo(gid, ticket) {
  console.log('addGroupInfo');
  util.weshowRequest(api.GroupAdd,
    {
      'name': '',
      'gid': gid,
      'share_ticket': ticket,
      'uid': app.globalData.uid,
      'add_uid': app.globalData.userid,
      'add_name': getMyUserName(),
      'add_time': util.getCurrentSecond()
    }, 'POST').then(res => {
      console.log(res);
      // success
    }).catch((err) => {
      // fail
    });
}

function addQuizUser(qid) {
  console.log('addQuizUser');
  console.log(app.globalData.userid);
  console.log(qid);
  return new Promise(function (resolve, reject) {
    util.weshowRequest(api.QuizUserAdd,
    {
      'userid': app.globalData.userid,
      'quizid': qid,
      'note': '',
      'add_time': util.getCurrentSecond()
    }, 'POST').then(res => {
      console.log(res);
      resolve(res);
      wss.emit('join', {openid: app.globalData.userid, quizid: qid});
      // success
    }).catch((err) => {
      // fail
      reject(err);
    });
  });
}

function getAccount(uid) {
  console.log("getAccount");
  console.log(uid);
  util.weshowRequest(api.UserInfo,
    {
      'userid': uid
    }, 'GET').then(res => {
      //console.log(res);
      app.globalData.accountInfo = res.data;
      console.log("accountInfo");
      // success
    }).catch((err) => {
      // fail
      console.log(err);
    });
}

function getQuestionList(list) {
  var questList = '';
  for (var i = 0; i < list.length; i++) {
    console.log(list[i]);
    if (i == 0) {
      questList = list[i];
    }
    else {
      questList = questList + '-' + list[i];
    }
    //console.log(questList);
  }
  return questList;
}

function uploadAwardImage(path) {
  console.log('uploadAwardImage');
    /*if (util.hasButtonClicked()) {
      return;
    }*/
  return new Promise(function (resolve, reject) {
    wx.uploadFile({
      url: api.QuizUploadAward,
      filePath: path,
      name: 'file_input',
      header: {
        'Content-Type': 'application/json',
        'timestamp': util.getCurrentSecond(),
        'X-WxApp-ID': app.globalData.appid,
        'X-WxOpenid': app.globalData.userid,
        'X-Weshow-Token': app.globalData.accountInfo.wxtoken,
        'refresh': 0,
        'nonce': util.getNonce(),
        'signMethod': 'HmacSHA1'
      },
      success: function (res) {
        console.log('uploadFile');
        console.log(res);
        var data = JSON.parse(res.data);
        resolve(data);
      },
      fail: function (err) {
        // fail
        reject(err);
      }
    });
  });
}

function generateQuiz(quiz_award, award_image, quiz_price, quiz_min, start_time) {
  console.log('generateQuiz');
  if (!app.globalData.userInfo) {
    return;
  }
  var questList = getQuestionList(app.globalData.questManualList);
  var stime = util.getCurTime(start_time);
  var qcount = app.globalData.question_count_items[app.globalData.questGenCount].value;
  var category = app.globalData.questGenType + 1;
  if (app.globalData.questManualList.length > 0) {
    category = api.QUIZ_CATEGORY_SELF;
    qcount = app.globalData.questManualList.length;
  }
  console.log('generateQuiz quiz_type ' + category);
  util.weshowRequest(api.QuizAdd,
    {
      'creator_id': app.globalData.userid,
      'creator_name': getMyUserName(),
      'creator_photo': app.globalData.userInfo.avatarUrl,
      'creator_level': app.globalData.accountInfo.level,
      'quiz_level': app.globalData.questGenLevel,
      'quiz_category': category,
      'price': quiz_price,
      'quiz_award': quiz_award,
      'quiz_award_image': award_image,
      'question_count': qcount,
      'min_users': quiz_min,
      'question_list': questList,
      'start_time': stime,
      'create_time': util.getCurrentSecond()
    },
    'POST').then(res => {
      console.log(res);
      if (res.data.errorCode == 301) {
        var msg = '奖品名称包含不合规内容(' + res.data.sword + ')，请修改。';
        util.showTitleDialog('提交失败', msg);
        return;
      }
      var data = res.data;
      var create_quizid = res.data.data.quiz_id;
      if (category != api.QUIZ_CATEGORY_SELF) {
        addQuizUser(create_quizid);
      }
      //getQuiz(create_quizid);
      createQuizSuccess(create_quizid, 0);
      /*if (quiz_price <= app.globalData.availableBalance) {
        //do something
        createQuizSuccess(create_quizid, 0);
      }
      else if (api.PAY_DEBUG) {
        createQuizSuccess(create_quizid, quiz_price);
      }
      else {
        wxp.startP(quiz_price * 100, util.getCurrentSecond()).then(res1 => {
          //console.log(res1);
          createQuizSuccess(create_quizid, quiz_price);
        }).catch((err1) => {
          console.log(err1);
          util.showDialog('失败，答题创建未成功');
        });
      }*/
    }).catch((err) => {
      // fail
      console.log(err);
      wx.showToast({
        title: '提交失败，创建未成功',
        icon: 'none',
        duration: 2000,
        mask: false
      });
    });
}

function createQuizSuccess(create_quizid, quiz_price) {
  updateQuizPay(create_quizid, quiz_price).then(res => {
    //TO DO
    app.globalData.questManualList = [];
    app.globalData.questByManual = false;
    wx.showModal({
      title: '成功发起有奖答题',
      content: '分享到群里，喊人来答题吧',
      showCancel: false,
      cancelText: '',
      confirmText: '知道了',
      success: function (res) {
        util.clearAndJumpTo('../start/start?quiz_id=' + create_quizid);
      }
    });
  }).catch((err) => {
    //TO DO
    wx.showToast({
      title: '创建未成功',
      icon: 'none',
      duration: 2000,
      mask: false
    });
  });
}

function getBalance(list) {
  if (app.globalData.accountInfo.balance < 0.01) {
    return 0;
  }
  console.log('getBalance');
  var bal = app.globalData.accountInfo.balance;
  console.log(bal);
  //console.log(list);
  if (list != null) {
    console.log(list.length);
    for (var i = 0; i < list.length; i++) {
      //console.log(list[i].is_completed + " - " + list[i].price);
      if (isQuizActive(list[i]) && isQuizOwner(list[i])) {
        bal = bal - list[i].price;
      }
      //console.log(bal);
    }
  }
  console.log(bal);
  list = null;
  return bal;
}

function updateRelive (openid, add, quizid) {
  console.log('updateRelive');
  console.log(add);
  util.weshowRequest(api.UserUpdateRelive,
    {
      'openid': openid,
      'quizid': quizid,
      'relive': 1,
      'add': (add ? api.RELIVE_ADD : api.RELIVE_DECREASE)
    }, 'POST').then(res => {
      console.log(res);
      // success
    }).catch((err) => {
      // fail
    });
}

function updateQuizResult (quizid, uid, win, watching) {
  console.log('updateQuizResult');
  console.log(quizid);
  console.log(win);
  if (watching) {
    return;
  }
  util.weshowRequest(api.QuizUserUpdateStatus,
    {
      'quizid': quizid,
      'openid': uid,
      'status': (win ? api.GAME_STATUS_WIN : api.GAME_STATUS_FAIL)
    }, 'POST').then(res => {
      console.log(res);
      // success
    }).catch((err) => {
      // fail
    });
}

function updateQuizGain (quizid, uid) {
  console.log('updateQuizGain');
  console.log(quizid);
  //if (watching) {
  //  return;
  //}
  util.weshowRequest(api.QuizUserUpdateGain,
    {
      'quizid': quizid,
      'openid': uid
    }, 'POST').then(res => {
      console.log(res);
      // success
    }).catch((err) => {
      // fail
    });
}

function updateQuizAnswered(quizid, uid, qid, watching, correct) {
  console.log('updateQuizAnswered');
  console.log(quizid);
  if (watching) {
    return;
  }
  util.weshowRequest(api.QuizUserUpdateAnswered,
    {
      'quizid': quizid,
      'openid': uid,
      'question_id': qid,
      'answer_set': 1,
      'answer_correct': correct ? 1 : 0,
      'answer_time': util.getCurrentSecond()
    }, 'POST').then(res => {
      console.log(res);
      wss.emit('answer', { openid: app.globalData.userid, quizid: quizid});
      // success
    }).catch((err) => {
      // fail
    });
}

function getGameRules() {
  util.weshowRequest(api.QuestionGetRules,
    {
      'openid': app.globalData.userid
    }, 'GET').then(res => {
      console.log('QuestionGetRules success');
      console.log(res);
      app.globalData.quiz_rules = res.data.data.game_rules;
    }).catch((err) => {
      // fail
    });
}

function getNetShareTitle() {
  util.weshowRequest(api.MagazineShareTitle,
    {
      'openid': app.globalData.userid
    }, 'GET').then(res => {
      console.log('getNetShareTitle success');
      console.log(res);
      app.globalData.ShareTitle = res.data.data.share_title;
    }).catch((err) => {
      // fail
    });
}

function createGainProc() {
  util.weshowRequest(api.QuizCreateGainProc,
    {
      'openid': app.globalData.userid
    }, 'GET').then(res => {
      console.log('QuizCreateGainProc success');
      console.log(res);
    }).catch((err) => {
    });
}

function getCreateTypeStr() {
  var strItem = '智能出题';
  if (app.globalData.questGenChanged) {
    strItem = app.globalData.question_count_items[app.globalData.questGenCount].value + '题，'
      + app.globalData.question_level_items[app.globalData.questGenLevel].value + '，'
      + app.globalData.question_type_items[app.globalData.questGenType].value;
  }
  if (app.globalData.questByManual) {
    //strItem = '自己出' + app.globalData.questManualList.length + '道题';
    strItem = '手动选出' + app.globalData.questManualList.length + '道题';
  }
  return strItem;
}

function isQuizOwner(quiz) {
  if (quiz == null) {
    return false;
  }
  return (quiz.creator_id == app.globalData.userid);
}

function isQuizActive(quiz) {
  if (quiz == null) {
    return false;
  }
  return quiz.is_completed == 0;
  /*var cur = quiz.current_time;
  var quizCompleteTime = quiz.start_time + quiz.quest_count * 15;
  if (cur < quizCompleteTime) {
    return true;
  }
  return false;*/
}

function getMyUserName() {
  var name = app.globalData.accountInfo.name;
  /*var name = app.globalData.userInfo.nickName;
  if (app.globalData.hasUserInfo) {
    name = app.globalData.userInfo.nickName;
  }*/
  if (name == null || name == undefined) {
    name = '未知';
  }
  return name;
}

function getShareTitle(my, phase, name, time, award) {
  if (phase == api.QUIZ_PHASE_FINISH) {
    return '恭喜发财，奖品拿来^^ 期待你的“' + award + '”哦！'
  }
  else {
    if (my) {
      return '答题赢奖品喽，' + time + '开始，就等你了！'
    }
    else {
      return name + '发奖品了，答题胜出就拿走，' + time + '开始，就等你了！'
    }
  }
}

function getNewsShareTitle() {
  //return '快速浏览科技前沿资讯精华';
  return app.globalData.ShareTitle;
}

module.exports = {
  sendLike,
  addQuizUser,
  addUserGroup,
  updateQuizShareInfo,
  updateQuizPay,
  addGroupInfo,
  getAccount,
  isQuizActive,
  isQuizOwner,
  getNetShareTitle,
  getShareTitle,
  getNewsShareTitle,
  getQuestionList,
  uploadAwardImage,
  generateQuiz,
  getBalance,
  getGameRules,
  createGainProc,
  getCreateTypeStr,
  createQuizSuccess,
  getMyUserName,
  updateRelive,
  updateQuizResult,
  updateQuizGain,
  updateQuizAnswered,
}
