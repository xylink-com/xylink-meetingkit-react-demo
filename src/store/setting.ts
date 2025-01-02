import { SettingConfig, XYMeetingKitResource } from '@xylink/meetingkit';
import { create } from 'zustand';

export interface ISettingOptions {
  setting: SettingConfig;
  setSetting: (options: any) => void;
}

export const useSetting = create<ISettingOptions>((set) => ({
  setting: XYMeetingKitResource.getSettingConfig(),

  setSetting: (options: any) =>
    set((state) => {
      const mergeSetting = { ...state.setting, ...options };
      return { setting: mergeSetting };
    }),
}));
