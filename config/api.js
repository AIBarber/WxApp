// 定义api接口地址
//var ApiRootUrl = 'http://47.93.241.248/api/';
//var ApiRootUrl = 'http://www.imcou.com/api/'
var ApiRootUrl = 'https://www.imcou.com/api/'
var WsRootUrl = 'wss://www.imcou.com/socket.io/?transport=websocket'
//var WxLoginRoot = 'https://api.weixin.qq.com/sns/jscode2session';
var WxSendUserMsg = 'https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token='
var QMapLocRoot = 'https://apis.map.qq.com/ws/geocoder/v1/';
var QCloudRoot = 'https://vod.api.qcloud.com/v2/index.php';
var WxPayUniUrl = 'https://api.mch.weixin.qq.com/pay/unifiedorder';
var WxPayTransfersUrl = 'https://api.mch.weixin.qq.com/mmpaymkttransfers/promotion/transfers';
//var PayNotifyUrl = 'http://wxpay.wxutil.com/pub_v2/pay/notify.v2.php';

module.exports = {
  //WxLoginUrl: WxLoginRoot,
  QMapLocParseUrl: QMapLocRoot,
  WxPayUniUrl: WxPayUniUrl,
  WxPayTransfersUrl: WxPayTransfersUrl,
  PayNotifyUrl: ApiRootUrl + 'wxpay/notify',
  //PayNotifyUrl: PayNotifyUrl,
  WxSendUserMsg: WxSendUserMsg,
  WsUrl: WsRootUrl,
  WsOpen: WsRootUrl + 'api/quizuser/open',

  DecryptShare: ApiRootUrl + 'auth/decryptshare',
  ArgsDigest: ApiRootUrl + 'auth/argsig',
  UploadSig: ApiRootUrl + 'auth/uploadsig',
  GetWxSession: ApiRootUrl + 'auth/getwxsession',
  GetWxPayUnified: ApiRootUrl + 'auth/getwxpayunified',
  UserList: ApiRootUrl + 'user/index',
  UserInfo: ApiRootUrl + 'user/info',
  UserAdd: ApiRootUrl + 'user/add',
  UserRegister: ApiRootUrl + 'barber/add',
  StoreList: ApiRootUrl + 'store/list',
  StoreDetail: ApiRootUrl + 'store/detailbyid',
  StoreBarberList: ApiRootUrl + 'store/barberlist',
  StoreCustomerList: ApiRootUrl + 'store/customerlist',
  StoreCustomerDetail: ApiRootUrl + 'customer/detailbyid',
  StoreBarberDetail: ApiRootUrl + 'barber/detailbyid',
  BarberSubscribeList: ApiRootUrl + 'barber/subscribelist',
  BarberSubscribe: ApiRootUrl + 'barber/subscribe',
  BarberOrderList: ApiRootUrl + 'barber/orderlist',
  CustomerOrderList: ApiRootUrl + 'customer/orderlist',
  OrderDetail: ApiRootUrl + 'order/detailbyid',
  GetFaceId: ApiRootUrl + 'bdcloud/getfaceid',
  FaceRegister: ApiRootUrl + 'bdcloud/faceregister',
  BarberRegister: ApiRootUrl + 'barber/register',
  IDUpload: ApiRootUrl + 'barber/idupload',
  SCENE_GROUP: 1044,
  USER_LEVEL_DEFAULT: 0,
  USER_LEVEL_NORMAL: 1,
  USER_LEVEL_PUBLIC: 3,

  NETWORK_DEBUG: false,
  PAY_DEBUG: false,
  WSS_DEBUG: false,

  WSS_MSG_TYPE_JOIN: 'join',
  WSS_MSG_TYPE_ANSWER: 'answer',

  CA_CERT: '-----BEGIN CERTIFICATE-----\n' +
    'MIIDIDCCAomgAwIBAgIENd70zzANBgkqhkiG9w0BAQUFADBOMQswCQYDVQQGEwJV\n' +
    'UzEQMA4GA1UEChMHRXF1aWZheDEtMCsGA1UECxMkRXF1aWZheCBTZWN1cmUgQ2Vy\n' +
    'dGlmaWNhdGUgQXV0aG9yaXR5MB4XDTk4MDgyMjE2NDE1MVoXDTE4MDgyMjE2NDE1\n' +
    'MVowTjELMAkGA1UEBhMCVVMxEDAOBgNVBAoTB0VxdWlmYXgxLTArBgNVBAsTJEVx\n' +
    'dWlmYXggU2VjdXJlIENlcnRpZmljYXRlIEF1dGhvcml0eTCBnzANBgkqhkiG9w0B\n' +
    'AQEFAAOBjQAwgYkCgYEAwV2xWGcIYu6gmi0fCG2RFGiYCh7+2gRvE4RiIcPRfM6f\n' +
    'BeC4AfBONOziipUEZKzxa1NfBbPLZ4C/QgKO/t0BCezhABRP/PvwDN1Dulsr4R+A\n' +
    'cJkVV5MW8Q+XarfCaCMczE1ZMKxRHjuvK9buY0V7xdlfUNLjUA86iOe/FP3gx7kC\n' +
    'AwEAAaOCAQkwggEFMHAGA1UdHwRpMGcwZaBjoGGkXzBdMQswCQYDVQQGEwJVUzEQ\n' +
    'MA4GA1UEChMHRXF1aWZheDEtMCsGA1UECxMkRXF1aWZheCBTZWN1cmUgQ2VydGlm\n' +
    'aWNhdGUgQXV0aG9yaXR5MQ0wCwYDVQQDEwRDUkwxMBoGA1UdEAQTMBGBDzIwMTgw\n' +
    'ODIyMTY0MTUxWjALBgNVHQ8EBAMCAQYwHwYDVR0jBBgwFoAUSOZo+SvSspXXR9gj\n' +
    'IBBPM5iQn9QwHQYDVR0OBBYEFEjmaPkr0rKV10fYIyAQTzOYkJ/UMAwGA1UdEwQF\n' +
    'MAMBAf8wGgYJKoZIhvZ9B0EABA0wCxsFVjMuMGMDAgbAMA0GCSqGSIb3DQEBBQUA\n' +
    'A4GBAFjOKer89961zgK5F7WF0bnj4JXMJTENAKaSbn+2kmOeUJXRmm/kEd5jhW6Y\n' +
    '7qj/WsjTVbJmcVfewCHrPSqnI0kBBIZCe/zuf6IWUrVnZ9NA2zsmWLIodz2uFHdh\n' +
    '1voqZiegDfqnc1zqcPGUIWVEX/r87yloqaKHee9570+sB3c4\n' +
    '-----END CERTIFICATE-----',
};