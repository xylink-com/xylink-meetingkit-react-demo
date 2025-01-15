import { XYMeetingKitComp, uiMeetingKit, XYShow, XYMeetingEventKey } from '@xylink/meetingkit';
import { XYRTCClient } from '@xylink/xy-rtc-sdk';
import { MeetingState } from './index.type';
import { useRef, useState } from 'react';
import { ACCOUNT, SERVER } from '../../utils/config';
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

    const {
      extUserId = '',
      meetingName = '',
      meeting = '',
      meetingPassword = '',
      muteAudio = false,
      muteVideo = false,
    } = user;
    const displayName = meetingName || '测试用户';

    client.current = await uiMeetingKit.createClient({
      clientId: ACCOUNT.clientId,
      clientSecret: ACCOUNT.clientSecret,
      extId: ACCOUNT.extId,
      server: SERVER,
      extUserId  // 三方账号id, 用于三方账号登录，如果使用其他登录方式，则无需传此值，可通过client调用其他登录方法
    });

    uiMeetingKit.on(XYMeetingEventKey.DISCONNECTED, disconnected);

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
      <div className='w-full h-full'>
        <XYMeetingKitComp visible={meetingState === MeetingState.Meeting} />
      </div>
    </div>
  );
}

export default App;
