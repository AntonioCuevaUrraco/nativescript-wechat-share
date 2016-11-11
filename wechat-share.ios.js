var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
// define the class that implements the WXApiDelegate protocol required by WeChat API
var MyWXApiDelegate = (function (_super) {
    __extends(MyWXApiDelegate, _super);
    function MyWXApiDelegate() {
        _super.apply(this, arguments);
    }
    MyWXApiDelegate.prototype.onReq = function (req) {
        // not implemented
    };
    MyWXApiDelegate.prototype.onResp = function (resp) {
        this.callBack(resp.errCode);
    };
    MyWXApiDelegate.prototype.setOnRespCallBack = function (callBackFunc) {
        this.callBack = callBackFunc;
    };
    MyWXApiDelegate.ObjCProtocols = [WXApiDelegate];
    return MyWXApiDelegate;
})(NSObject);
// instantiate the object of the class
exports.myWXApiDelegate = new MyWXApiDelegate();
// wrap the scene constants to ease the cross-platform situation
exports.ShareToEnum = {
    Chat: WXSceneSession,
    Timeline: WXSceneTimeline,
    Favorite: WXSceneFavorite,
};
// wrap the error code constants to ease the cross-platform situation
exports.RespCodeEnum = {
    Success: WXSuccess,
    CommonErr: WXErrCodeCommon,
    UserCancel: WXErrCodeUserCancel,
    SentFail: WXErrCodeSentFail,
    AuthDeny: WXErrCodeAuthDeny,
    Unsupport: WXErrCodeUnsupport,
};
// wrap the native registerApp function, make native sdk transparent for plugin users
function registerApp(appId) {
    return WXApi.registerApp(appId);
}
exports.registerApp = registerApp;
// plugin users use thie function to register the callback function when receiving response from WeChat
// the function must have this signature: functionName(code number)
// the code will be an item in the RespCodeEnum variable
function registerOnRespCallback(callBackFunc) {
    exports.myWXApiDelegate.setOnRespCallBack(callBackFunc);
}
exports.registerOnRespCallback = registerOnRespCallback;
// the WXApi.isWXAppInstalled is not reliable. It can return false even if a supporting WeChat app is installed
function isWechatInstalled() {
    return WXApi.isWXAppInstalled();
}
exports.isWechatInstalled = isWechatInstalled;
// according to our experience, WXApi.isWXAppSupportApi is reliable. When no WeChat app installed, it returns false.
// so one can combine the use of isWXAppSupportApi and isWXAppInstalled to check if there is a valid WeChat app.
function isVersionSupported() {
    return WXApi.isWXAppSupportApi();
}
exports.isVersionSupported = isVersionSupported;
// shareUrl accepts the thumbnail image in imageSource type because it is defined by NativeScript and platform independent.
// Parameter shareTo should be an item in the ShareToEnum variable.
function shareUrl(title, description, thumb, url, shareTo) {
    var _title = "";
    var _description = "";
    var _url = "";
    var _shareTo = 1;
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
    if (url) {
        _url = url;
    }
    if (shareTo) {
        _shareTo = shareTo;
    }
    var message = new WXMediaMessage();
    message.title = _title;
    message.description = _description;
    if (thumb) {
        message.setThumbImage(thumb.ios);
    }
    var ext = new WXWebpageObject();
    ext.webpageUrl = _url;
    message.mediaObject = ext;
    var req = new SendMessageToWXReq();
    req.bText = false;
    req.scene = _shareTo;
    req.message = message;
    return WXApi.sendReq(req);
}
exports.shareUrl = shareUrl;
// Parameter shareTo should be an item in the ShareToEnum variable.
function shareText(text, shareTo) {
    var req = new SendMessageToWXReq();
    req.bText = true;
    req.text = text;
    req.scene = shareTo;
    return WXApi.sendReq(req);
}
exports.shareText = shareText;
// Both the image and the thumbnail are in type imageSource.
// Parameter shareTo should be an item in the ShareToEnum variable.
function shareImage(image, thumb, shareTo) {
    var message = new WXMediaMessage();
    message.setThumbImage(thumb.ios);
    //imageSource -> NSData
    var data = UIImageJPEGRepresentation(image.ios, 1.0);
    // assign the NSData to the WXImageObject
    var ext = new WXImageObject();
    ext.imageData = data;
    message.mediaObject = ext;
    var req = new SendMessageToWXReq();
    req.bText = false;
    req.scene = shareTo;
    req.message = message;
    return WXApi.sendReq(req);
}
exports.shareImage = shareImage;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2VjaGF0LXNoYXJlLmlvcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIndlY2hhdC1zaGFyZS5pb3MudHMiXSwibmFtZXMiOlsiTXlXWEFwaURlbGVnYXRlIiwiTXlXWEFwaURlbGVnYXRlLmNvbnN0cnVjdG9yIiwiTXlXWEFwaURlbGVnYXRlLm9uUmVxIiwiTXlXWEFwaURlbGVnYXRlLm9uUmVzcCIsIk15V1hBcGlEZWxlZ2F0ZS5zZXRPblJlc3BDYWxsQmFjayIsInJlZ2lzdGVyQXBwIiwicmVnaXN0ZXJPblJlc3BDYWxsYmFjayIsImlzV2VjaGF0SW5zdGFsbGVkIiwiaXNWZXJzaW9uU3VwcG9ydGVkIiwic2hhcmVVcmwiLCJzaGFyZVRleHQiLCJzaGFyZUltYWdlIl0sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHFGQUFxRjtBQUNyRjtJQUErQkEsbUNBQVFBO0lBQXZDQTtRQUErQkMsOEJBQVFBO0lBYXZDQSxDQUFDQTtJQVRDRCwrQkFBS0EsR0FBTEEsVUFBTUEsR0FBWUE7UUFDZEUsa0JBQWtCQTtJQUN0QkEsQ0FBQ0E7SUFDREYsZ0NBQU1BLEdBQU5BLFVBQU9BLElBQWNBO1FBQ25CRyxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQTtJQUM5QkEsQ0FBQ0E7SUFDREgsMkNBQWlCQSxHQUFqQkEsVUFBa0JBLFlBQWlCQTtRQUNqQ0ksSUFBSUEsQ0FBQ0EsUUFBUUEsR0FBR0EsWUFBWUEsQ0FBQ0E7SUFDL0JBLENBQUNBO0lBWGFKLDZCQUFhQSxHQUFHQSxDQUFDQSxhQUFhQSxDQUFDQSxDQUFDQTtJQVloREEsc0JBQUNBO0FBQURBLENBQUNBLEFBYkQsRUFBK0IsUUFBUSxFQWF0QztBQUNELHNDQUFzQztBQUMzQix1QkFBZSxHQUFHLElBQUksZUFBZSxFQUFFLENBQUM7QUFDbkQsZ0VBQWdFO0FBQ3JELG1CQUFXLEdBQUc7SUFDckIsSUFBSSxFQUFFLGNBQWM7SUFDcEIsUUFBUSxFQUFFLGVBQWU7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