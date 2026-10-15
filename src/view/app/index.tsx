import { XYMeetingKitComp, uiMeetingKit, XYShow, XYMeetingEventKey, LOGIN_TYPE, XYMessage } from '@xylink/meetingkit';
import { MeetingState } from './index.type';
import { useEffect, useRef, useState } from 'react';
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
  const joinAttempt = useRef(0);
  const joinPending = useRef(false);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    const disconnected = () => {
      // 使仍在初始化或登录中的旧流程失效，禁止取消后继续呼叫。
      joinAttempt.current += 1;
      setMeetingState(MeetingState.Login);
    };
    uiMeetingKit.on(XYMeetingEventKey.DISCONNECTED, disconnected);
    return () => {
      joinAttempt.current += 1;
      uiMeetingKit.off(XYMeetingEventKey.DISCONNECTED, disconnected);
    };
  }, []);

  const onChangeUser = (value: any, type: string) => {
    const users = { ...user, [type]: value };

    store.set('xy-user', users);
    setUser(users);
  };

  const join = async () => {
    if (joinPending.current) return;
    joinPending.current = true;
    setJoining(true);
    const attempt = ++joinAttempt.current;
    const isCurrentAttempt = () => attempt === joinAttempt.current;
    setMeetingState(MeetingState.Meeting);
    try {
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
      if (!isCurrentAttempt()) return;

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
      if (!isCurrentAttempt()) return;
      // makeCall 前解锁浏览器远端音频播放。
      await rtcClient.playAudio();
      if (!isCurrentAttempt()) return;

      await uiMeetingKit.makeCall({
        confNumber: meeting,
        password: meetingPassword,
        displayName,
        muteAudio,
        muteVideo,
      });
    } catch (err: unknown) {
      if (!isCurrentAttempt()) return;
      const message = typeof err === 'string'
        ? err
        : (err as { msg?: string; message?: string } | null)?.msg
          || (err as Error | null)?.message
          || '初始化或加入会议失败，请检查配置后重试';
      XYMessage.info(message);
      setMeetingState(MeetingState.Login);
    } finally {
      joinPending.current = false;
      setJoining(false);
    }
  };

  return (
    <div className="w-full h-full" id="container">
      {/* 加入会议 */}
      <XYShow is={meetingState === MeetingState.Login}>
        <div className="absolute left-0 top-0 w-full h-full z-10">
          <Login user={user} joining={joining} onChangeInput={onChangeUser} onHandleSubmit={join}></Login>
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
