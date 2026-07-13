import { XYMeetingKitComp, uiMeetingKit, XYShow, XYMeetingEventKey, LOGIN_TYPE, XYMessage } from '@xylink/meetingkit';
import { XYRTCClient } from '@xylink/xy-rtc-sdk';
import { MeetingState } from './index.type';
import { useRef, useState } from 'react';
import { ACCOUNT, SERVER } from '../../utils/config';
import {
  applyMeetingKitCustomization,
  footerCustomButtons,
  getMeetingControlUrl,
} from '../../utils/customization';
// 定制见 src/utils/customization.ts；API 见 docs/customization.md
import { IUser } from '../../type/index.type';
import store from '../../utils/store';
import { DEFAULT_LOCAL_USER } from '../../utils/enum';
import Login from './component/login';

function App() {
  const [meetingState, setMeetingState] = useState(MeetingState.Login);
  const [user, setUser] = useState<IUser>(store.get('xy-user') || DEFAULT_LOCAL_USER);
  const client = useRef<XYRTCClient | null>(null);

  const onChangeUser = (value: any, type: string) => {
    const users = { ...user, [type]: value };

    store.set('xy-user', users);
    setUser(users);
  };

  const join = async () => {
    setMeetingState(MeetingState.Meeting);
    const { server = SERVER, clientId: cid, clientSecret: cse, extId: eId, layoutMode } = uiMeetingKit.getSettingConfig();
    const extId = eId || ACCOUNT.extId;
    const clientId = cid || ACCOUNT.clientId;
    const clientSecret = cse || ACCOUNT.clientSecret;

    applyMeetingKitCustomization();

    const rtcClient = await uiMeetingKit.createClient({
      clientId,
      clientSecret,
      extId,
      server,
      layout: layoutMode,
      meetingControlUrl: getMeetingControlUrl(),
    });
    client.current = rtcClient;

    uiMeetingKit.on(XYMeetingEventKey.DISCONNECTED, disconnected);

    /**
     * 重要提示
     * 重要提示
     * 重要提示
     * 第三方登录，请在config配置文件里面配置企业账户信息
     * 重要提示
     * 重要提示
     * 重要提示
     */
    const { EXTERNAL, AUTH_CODE, XY, THIRD_XY, THIRD_TOKEN } = LOGIN_TYPE;
    const {
      extUserId = '',
      meetingName = '',
      meeting = '',
      meetingPassword = '',
      muteAudio = false,
      muteVideo = false,
      authCode = '',
      isTempUser = false,
      channelId = '',
      loginType = LOGIN_TYPE.EXTERNAL,
    } = user;
    const displayName = meetingName || '测试用户';
    const pwd = user.password || '';
    let account = user.phone || '';

    try {
      switch (loginType) {
        case EXTERNAL:
          // 三方账号登录
          await rtcClient.loginExternalAccount({
            extId,
            extUserId,
            authCode,
            displayName,
            tempUser: isTempUser,
          });
          break;
        case AUTH_CODE:
          // 建行授权码登录
          await rtcClient.loginWithAuthCode({
            displayName,
            extId,
            extUserId,
            oauthCode: authCode,
            isTempUser,
            channelId,
          });
          break;
        case XY:
          // 小鱼登录
          await rtcClient.loginXYlinkAccount(account, pwd);
          break;
        case THIRD_XY: {
          // 三方账号统一认证登录-小鱼账号登录
          const accountArr = account.split('-');
          const countryCode = accountArr.length > 1 ? accountArr[0] : '+86';

          account = accountArr[accountArr.length - 1];

          await rtcClient.loginXYAccount({
            countryCode: countryCode,
            account,
            password: pwd,
          });
          break;
        }
        case THIRD_TOKEN:
          // Token登录
          await rtcClient.loginExtToken({
            authCode,
          });
          break;
      }
    } catch (err: any) {
      const { msg = '' } = err || {};

      if (msg) {
        XYMessage.info(msg);
      }

      console.warn('login error: ', err);

      setMeetingState(MeetingState.Login);
      return Promise.reject(err);
    }

    // 用户手势触发入会时，makeCall 前解锁浏览器远端音频播放
    await rtcClient.playAudio();

    await uiMeetingKit.makeCall({
      confNumber: meeting,
      password: meetingPassword,
      displayName,
      muteAudio,
      muteVideo,
    });
  };

  const disconnected = async (data: any) => {
    console.log('disconnected:::::', data);
    uiMeetingKit.removeAllListener();
    setMeetingState(MeetingState.Login);
  };

  return (
    <div className="w-full h-full" id="container">
      {/* 加入会议 */}
      <XYShow is={meetingState === MeetingState.Login}>
        <div className="absolute left-0 top-0 w-full h-full z-10">
          <Login user={user} onChangeInput={onChangeUser} onHandleSubmit={join}></Login>
        </div>
      </XYShow>

      {/* 会中 */}
      <div className="w-full h-full">
        <XYMeetingKitComp
          visible={meetingState === MeetingState.Meeting}
          footerCustomButtons={footerCustomButtons}
        />
      </div>
    </div>
  );
}

export default App;
