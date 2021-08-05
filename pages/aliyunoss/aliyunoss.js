// pages/aliyunoss/aliyunoss.js

import upload from '../../aliyunoss/upload.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    files: [],
    count: 9 // 最多可以选择的图片张数
  },

  /**
   * 选择图片
   */
  chooseImage: function (e) {
    var that = this;
    var count = that.data.count; // 最多可以选择的图片张数

    // https://developers.weixin.qq.com/miniprogram/dev/api/media/image/wx.chooseImage.html
    wx.chooseImage({
      count: count, // 最多可以选择的图片张数
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {

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

  /**
   * 预览图片
   */
  previewImage: function (e) {

    // https://developers.weixin.qq.com/miniprogram/dev/api/media/image/wx.previewImage.html
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },

  /**
   * 在微信中使用秘钥上传选中图片
   */
  uploadImg: function (e) {

    var files = this.data.files;

    //  replace：http://www.w3school.com.cn/jsref/jsref_replace.asp
    // /：需要转译的字符串
    // g：替换所有
    var key = new Date().toLocaleDateString().replace(/\//g, "-") // 上传路径，这里以当前日期为例

    for (var i = 0; i < files.length; i++) {

      var file = files[i]

      key += "/" + upload.randomString() + upload.getSuffix(file)

      // https://developers.weixin.qq.com/miniprogram/dev/api/network/upload/wx.uploadFile.html
      wx.uploadFile({
        url: upload.url, // 必填：是 开发者服务器地址
        filePath: file, // 必填：是 要上传文件资源的路径
        name: 'file', // 必填：是 文件对应的 key，开发者在服务端可以通过这个 key 获取文件的二进制内容
        formData: {
          name: file,
          // key: "123/${filename}", // 临时文件名
          key: key,
          policy: upload.policy,
          OSSAccessKeyId: upload.OSSAccessKeyId,
          success_action_status: upload.success_action_status,
          signature: upload.signature
        },
        success: res => {
          console.log("上传结果 success：", res)
          wx.showToast({
            title: '上传成功',
            icon: 'success',
            duration: 2000 // 提示的延迟时间
          })
        },
        fail(res) {
          console.log("上传结果 fail：", res)
        }
      })

    }
  },

  /**
   * 服务端签名后直传选中图片
   */
  signatureUploadImg: function (e) {
    var files = this.data.files;

    //  replace：http://www.w3school.com.cn/jsref/jsref_replace.asp
    // /：需要转译的字符串
    // g：替换所有
    var key = new Date().toLocaleDateString().replace(/\//g, "-") // 上传路径，这里以当前日期为例

    var accessid;
    var callback;
    var dir;
    var expire;
    var host;
    var policy;
    var signature;
    var success_action_status = '200';

    wx.request({
      url: 'http://127.0.0.1/aliyun/oss/signature', //仅为示例，并非真实的接口地址
      success(res) {
        var data = res.data
        console.log(data)
        signature = data.signature
        accessid = data.accessid
        callback = data.callback
        dir = data.dir
        expire = data.expire
        host = data.host
        policy = data.policy
        signature = data.signature

        for (var i = 0; i < files.length; i++) {

          var file = files[i]

          key = dir + key + "/" + upload.randomString() + upload.getSuffix(file)

          // https://developers.weixin.qq.com/miniprogram/dev/api/network/upload/wx.uploadFile.html
          wx.uploadFile({
            url: host, // 必填：是 开发者服务器地址
            filePath: file, // 必填：是 要上传文件资源的路径
            name: 'file', // 必填：是 文件对应的 key，开发者在服务端可以通过这个 key 获取文件的二进制内容
            formData: {
              // key：文件路径，如 user/666.png
              //直接 key: "${filename}" 是存放在根目录，文件名为上传的文件名
              // 如果后端签名时指定了dir则开头必须同后端的一致，如后端指定了 “user/” 开头则必须是 user/xxx.xx
              key: key,
              // 自定义成功响应值 ，默认响应204
              success_action_status: success_action_status,
              OssAccessKeyId: accessid,
              // 后端签名后发回的policy
              policy: policy,
              // 后端返回的签名
              signature: signature,
              callback: callback
            },
            success: res => {
              console.log("上传结果 success：", res)
              wx.showToast({
                title: '上传成功',
                icon: 'success',
                duration: 2000 // 提示的延迟时间
              })
            },
            fail(res) {
              console.log("上传结果 fail：", res)
            }
          })

        }

      }
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})