import base64 from 'lib/base64'
import crypto from 'lib/crypto1/crypto/crypto'
import hmac from 'lib/crypto1/hmac/hmac'
import sha1 from 'lib/crypto1/sha1/sha1'

var accessid = '6MKOqxGiGU4AUk44' // 设置为你的 accessid
var accesskey = 'ufu7nS8kS59awNihtjSonMETLI0KLy' // 设置为你的 accesskey
var host = 'http://post-test.oss-cn-hangzhou.aliyuncs.com' // 设置为你的 host

var g_dirname = ''
var g_object_name = ''
var g_object_name_type = ''
var now = new Date()
var expiration = new Date(now.setMinutes(now.getMinutes() + 5)) // 过期时间（有效时间为5分钟）

var success_action_status = '200';

var policyText = {
  "expiration": expiration, //设置该Policy的失效时间，超过这个失效时间之后，就没有办法通过这个policy上传文件了
  "conditions": [
    ["content-length-range", 0, 1048576000] // 设置上传文件的大小限制
  ]
};

var policyBase64 = base64.Base64.encode(JSON.stringify(policyText)) // 加密策略（policy）
var message = policyBase64
var bytes = hmac.CryptoHMAC(sha1.CryptoSHA1, message, accesskey, {
  asBytes: true
});
var signature = crypto.util.bytesToBase64(bytes); // 上传需要的签名（signature）

/**
 * 获取文件后缀名
 */
function getSuffix(filename) {
  var pos = filename.lastIndexOf('.')
  var suffix = ''
  if (pos != -1) {
    suffix = filename.substring(pos)
  }
  return suffix;
}

/**
 * 指定长度随机字符串
 * 
 * 不传值，长度为32
 */
const randomString = len => {
  len = len || 32;
  var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678' /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  var maxPos = chars.length;
  var pwd = '';
  for (var i = 0; i < len; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}

/**
 * 暴露接口
 */
module.exports = {
  url: host,
  policy: policyBase64, // 加密策略（policy）
  OSSAccessKeyId: accessid,
  signature: signature, // 上传需要的签名（signature）
  success_action_status: success_action_status, // 让服务端返回200,不然，默认会返回204
  getSuffix: getSuffix,
  randomString: randomString
}