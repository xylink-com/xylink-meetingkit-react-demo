import { LOGIN_TYPE } from '@xylink/meetingkit';

export const DEFAULT_LOCAL_USER = {
  phone: '',
  password: '',
  meeting: '',
  meetingPassword: '',
  meetingName: '',
  muteVideo: false,
  muteAudio: false,
  extUserId: '',
  authCode: '',
  channelId: '',
  isTempUser: false,
};

/**
 * 登录方式
 */
export const LOGIN_TYPE_MAP: Partial<Record<LOGIN_TYPE, any>> = {
  [LOGIN_TYPE.XY]: { title: '小鱼账号登录', menu: { phone: true } },
  [LOGIN_TYPE.EXTERNAL]: {
    title: '三方账号登录',
    menu: { extUserId: true, authCode: true, tempUser: true },
  },
  [LOGIN_TYPE.AUTH_CODE]: {
    title: '建行授权码登录',
    menu: { extUserId: true, authCode: true, channelId: true, tempUser: true },
  },
  [LOGIN_TYPE.THIRD_XY]: {
    title: '三方-小鱼账号登录',
    menu: { phone: true },
  },
  [LOGIN_TYPE.THIRD_TOKEN]: {
    title: '三方-token登录',
    menu: { authCode: true },
  },
};
