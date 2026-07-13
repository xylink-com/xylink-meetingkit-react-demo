/**
 * MeetingKit 界面定制示例（三方可复制本文件）
 *
 * 调用时机：createClient 之前执行 applyMeetingKitCustomization()
 * footerCustomButtons：传给 <XYMeetingKitComp />（仅 PC）
 * meetingControlUrl：createClient 时传入，配合 #/host 壳页支持专业会控换肤
 *
 * API 详解：docs/customization.md
 */
import { uiMeetingKit, type XYCustomButtonConfig } from '@xylink/meetingkit';

/** createClient 前调用 */
export function applyMeetingKitCustomization() {
  // 功能显隐
  uiMeetingKit.setFeatureVisible({
    enableIM: false, // 公有云通常关闭；验 IM 换肤时可改为 true
    enableMultiLayoutPolling: true,
    enableConflictContent: false, // false：他人共享时不允许强共享
    enableMeetingRecord: false, // 隐藏会中「录制」；会控侧需会控配置配合
    enableBgmAudio: false, // 关闭呼叫页背景音乐
  });

  // 设置：隐藏快捷键；关于页隐藏小鱼 Logo / 版本日志 / SDK 驱动行
  uiMeetingKit.setSettingConfig({
    appearanceMode: 'light',
    settingMenu: {
      hotkey: false,
      about: {
        showLogo: false,
        showVersionLog: false,
        showSdkDriverLine: false,
      },
      feedback: {
        showDownloadLog: false,
        showDebug: false,
      },
      common: {
        appearanceSetting: false,
        speakerName: true,
        isLowResolution: true,
      },
    },
  });

  // 主题色（会中 + 专业会控；IM 需 enableIM）
  uiMeetingKit.setTheme({
    colorPrimary: '#49A681',
    displayMode: 'light',
  });

  // 标签页 / 会议信息 / 邀请文案
  uiMeetingKit.setUiConfig({
    tabTitle: '我的会议',
    meetingInfoUi: {
      conferenceLink: {
        show: true,
        label: '我的会议入会链接',
      },
    },
    inviteUi: {
      headline: { value: '邀请您加入会议' },
      conferenceNumber: { label: '会议号', show: true },
      conferenceLink: {
        show: true,
        label: '我的会议入会链接',
      },
      hardwareSectionLabel: '客户端与终端入会方式',
      showCopyInviteButton: true,
    },
    recordUi: {
      cloudRecordCompleteTip: '云录制已完成，请在录制中心查看',
    },
  });

  uiMeetingKit.setLocale('zh_CN');
}

/** 专业会控壳页地址（与 XYMeetingControlHostComp 路由 #/host 同源） */
export function getMeetingControlUrl() {
  return `${window.location.origin}${window.location.pathname}#/host`;
}

/**
 * 会中底部工具栏自定义（仅 PC），传给 <XYMeetingKitComp />
 *
 * 对内置按钮：仅 order / priority / defaultHidden / show 等会生效；
 * 单独改 label / icon 不会改变界面文案（组件内用 i18n），详见 docs 合并规则。
 */
export const footerCustomButtons: XYCustomButtonConfig[] = [
  {
    key: 'invite',
    order: 0,
  },
];
