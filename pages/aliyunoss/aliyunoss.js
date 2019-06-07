// pages/aliyunoss/aliyunoss.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    files: [],
    count: 9 // 最多可以选择的图片张数
  },

  chooseImage: function(e) {
    var that = this;
    var count = that.data.count; // 最多可以选择的图片张数

    // https://developers.weixin.qq.com/miniprogram/dev/api/media/image/wx.chooseImage.html
    wx.chooseImage({
      count: count, // 最多可以选择的图片张数
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {

        var length = res.tempFiles.length; // 获取本次选择图片的数量
        count -= length;

        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          count: count,
          files: that.data.files.concat(res.tempFilePaths)
        });
      }
    })
  },
  previewImage: function(e) {

    // https://developers.weixin.qq.com/miniprogram/dev/api/media/image/wx.previewImage.html
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },

  /**
   * 点击上传
   */
  uploadImg: function(e) {

    var files = this.data.files;
    console.log(files)
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})