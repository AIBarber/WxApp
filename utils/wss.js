'use strict';

var app = getApp();
var api = require('../config/api.js');

/** socket.io 协议常量 */
var packets = {
  open: 0,  // non-ws
  close: 1,  // non-ws
  ping: 2,
  pong: 3,
  message: 4,
  upgrade: 5,
  noop: 6,
};

var events = {
  CONNECT: 0,
  DISCONNECT: 1,
  EVENT: 2,
  ACK: 3,
  ERROR: 4,
  BINARY_EVENT: 5,
  BINARY_ACK: 6
};

const PING_CHECK_INTERVAL = 20000;
const HEARTBEAT_INTERVAL = 20000;

var mWssTimer = null;

function startWebSocket() {
  console.log('WebSocket connect.')
  app.globalData.wssConnected = false;
  var SocketTask = wx.connectSocket({
    url: api.WsUrl + '&openid=' + app.globalData.userid,
    data: {
      transport: 'websocket',
      openid: app.globalData.userid
    },
    header: {
      'content-type': 'application/json'
    },
    protocols: ['protocol1'],
    success(res) {
      console.log('success');
      console.log(res);
    },
    fail(res) {
      console.log('fail');
      console.log(res);
    }
  });
  console.log('WebSocket connected ' + SocketTask);
  console.log(SocketTask);
  wx.onSocketError(function (res) {
    console.log('WebSocket connect fail.');
    console.log(res);
  })
  wx.onSocketClose(function (res) {
    console.log('WebSocket closed.');
    console.log(res);
  })
  wx.onSocketOpen(function (res) {
    console.log('WebSocket Opened.')
    console.log(res);
    app.globalData.wssConnected = true;
  })
  heartbeat();
  if (api.WSS_DEBUG) {
    setTimeout(function () {
      if (app.globalData.wssConnected) {
        console.log('SendMessage Test BEGIN');
        wx.sendSocketMessage({
          data: [packets.message, events.EVENT, JSON.stringify(['join',
            { openid: app.globalData.userid, quizid: 336 }])].join('')
        })
        console.log('SendMessage Test END');
      }
    }, 6000);
  }
}

function emit(type, ...params) {
  const data = [type, ...params];
  wx.sendSocketMessage({
    data: [packets.message, events.EVENT, JSON.stringify(data)].join("")
  });
}

function closeWebSocket() {
  app.globalData.wssConnected = false;
  wx.closeSocket();
  clearTimeout(mWssTimer);
  mWssTimer = null;
}

function heartbeat() {
  if (mWssTimer != null) {
    clearTimeout(mWssTimer);
  }
  mWssTimer = setTimeout(function () {
    console.log('SendMessage ping ');
    if (app.globalData.wssConnected) {
      wx.sendSocketMessage({
        data: [packets.ping, 'probe'].join('')
      })
      console.log('SendMessage ping end ');
      //heartbeat();
    }
  }, HEARTBEAT_INTERVAL);
}

function ping() {
  setTimeout(() => {
    if (!app.globalData.wssConnected) return;
    wx.sendSocketMessage({
      data: [packets.ping, 'probe'].join('')
    });
  }, PING_CHECK_INTERVAL);
}

function parseMessage({ data }) {
  console.log('parseMessage');
  console.log(data);
  const [match, packet, event, content] = /^(\d)(\d?)(.*)$/.exec(data);
  if (+event === events.EVENT) {
    switch (+packet) {
      case packets.message:
        let pack;
        try {
          pack = JSON.parse(content);
          console.log(pack);
        } catch (error) {
          console.error('parse wss fail.')
          console.error(error);
        }
        //const [type, ...params] = pack;
        //this.fire(type, ...params);
        break;
    }
  }
  else if (+packet == packets.pong) {
    ping();
  }
}

function getWebSocketMsgType(data) {
  console.log('getWebSocketMsgType');
  var msgType = '';
  /*var pos = (data + '').indexOf('[');
  if (pos > -1) {
    var msg = (data + '').substring(pos);
    pos = msg.indexOf(',');
    if (pos > -1) {
      msg = msg.substring(pos + 1);
      pos = msg.indexOf(',');
      if (pos > -1) {
        msgType = msg.substring(1, pos - 1);
      }
    }
  }*/
  const [match, packet, event, content] = /^(\d)(\d?)(.*)$/.exec(data);
  if (+event === events.EVENT) {
    switch (+packet) {
      case packets.message:
        let pack;
        try {
          pack = JSON.parse(content);
          console.log(pack);
          msgType = pack[1];
        } catch (error) {
          console.error('parse wss fail.')
          console.error(error);
        }
        break;
    }
  }
  else if (+packet == packets.pong) {
    ping();
  }
  return msgType;
}

module.exports = {
  startWebSocket,
  closeWebSocket,
  parseMessage,
  getWebSocketMsgType,
  emit,
}