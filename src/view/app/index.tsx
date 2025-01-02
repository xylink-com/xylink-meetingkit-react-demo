import { XYMeetingKitComp, uiMeetingKit, XYShow, XYMeetingEventKey } from '@xylink/meetingkit';
import { XYRTCClient } from '@xylink/xy-rtc-sdk';
import { MeetingState } from './index.type';
import { useRef, useState } from 'react';
import { ACCOUNT } from '../../utils/config';
import { IUser } from '../../type/index.type';
import store from '../../utils/store';
import { DEFAULT_LOCAL_USER } from '../../utils/enum';
// import { useSetting } from '../../store/setting';
import Login from './component/login';

function App() {
  const [meetingState, setMeetingState] = useState(MeetingState.Login);
  const [user, setUser] = useState<IUser>(store.get('xy-user') || DEFAULT_LOCAL_USER);
  // const [setting] = useSetting((state) => [state.setting, state.setSetting]);
  const [settingVisible, setSettingVisible] = useState(false);

  const client = useRef<XYRTCClient | null>(null);

  const onChangeUser = (value: any, type: string) => {
    const users = { ...user, [type]: value };

    store.set('xy-user', users);
    setUser(users);
  };

  const onToggleSetting = () => {
    setSettingVisible(!settingVisible);
  };

  const join = async () => {
    setMeetingState(MeetingState.Meeting);

    client.current = await uiMeetingKit.createClient({
      clientId: ACCOUNT.clientId,
      clientSecret: ACCOUNT.clientSecret,
      extId: ACCOUNT.extId,
    });

    uiMeetingKit.on(XYMeetingEventKey.DISCONNECTED, disconnected);

    await client.current.loginExternalAccount({
      extUserId: '11111',
      displayName: 'web',
    });

    await uiMeetingKit.makeCall({
      confNumber: '',
      password: '',
      displayName: '测试MK',
      // 入会是否是自动静音
      muteAudio: false,
      // 入会是否是关闭摄像头
      muteVideo: false,
    });
  };

  const disconnected = async () => {
    uiMeetingKit.removeAllListener();
    setMeetingState(MeetingState.Login);
  };

  return (
    <div className="w-full h-full">
      {/* 加入会议 */}
      <XYShow is={meetingState === MeetingState.Login}>
        <Login
          // server={setting.server}
          // loginType={setting.loginType}
          user={user}
          onChangeInput={onChangeUser}
          onHandleSubmit={join}
          onToggleSetting={onToggleSetting}
        ></Login>
      </XYShow>

      {/* 会中 */}
      <XYShow is={meetingState !== MeetingState.Login}>
        <XYMeetingKitComp />
      </XYShow>
    </div>
  );
}

export default App;
