# XYLINK WEBRTC MEETINGKIT REACT SDK

小鱼易连 WebRTC MeetingKit React 集成 Demo（供三方参考）。

技术栈：React + TypeScript + Vite + Tailwind

当前依赖版本：`@xylink/meetingkit@4.0.10`、`@xylink/xy-rtc-sdk@4.0.10`

## 准备工作

在 `src/utils/config.ts` 中配置企业账号：

- `clientId`
- `clientSecret`
- `extId`
- `SERVER`

Demo 默认提供一组测试账号，仅限联调，正式环境请替换为自己的企业信息。

## 安装与运行

推荐使用 **yarn**，从外网 npm 安装：

```bash
yarn install
yarn dev
```

浏览器打开终端提示的本地地址（默认 `http://localhost:5173/`）。

## 界面定制

1. 直接编辑 [`src/utils/customization.ts`](./src/utils/customization.ts) 中的各项配置  
2. 刷新页面后 **重新入会**
3. API 与调用时机见 [界面定制](./docs/customization.md)

当前 Demo 已接入（与代码一致）：

| 能力 | 集成位置 | 怎么验 |
|------|----------|--------|
| 主题色换肤 | `setTheme({ colorPrimary: '#49A681' })` | 会中主色绿；主持人「更多」→「专业会控」验会控 |
| IM | `enableIM: false` | 公有云默认关；改为 `true` 可验 IM 换肤 |
| 标签页标题 | `setUiConfig({ tabTitle })` | 浏览器标题为「我的会议」 |
| 会议信息 / 邀请文案 | `meetingInfoUi` / `inviteUi` | 小「i」、邀请弹框链接标签为「我的会议入会链接」 |
| 关于页小鱼 logo | `about.showLogo: false` | 设置→关于：无小鱼 logo |
| 快捷键隐藏 | `hotkey: false` | 设置中无快捷键 |
| 呼叫页声音取消 | `enableBgmAudio: false` | 呼叫等待页无背景音乐 |
| 共享抢占 | `enableConflictContent: false` | 他人共享时不可强共享 |
| 隐藏录制 | `enableMeetingRecord: false` | 会中无「录制」；会控侧需会控配置配合 |
| 底部工具栏 | `footerCustomButtons` → invite `order: 0` | 仅调整邀请按钮排序（内置按钮改 `label` 不生效，见文档合并规则） |
| 一键接听 | `playAudio`（`app/index.tsx`） | 入会前已调用；见 docs |
| 专业会控壳页 | `meetingControlUrl` + `#/host` | 主持人打开专业会控 |

入会流程关键顺序：

`applyMeetingKitCustomization()` → `createClient`（含 `meetingControlUrl`）→ 登录 → `playAudio` → `makeCall`

专业会控壳页路由：`#/host`（`XYMeetingControlHostComp`），主持人在参会者侧栏「更多」→「专业会控」打开。

## 官方文档

- [WebRTC SDK](https://openapi.xylink.com/common/meeting/doc/version?platform=web)
- [MeetingKit](https://openapi.xylink.com/common/meetingkit/doc/description?platform=web)
