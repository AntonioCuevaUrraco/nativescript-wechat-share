// NativeScript modules
import * as applicationModule from "application";
import {ImageSource} from "image-source";

let WXTextObject = com.tencent.mm.sdk.openapi.WXTextObject;

let _AndroidApplication = applicationModule.android;
let api;
let _callBackFunc = function(code) {
   console.log("WECHAT PLUGIN: " + code);
};

let TIMELINE_SUPPORTED_VERSION = 0x21020001;

export var ShareToEnum = {
  Chat: com.tencent.mm.sdk.modelmsg.SendMessageToWX.Req.WXSceneSession,
  Timeline: com.tencent.mm.sdk.modelmsg.SendMessageToWX.Req.WXSceneTimeline,
  Favorite: com.tencent.mm.sdk.modelmsg.SendMessageToWX.Req.WXSceneFavorite,
};

export var RespCodeEnum = {
  Success: com.tencent.mm.sdk.modelbase.BaseResp.ErrCode.ERR_OK,
  CommonErr: com.tencent.mm.sdk.modelbase.BaseResp.ErrCode.ERR_COMM ,
  UserCancel: com.tencent.mm.sdk.modelbase.BaseResp.ErrCode.ERR_USER_CANCEL,
  SentFail: com.tencent.mm.sdk.modelbase.BaseResp.ErrCode.ERR_SENT_FAILED,
  AuthDeny: com.tencent.mm.sdk.modelbase.BaseResp.ErrCode.ERR_AUTH_DENIED,
  Unsupport: com.tencent.mm.sdk.modelbase.BaseResp.ErrCode.ERR_UNSUPPORT,
};

// must be called
export function registerApp(appId: string) {
  console.log("register");
  let _act = _AndroidApplication.foregroundActivity;
  api = com.tencent.mm.sdk.openapi.WXAPIFactory.createWXAPI(_act, appId, true);
  api.registerApp(appId);
}

export function isWechatInstalled(): boolean {
  return api.isWXAppInstalled();
}

export function isVersionSupported(): boolean {
  return api.isWXAppSupportAPI();
}

export function getWechatAPI() {
  if (api) {
     return api;
  }
  else {
   console.log("WECHAT PLUGIN: Api not found");
  }
}

export function doCallBack(code) {
  _callBackFunc(code);
}

export function getWechatVersion(): any {
  return api.getWXAppSupportAPI();
}

export function isTimeLineSupported(): boolean {
  if (api.getWXAppSupportAPI() >= TIMELINE_SUPPORTED_VERSION) {
    return true;
  }else {
    return false;
  }
}

export function registerOnRespCallback(callBackFunc: any) {
  if (callBackFunc) {
    _callBackFunc = callBackFunc;
  }
}

export function shareUrl(title, description, thumb, url, shareTo) {

  let _title = "";
  let _description = "";
  let _thumb = new ImageSource();
  let _url = "";
  let _shareTo = 1;

  if (title) {

    if (title.length > 64) {
      _title = title.slice(0, 61) + "...";
    }

    else {
      _title = title;
    }

  }

  if (description) {

    if (description.length > 128) {
      _description = description.slice(0, 125) + "...";
    }

    else {
      _description = description;
    }
  }

  if (thumb) {
    _thumb = thumb;
  }

  if (url) {
    _url = url;
  }

  if (shareTo) {
    _shareTo = shareTo;
  }

  let message = new com.tencent.mm.sdk.modelmsg.WXMediaMessage();
  message.title = _title;
  message.description = _description;
  message.setThumbImage(_thumb.android);

  let webpage = new com.tencent.mm.sdk.modelmsg.WXWebpageObject();
  webpage.webpageUrl = _url;

  console.log("url", url);

  message.mediaObject = webpage;

  let req = new com.tencent.mm.sdk.modelmsg.SendMessageToWX.Req();
  req.transaction = buildTransaction("webpage");
  req.message = message;
  req.scene = _shareTo;

  console.log("###############about send wechat req");
  api.sendReq(req);
}

export function shareText(text: string, shareTo: number) {
  let textObj = new com.tencent.mm.sdk.modelmsg.WXTextObject();
  textObj.text = text;

  let msg = new com.tencent.mm.sdk.modelmsg.WXMediaMessage();
  msg.mediaObject = textObj;

  msg.description = text;

  let req = new com.tencent.mm.sdk.modelmsg.SendMessageToWX.Req();
  req.transaction = buildTransaction("text");
  req.message = msg;
  req.scene = com.tencent.mm.sdk.modelmsg.SendMessageToWX.Req.WXSceneTimeline;

  api.sendReq(req);
}

function buildTransaction(type): string {
  if (type) {
    return type + java.lang.System.currentTimeMillis();
  }
  else {
    return java.lang.String.valueOf(java.lang.System.currentTimeMillis());
  }
}

function bmpToByteArray(bmp, needRecycle) {
    let output = new java.io.ByteArrayOutputStream();
    bmp.compress(android.graphics.Bitmap.CompressFormat.PNG, 100, output);
    if (needRecycle) {
      bmp.recycle();
    }

    let result = output.toByteArray();
    try {
      output.close();
    } catch (e) {
      console.log("WECHAT PLUGIN: : bmpToByteArray error", e);
    }

    return result;
}

export function handleIntent(paramIntent, paramIWXAPIEventHandler) {
  let str1 = paramIntent.getStringExtra("_mmessage_content");
  console.log("message content", str1);
  let i = paramIntent.getIntExtra("_mmessage_sdkVersion", 0);
          console.log("sdkversion", i);

  let str2 = paramIntent.getStringExtra("_mmessage_appPackage");
          console.log("apppackage", str2);

  if ((str2 == null) || (str2.length === 0)) {
      console.log("WECHAT PLUGIN: invalid argument");
      return false;
  }

  let j = paramIntent.getIntExtra("_wxapi_command_type", 0);
  switch (j) {
      case 7:
            console.log("WECHAT PLUGIN: unknown cmd = " + j);
      case 8:
            console.log("WECHAT PLUGIN: unknown cmd = " + j);
      default:
            console.log("WECHAT PLUGIN: INVALID: unknown cmd = " + j);
            return false;
      case 1:
            paramIWXAPIEventHandler.onResp(new com.tencent.mm.sdk.modelmsg.SendAuth.Resp(paramIntent.getExtras()));
            return true;
      case 2:
            paramIWXAPIEventHandler.onResp(new com.tencent.mm.sdk.modelmsg.SendMessageToWX.Resp(paramIntent.getExtras()));
            return true;
      case 3:
            paramIWXAPIEventHandler.onReq(new com.tencent.mm.sdk.modelmsg.GetMessageFromWX.Req(paramIntent.getExtras()));
            return true;
      case 4:
            paramIWXAPIEventHandler.onReq(new com.tencent.mm.sdk.modelmsg.SendMessageToWX.Req(paramIntent.getExtras()));
            return true;
      case 5:
            console.log("WECHAT PLUGIN: unknown cmd = " + j);
            return true;
      case 6:
            console.log("WECHAT PLUGIN: unknown cmd = " + j);
            return true;
      case 9:
           console.log("WECHAT PLUGIN: unknown cmd = " + j);
            return true;
  }
}
