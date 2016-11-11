import * as wechatPlugin from "nativescript-wechat-share";

@JavaProxy(".wxapi.WXEntryActivity")
class WXEntryActivity extends android.app.Activity  implements com.tencent.mm.sdk.openapi.IWXAPIEventHandler {

    public onCreate(bundle): void {
        super.onCreate(bundle);
        try {
            wechatPlugin.handleIntent(this.getIntent(), this);
        }
        catch (e) {
            console.log(e);
        }
    }

    public onReq(req): void {
        console.log("on request ", req);
    }

    public onResp(resp): void {
        wechatPlugin.doCallBack(resp.errCode);
        this.finish();
    }

    public onNewIntent(intent): void {
        super.onNewIntent(intent);
        this.setIntent(intent);
        wechatPlugin.handleIntent(intent, this);
    }
};
