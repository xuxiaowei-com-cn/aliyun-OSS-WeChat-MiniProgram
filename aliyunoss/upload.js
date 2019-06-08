import base64 from 'lib/base64'
import crypto from 'lib/crypto1/crypto/crypto'
import hmac from 'lib/crypto1/hmac/hmac'
import sha1 from 'lib/crypto1/sha1/sha1'

var accessid = '6MKOqxGiGU4AUk44';
var accesskey = 'ufu7nS8kS59awNihtjSonMETLI0KLy';
var host = 'http://post-test.oss-cn-hangzhou.aliyuncs.com';

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
 * 暴露接口
 */
module.exports = {
  url: host,
  policy: policyBase64, // 加密策略（policy）
  OSSAccessKeyId: accessid,
  signature: signature, // 上传需要的签名（signature）
  success_action_status: success_action_status // 让服务端返回200,不然，默认会返回204
}