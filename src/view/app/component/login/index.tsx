/**
 * 加入会议
 */
import { Row, Form, Checkbox } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { IUser } from '../../../../type/index.type';
import { THIRD, SERVER } from '../../../../utils/config';
import { XYHeader } from '../header';
import { LOGIN_TYPE, XYButton, XYCheckbox, XYInput } from '@xylink/meetingkit';
import { LOGIN_TYPE_MAP } from '../../../../utils/enum';

interface IProps {
  user: IUser;
  loginType?: LOGIN_TYPE;
  server?: string;
  onHandleSubmit: () => Promise<void>;
  onChangeInput: (value: string | boolean, key: string) => void;
  onToggleSetting: () => void;
}

const Login = (props: IProps) => {
  const {
    server = SERVER,
    loginType = THIRD ? LOGIN_TYPE.EXTERNAL : LOGIN_TYPE.XY,
    user,
    onChangeInput,
    onHandleSubmit,
    onToggleSetting,
  } = props;

  const { title, menu } = LOGIN_TYPE_MAP[loginType] || LOGIN_TYPE_MAP[LOGIN_TYPE.XY];

  return (
    <>
      <XYHeader></XYHeader>

      <div className="w-full h-full pb-24 pt-24 overflow-auto">
        <div className="w-[340px] m-auto" style={{ width: '340px' }}>
          <div>
            <div className="text-7xl text-xy_t3 text-center mb-10">
              加入会议
              <div className="text-7xs mt-1">
                ({server} - {title})
              </div>
            </div>

            <Row justify="center">
              <Form onFinish={onHandleSubmit} className="w-full" initialValues={user}>
                {
                  // 第三方没有账户登录的权限，自动隐藏
                  // 第三方入会只需要填写会议号、会议号入会密码、入会昵称即可
                  menu.extUserId && (
                    <Form.Item name="extUserId" className="pb-3 mb-0">
                      <XYInput
                        // type="extUserId"
                        placeholder="请输入第三方用户ID"
                        onChange={(e) => {
                          onChangeInput(e.target.value, 'extUserId');
                        }}
                      />
                    </Form.Item>
                  )
                }

                {menu.authCode && (
                  <Form.Item name="authCode" className="pb-3 mb-0">
                    <XYInput
                      // type="authCode"
                      placeholder="请输入授权码"
                      onChange={(e) => {
                        onChangeInput(e.target.value, 'authCode');
                      }}
                    />
                  </Form.Item>
                )}
                {menu.channelId && (
                  <Form.Item name="channelId" className="pb-3 mb-0">
                    <XYInput
                      // type="channelId"
                      placeholder="请输入渠道id"
                      onChange={(e) => {
                        onChangeInput(e.target.value, 'channelId');
                      }}
                    />
                  </Form.Item>
                )}
                {menu.phone && (
                  <>
                    <Form.Item
                      name="phone"
                      rules={[{ required: false, message: '请输入用户账号' }]}
                      className="pb-3 mb-0"
                    >
                      <XYInput
                        // type="phone"
                        placeholder="输入小鱼账号"
                        onChange={(e) => {
                          onChangeInput(e.target.value, 'phone');
                        }}
                      />
                    </Form.Item>
                    <Form.Item
                      name="password"
                      rules={[{ required: true, message: '请输入账号密码' }]}
                      className="pb-3 mb-0"
                    >
                      <XYInput
                        type="text"
                        placeholder="输入密码"
                        autoComplete="off"
                        onChange={(e) => {
                          onChangeInput(e.target.value, 'password');
                        }}
                      />
                    </Form.Item>
                  </>
                )}
                <Form.Item
                  name="meeting"
                  rules={[{ required: true, message: '请输入云会议室号或终端号' }]}
                  className="pb-3 mb-0"
                >
                  <XYInput
                    type="text"
                    placeholder="输入云会议室号或终端号"
                    autoComplete="off"
                    onChange={(e) => {
                      onChangeInput(e.target.value, 'meeting');
                    }}
                  />
                </Form.Item>
                <Form.Item
                  name="meetingPassword"
                  getValueFromEvent={(event) => {
                    const value = event.target.value.trim();
                    const temp = value.replace(/[^0-9]/gi, '');

                    return temp;
                  }}
                  className="pb-3 mb-0"
                >
                  <XYInput
                    type="text"
                    placeholder="入会密码"
                    autoComplete="off"
                    onChange={(e) => {
                      onChangeInput(e.target.value, 'meetingPassword');
                    }}
                  />
                </Form.Item>

                <Form.Item
                  name="meetingName"
                  rules={[{ required: true, message: '请输入会议中显示的名称' }]}
                  className="pb-3 mb-0"
                >
                  <XYInput
                    type="text"
                    placeholder="输入会议中显示的名称"
                    autoComplete="off"
                    onChange={(e) => {
                      onChangeInput(e.target.value, 'meetingName');
                    }}
                  />
                </Form.Item>

                {menu.tempUser && (
                  <Form.Item name="isTempUser" className="pb-3 mb-0">
                    <Checkbox
                      checked={user.isTempUser}
                      onChange={(e) => {
                        onChangeInput(e.target.checked, 'isTempUser');
                      }}
                    >
                      临时用户
                    </Checkbox>
                  </Form.Item>
                )}

                <XYButton type="primary" size="large" htmlType="submit" className="w-full mb-5">
                  加入会议
                </XYButton>

                <Form.Item name="muteVideo" style={{ marginBottom: '4px' }}>
                  <XYCheckbox
                    checked={user.muteVideo}
                    onChange={(e) => {
                      onChangeInput(e.target.checked, 'muteVideo');
                    }}
                  >
                    入会时关闭摄像头
                  </XYCheckbox>
                </Form.Item>

                <Form.Item name="muteAudio">
                  <XYCheckbox
                    checked={user.muteAudio}
                    onChange={(e) => {
                      onChangeInput(e.target.checked, 'muteAudio');
                    }}
                  >
                    入会时静音
                  </XYCheckbox>
                </Form.Item>
              </Form>
            </Row>

            <div className="xy-center text-7sm text-xy_t3 mt-8 cursor-pointer hover:text-xy_b1">
              <span onClick={onToggleSetting}>
                设置
                <SettingOutlined style={{ marginLeft: '2px' }} />
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0  bg-[#393946] w-full p-2 text-center text-7xs text-xy_t11">
        <a
          className="hover:text-xy_t7"
          rel="noopener noreferrer"
          target="_blank"
          href="https://openapi.xylink.com/common/meeting/doc/description?platform=web"
        >
          小鱼易连WebRTC SDK开发文档
        </a>
      </div>
    </>
  );
};

export default Login;