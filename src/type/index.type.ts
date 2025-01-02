/**
 * Type interface
 * @authors Luo-jinghui (luojinghui424@gmail.com)
 * @date  2020-04-01 17:46:13
 */

import { DEFAULT_LOCAL_USER } from '../utils/enum';

export enum MeetingState {
  Login,
  Meeting,
}

export type IUser = Partial<typeof DEFAULT_LOCAL_USER>;
