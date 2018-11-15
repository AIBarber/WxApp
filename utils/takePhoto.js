//获取应用实例
const app = getApp()
Page({
  data: {
    src: null
  },

  //拍照事件处理
  takePhoto: function () {
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        this.setData({
          flag: 1,
          src: res.tempImagePath
        })
        wx.navigateTo({
          url: '../FaceIdentity/IDConfirm',
        })
      }
    })
  }
})