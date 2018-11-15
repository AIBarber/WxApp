/* 小程序弹窗js v1.0.0 */

var __this;
var dialog = {
  //微信自定义弹窗.Start
  showDialogModal: function (options) {
    __this = getCurrentPages()[getCurrentPages().length - 1]; //获取当前page实例，便于跨页面挂载
    
    var config = {
      type: '',       //设置弹窗显示类型 ->默认：0 （0表示信息框，1表示页面层）
      title: '',       //标题
      content: '',      //内容
      style: '',       //自定弹窗样式
      skin: '',       //自定弹窗显示风格 ->目前支持配置 toast(仿微信toast风格) footer(底部对话框风格)、msg(普通提示)
      icon: '',       //弹窗小图标(success | loading)

      shade: true,      //是否显示遮罩层
      shadeClose: true,   //是否点击遮罩时关闭层
      anim: 'scaleIn',    //scaleIn：缩放打开(默认)  fadeIn：渐变打开  fadeInUpBig：由上向下打开 fadeInDownBig：由下向上打开  rollIn：左侧翻转打开  shake：震动  footer：底部向上弹出
      time: 0,        //设置弹窗自动关闭秒数

      btns: null       //不设置则不显示按钮。如果只需要一个按钮，则btn: '按钮'，如果有两个，则：btn: ['按钮一', '按钮二']
    };

    __this.opts = options;
    for (var i in config) {
      if (!(i in __this.opts)) {
        __this.opts[i] = config[i];
      }
    }
    var opts = __this.opts;

    //自动关闭
    __this.timer && clearTimeout(__this.timer);
    if (opts.time) {
      __this.timer = setTimeout(function () {
        dialog.hideDialogModal();
      }, opts.time * 1000)
    }

    //配置参数
    __this.setData({
      __dialog__: {
        showModalStatus: true,

        type: opts.type,
        title: opts.title,
        content: opts.content,
        style: opts.style,
        skin: opts.skin,
        icon: opts.icon,

        shade: opts.shade,
        shadeClose: opts.shadeClose,
        anim: opts.anim ? opts.anim : 'scaleIn',

        btns: opts.btns
      }
    });

    /**
     * 将方法挂载至 page 上面，方便在模板template内调用绑定事件
     * @event {function} btnTapped 绑定按钮事件
     * @event {function} hideModal 弹窗关闭事件
     */
    __this.btnTapped = function(e) {
      var idx = e.currentTarget.dataset.index;
      var btn = opts.btns[idx];
      typeof btn.onTap === "function" && btn.onTap(e);
    }

    __this.hideModal = function(e){
      dialog.hideDialogModal(e);
    }

    return this;
  },
  hideDialogModal: function (e) {
    if (e) {
      var shadeClose = e.currentTarget.dataset.shadeclose;
      if (/^false$/i.test(shadeClose)) return;
    }
    __this.timer && clearTimeout(__this.timer);

    __this.setData({
      '__dialog__.showModalStatus': false
    });
  }
  //微信自定义弹窗.End
};

//对外暴露接口
module.exports = {
  show: dialog.showDialogModal,
  hide: dialog.hideDialogModal
}



