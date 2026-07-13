# 界面定制

MeetingKit 提供了灵活的界面定制能力，允许第三方开发者根据业务需求显示或隐藏特定功能、自定义底部工具栏按钮以及重写部分界面样式。本文档详细介绍了主要的界面定制方式。

> 下文统一使用 `uiMeetingKit`（等价于 `XYMeetingKit.getInstance()`）。配置项类型由 `@xylink/meetingkit` 导出，请以您所安装版本的类型声明为准。
>
> **版本标注**：文中 **v4.0.10+** 表示自 MeetingKit v4.0.10 起新增或调整的能力；未标注项在 v4.0.9 及此前已存在。
>
> **本仓库 Demo**：可参考 `src/utils/customization.ts`，各项配置直接写在 `applyMeetingKitCustomization` / `footerCustomButtons` 中，按需改值后刷新并重新入会。

## 集成时机


| 能力                    | 方法说明                                            | 调用时机                                                      | 备注                                             |
| --------------------- | ----------------------------------------------- | --------------------------------------------------------- | ---------------------------------------------- |
| `setFeatureVisible`   | 显示或隐藏会中功能模块（聊天、白板、录制等）                          | `createClient` 之前                                         | —                                              |
| `setBgmAudioConfig`   | 配置呼叫页背景音乐（音源、音量、是否播放）                           | `createClient` 之前                                         | v4.0.10+；替代 `createClient({ bgmAudioConfig })` |
| `setSettingConfig`    | 控制设置侧栏 Tab 及页内细项显隐                              | `createClient` 之前                                         | `appearanceMode`、`settingMenu` 及细项对象为 v4.0.10+ |
| `setUiConfig`         | 定制会议信息/邀请界面、标签页                                 | `createClient` 之前                                         | v4.0.10+                                       |
| `setTheme`            | 设置主题色与亮暗模式                                      | `createClient` 之前                                         | v4.0.10+；替代会中换肤用的 `useTheme`                   |
| `setLocale`           | 设置 MeetingKit 界面语言（`zh_CN` / `en_US` / `zh_TW`） | `createClient` 之前                                         | —                                              |
| `footerCustomButtons` | 自定义会中底部工具栏按钮（增删改、排序）                            | 渲染 `XYMeetingKitComp` 时传入（仅 PC 生效）                        | —                                              |
| `playAudio`           | 在用户手势后解锁浏览器远端音频播放                               | 用户触发入会的点击/触摸等手势回调中，`makeCall` 之前（需已渲染 `XYMeetingKitComp`） | —                                              |


**使用示例**

```ts
import { uiMeetingKit } from '@xylink/meetingkit';

// 1. 界面定制（createClient 前）
uiMeetingKit.setFeatureVisible({ enableIM: false, enableBgmAudio: false });
uiMeetingKit.setSettingConfig({ settingMenu: { hotkey: false } });
uiMeetingKit.setTheme({ colorPrimary: '#49A681' });
uiMeetingKit.setUiConfig({ tabTitle: '我的会议' });
uiMeetingKit.setLocale('zh_CN');

// 2. 创建客户端
await uiMeetingKit.createClient({ /* clientId, clientSecret, extId, server, meetingControlUrl */ });

// 3. 渲染 XYMeetingKitComp（makeCall 前），定制底部按钮
// <XYMeetingKitComp visible={...} footerCustomButtons={...} />

// 4. 登录 → 用户手势触发入会时：playAudio（推荐）→ makeCall
await uiMeetingKit.getClient()?.loginExternalAccount({ extUserId: '…', displayName: '…' });
await uiMeetingKit.getClient()?.playAudio();
await uiMeetingKit.makeCall({ confNumber: '…', displayName: '…' });
```

## 功能可见性控制

通过 `setFeatureVisible` 方法可以动态显示或隐藏特定功能模块。

**使用示例**

> 请在 `uiMeetingKit.createClient()` 之前调用此方法。

```ts
import { uiMeetingKit } from '@xylink/meetingkit';

uiMeetingKit.setFeatureVisible({
  enableIM: false // 隐藏聊天功能
});
```

**支持隐藏的功能键名**


| 功能键名                     | 说明         | 默认值   | 备注                                                                                         |
| ------------------------ | ---------- | ----- | ------------------------------------------------------------------------------------------ |
| enablePip                | 画中画        | true  | —                                                                                          |
| enableFullScreen         | 全屏         | true  | v4.0.10+                                                                                   |
| enableVirtualBackground  | 虚拟背景       | false | —                                                                                          |
| enableIM                 | 聊天         | true  | 公有云暂不支持，需手动设置为 `false`                                                                     |
| enableAICopilot          | AI 助手      | false | v4.0.10+；仅 PC 展示；当前版本暂不支持完整能力                                                             |
| enableWhiteboard         | 白板         | true  | —                                                                                          |
| enableAnnotation         | 批注         | true  | —                                                                                          |
| enableVersionInfo        | 显示版本信息     | true  | v4.0.10+ 废弃，由 `setSettingConfig({ settingMenu: { about: { showVersionLog: false } } })` 控制 |
| enableShareContent       | 分享内容       | true  | —                                                                                          |
| enableInvite             | 邀请         | true  | —                                                                                          |
| enableConferenceLink     | 会议链接       | true  | —                                                                                          |
| enableTranscription      | 文字转写       | true  | v4.0.10+；仅 PC 展示；需会议侧开通转写能力                                                                |
| enableMultiLayoutPolling | 多画面 / 轮询   | true  | v4.0.10+                                                                                   |
| enableConflictContent    | 是否允许共享屏幕抢占 | true  | v4.0.10+；对齐 Android `MeetingKitUiConfig.enableConflictContent`：`false` 他人共享时不允许强共享；`true` 可抢发（弹窗提醒） |
| enableMeetingRecord      | 会中「录制」按钮   | true  | v4.0.10+；仅控制终端会中入口，会控侧录制入口需会控配置配合隐藏 |
| enablePageLeaveConfirm   | 关闭页面前确认    | true  | v4.0.10+                                                                                   |
| enableBgmAudio           | 呼叫页背景音乐    | true  | v4.0.10+                                                                                   |


### 共享屏幕抢占（对齐 Android）

```ts
// false：他人共享时不允许强共享（弹窗后不可抢）
// true：与小鱼默认一致，弹窗提醒后可抢发
uiMeetingKit.setFeatureVisible({ enableConflictContent: false });
```

### 隐藏会中录制

```ts
uiMeetingKit.setFeatureVisible({ enableMeetingRecord: false });
```

会控侧「录制」入口不在 MeetingKit 终端 `setFeatureVisible` 范围内，需另行配置会控。


## 底部按钮自定义配置

MeetingKit 提供会中底部工具栏（Footer）的自定义能力，可通过 `footerCustomButtons` 增删改默认按钮、调整排序与显隐，或接入业务自定义操作。

> **平台限制**：`footerCustomButtons` **仅 PC 端生效**；移动端始终使用内置默认底部栏，传入的配置会被忽略。

**典型用途**

1. **新增按钮** — 接入客服、反馈等业务操作
2. **调整布局** — 修改 `order`、`priority`、`defaultHidden`，控制排序与「更多」收纳
3. **隐藏按钮** — `show: false` 移除不需要的默认按钮
4. **替换行为** — 传 `onClick` 或 `component` 覆盖默认交互（见[合并规则](#合并规则)）
5. **条件显隐** — 在父组件用 `useMemo` 根据角色、状态动态生成配置数组

### 实现方法

向 `XYMeetingKitComp` 传入 `footerCustomButtons` 数组即可（须在 `createClient` 之后、会中渲染时生效）：

```tsx
import { XYMeetingKitComp, XYButtonPosition, XYButtonPriority } from '@xylink/meetingkit';

<XYMeetingKitComp visible={visible} footerCustomButtons={customButtons} />;
```

类型由 `@xylink/meetingkit` 导出：`XYCustomButtonConfig`、`XYButtonPosition`、`XYButtonPriority`。

### 配置参数

`XYCustomButtonConfig` 在 `XYButtonConfig` 基础上将 `order` 改为可选，常用字段如下：


| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| `key` | `string` | **必填**。唯一标识；与默认按钮 `key` 相同时合并/覆盖该按钮 |
| `label` | `string \| ReactNode` | 按钮文案；配合 `onClick` 用于新按钮或替换内置按钮的展示 |
| `icon` | `string \| ReactNode` | 按钮图标名或自定义节点；用法同 `label` |
| `position` | `XYButtonPosition` | 区域：`LEFT` / `MIDDLE`（默认）/ `RIGHT`；覆盖或隐藏内置按钮时须与默认区域一致 |
| `order` | `number` | 排序权重，**数值越小越靠前**；支持 `0`；未传时新按钮默认为「当前中间区最大 order + 1」 |
| `show` | `boolean` | 为 `false` 时从对应区域移除该按钮 |
| `priority` | `XYButtonPriority` | 中间区宽度不足时的收起优先级（见下表）；支持 `MUST_SHOW`（`0`） |
| `defaultHidden` | `boolean` | 为 `true` 时默认收进「更多」菜单，而非直接展示在工具栏 |
| `className` | `string` | 附加 CSS 类名 |
| `closeParentDialog` | `boolean` | 在「更多」子菜单内点击后是否关闭「更多」弹层；默认 `true`，`layoutSelect` 内置为 `false` |
| `popover` | `XYPopoverProps` | 气泡配置；与 `onClick` 配合用于自定义按钮 |
| `onClick` | `(context?) => void \| Promise<void>` | 点击回调；见[合并规则](#合并规则) |
| `component` | `React.ComponentType` | 自定义 React 组件；传入后完整替换该按钮渲染 |

**`XYButtonPriority` 枚举**（数值越小越不易被收起）


| 枚举值 | 数值 | 说明 |
| ------ | ---- | ---- |
| `MUST_SHOW` | 0 | 不参与宽度不足时的自动收起 |
| `HIGH` | 1 | 高优先级，最后被收起 |
| `MEDIUM` | 2 | 中优先级 |
| `LOW` | 3 | 低优先级，优先被收起 |

中间区按钮按 `order` 排序展示；当容器宽度不足时，先保留 `defaultHidden: true` 的按钮在「更多」内，再按 `priority` 从低到高将工具栏按钮收入「更多」。

### 合并规则

SDK 会将 `footerCustomButtons` 与内置默认按钮按 `key` + `position` 合并，行为如下：

| 场景 | 行为 |
| ---- | ---- |
| **仅传布局/显隐字段**（`order` / `priority` / `defaultHidden` / `show` / `className` / `closeParentDialog`） | **Patch 模式**：保留原内置 `component` 及全部业务逻辑（录制、共享、静音等） |
| **仅传 `label` 或 `icon`**（无 `onClick`、无 `component`） | 保留原内置 `component`；内置组件不读取配置中的 `label`/`icon`，**界面文案不变** |
| **传 `onClick` 且未传 `component`** | 替换为通用 `XYActionButton`；`label`/`icon` 优先取自定义，否则继承原按钮配置；**原内置交互逻辑不再执行** |
| **传 `component`** | 完整替换为该组件；若同时传 `onClick`，以 `component` 为准 |
| **`show: false`** | 从对应 `position` 区域删除该 `key` 的按钮 |
| **新 `key` + `onClick`** | 新增 `XYActionButton` |
| **新 `key` 仅 `label`（无 `onClick`）** | 无法形成有效按钮，不会展示 |

> **注意**
>
> 1. 覆盖或隐藏内置按钮时，`position` 须与[默认按钮](#默认按钮)所在区域一致（如 `invite` 在中间区、`audio`/`video` 在左侧、`endCall` 在右侧）；`position` 写错会导致配置不生效。
> 2. 仅 Patch 元数据**不会**影响内置按钮功能；误传 `onClick` 才会替换为简单点击回调。
> 3. `setFeatureVisible` 控制模块级显隐（如 `enableIM: false`），与 `footerCustomButtons` 独立；两者同时配置时以功能开关为准。

### 默认按钮

**1. 左侧区域（`XYButtonPosition.LEFT`）**


| label | key | order | 说明 |
| ----- | --- | ----- | ---- |
| 静音 / 取消静音 | `audio` | 1 | 始终显示 |
| 开启视频 / 关闭视频 | `video` | 2 | 始终显示 |


**2. 中间区域（`XYButtonPosition.MIDDLE`，默认）**


| label | key | order | priority | defaultHidden | 说明 |
| ----- | --- | ----- | -------- | ------------- | ---- |
| 共享 | `share` | 1 | HIGH | — | 非移动端 |
| 会议录制 | `record` | 2 | MEDIUM | — | 非移动端 |
| 邀请 | `invite` | 3 | LOW | — | 非移动端 |
| 参会者 | `participant` | 4 | HIGH | — | 始终显示 |
| 窗口布局 | `layoutSelect` | 5 | MEDIUM | — | 非移动端 |
| 开启字幕 | `subtitle` | 6 | LOW | — | 非移动端 |
| 文字转写 | `transcription` | 7 | MEDIUM | — | 非移动端；v4.0.10+ |
| AI 助手 | `aiCopilot` | 8 | MEDIUM | — | 非移动端；v4.0.10+ |
| 白板 | `whiteboard` | 9 | MEDIUM | **是** | 非移动端 |
| 批注 | `annotation` | 10 | LOW | **是** | 非移动端 |
| 聊天 | `im` | 11 | MEDIUM | **是** | 非移动端 |
| 设置 | `setting` | 12 | LOW | **是** | 非移动端 |


**3. 右侧区域（`XYButtonPosition.RIGHT`）**


| label | key | order | 说明 |
| ----- | --- | ----- | ---- |
| 结束 | `endCall` | 1 | 非移动端 |


### 配置示例

**新增自定义按钮**

```tsx
const customButtons = [
  {
    key: 'customer-support',
    label: '客服支持',
    icon: 'service', // 内置 SVG 图标名，或传入 ReactNode
    onClick: () => openSupport(),
    order: 0,
    priority: XYButtonPriority.MEDIUM
  }
];

<XYMeetingKitComp visible={visible} footerCustomButtons={customButtons} />;
```

**仅调整排序与「更多」收纳（保留原功能）**

```tsx
const customButtons = [
  { key: 'participant', order: 0, priority: XYButtonPriority.MUST_SHOW },
  { key: 'im', defaultHidden: false, order: 8 } // 将聊天从「更多」提到工具栏
];

<XYMeetingKitComp visible={visible} footerCustomButtons={customButtons} />;
```

**隐藏默认按钮**

```tsx
const customButtons = [
  { key: 'invite', show: false },
  { key: 'annotation', show: false }
];
```

**条件显隐**

```tsx
const footerCustomButtons = useMemo(
  () => [
    { key: 'record', show: isHost }, // 仅主持人显示录制
    { key: 'whiteboard', defaultHidden: !isHost }
  ],
  [isHost]
);

<XYMeetingKitComp visible={visible} footerCustomButtons={footerCustomButtons} />;
```

**用 `onClick` 接管内置按钮（会替换原逻辑，慎用）**

```tsx
const customButtons = [
  {
    key: 'record',
    label: '开始录制',
    onClick: () => startCustomRecord()
  }
];
```

**传入自定义组件**

```tsx
const CustomFeedbackButton = () => <button onClick={openFeedback}>反馈</button>;

const customButtons = [
  {
    key: 'feedback',
    component: CustomFeedbackButton,
    order: 13
  }
];
```

**左侧 / 右侧区域 Patch**

```tsx
const customButtons = [
  { key: 'audio', position: XYButtonPosition.LEFT, order: 0 },
  { key: 'endCall', position: XYButtonPosition.RIGHT, className: 'my-end-call' }
];
```

## 会议信息与邀请弹框（v4.0.10+）

通过 `setUiConfig`（v4.0.10+）定制会议室顶部小「i」信息区、邀请弹层、浏览器标签页及云录制提示语。

> 请在 `uiMeetingKit.createClient()` 之前调用此方法。

**使用示例**

```ts
import { uiMeetingKit } from '@xylink/meetingkit';

uiMeetingKit.setUiConfig({
  tabTitle: '我的会议',
  tabIcon: 'https://your.cdn/favicon.ico',
  logoUrl: 'https://your.cdn/logo.png',
  meetingInfoUi: {
    conferenceLink: {
      label: '入会链接',
      value: 'https://example.com/join/xxx',
      copyText: 'https://example.com/join/xxx'
    }
  },
  inviteUi: {
    headline: { value: '邀请您加入会议' },
    conferenceNumber: { label: '会议号', show: true },
    hardwareSectionLabel: '客户端与终端入会方式',
    phoneDial: { value: '400-xxx-xxxx' },
    showCopyInviteButton: true
  },
  recordUi: {
    cloudRecordCompleteTip: '云录制已完成，请在录制中心查看'
  }
});
```

**常用字段**


| 字段                              | 说明                        | 备注       |
| ------------------------------- | ------------------------- | -------- |
| tabTitle                        | 浏览器标签页标题                  | v4.0.10+ |
| tabIcon                         | 浏览器标签页图标                  | v4.0.10+ |
| logoUrl                         | 设置 - 关于页等企业 Logo          | v4.0.10+ |
| meetingInfoUi.conferenceLink    | 会中顶部会议信息 - 小「i」内会议链接文案    | v4.0.10+ |
| inviteUi.headline               | 邀请弹框 - 标题                 | v4.0.10+ |
| inviteUi.conferenceNumber       | 邀请弹框 - 会议号标签              | v4.0.10+ |
| inviteUi.conferenceLink         | 邀请弹框 - 会议链接行              | v4.0.10+ |
| inviteUi.phoneDial              | 邀请弹框 - 电话入会号码             | v4.0.10+ |
| inviteUi.hardwareSectionLabel   | 邀请弹框 - 「软件客户端和硬件终端入会」区块标题 | v4.0.10+ |
| inviteUi.showCopyInviteButton   | 邀请弹框 - 是否显示「复制邀请文本」       | v4.0.10+ |
| recordUi.cloudRecordCompleteTip | 云录制结束后的提示语                | v4.0.10+ |


## 设置弹框

通过 `setSettingConfig` 控制会中「设置」弹框的 Tab 及页内细项。v4.0.10+ 起支持 `appearanceMode`、通过 `settingMenu` 合并侧栏 Tab 显隐，以及 `about` / `feedback` 的对象形细项配置。

**使用示例**

```ts
uiMeetingKit.setSettingConfig({
  appearanceMode: 'light', // 'light' | 'dark' | 'system'
  settingMenu: {
    about: {
      showVersionLog: false, // 隐藏版本日志
      showSdkDriverLine: false // 隐藏 SDK 驱动说明
      // showLogo: false,   // 可选，隐藏 Logo
    },
    feedback: {
      showDownloadLog: false, // 隐藏「下载日志」
      showDebug: false // 隐藏「调试模式」
    },
    hotkey: false, // 隐藏「快捷键」Tab
    common: {
      appearanceSetting: true,
      speakerName: true,
      isLowResolution: true
    }
  }
});
```

**顶层字段**（`setSettingConfig` 入参）


| 字段             | 说明                                     | 默认  | 备注       |
| -------------- | -------------------------------------- | --- | -------- |
| appearanceMode | 外观模式：`'light'` / `'dark'` / `'system'` | —   | v4.0.10+ |


**settingMenu Tab**（v4.0.10+ 起可通过 `setSettingConfig({ settingMenu })` 配置）


| Tab 键名   | 说明  | 默认  |
| -------- | --- | --- |
| common   | 通用  | 显示  |
| device   | 设备  | 显示  |
| hotkey   | 快捷键 | 显示  |
| feedback | 反馈  | 显示  |
| about    | 关于  | 显示  |
| server   | 服务器 | 显示  |


**通用 Tab 细项**（`settingMenu.common` 传对象时）


| 字段                | 说明               | 默认   | 备注       |
| ----------------- | ---------------- | ---- | -------- |
| appearanceSetting | 外观设置（普通/深色/跟随系统） | true | v4.0.10+ |
| speakerName       | 正在讲话人            | true | —        |
| isLowResolution   | 节能模式             | true | —        |
| localHide         | 隐藏本地画面           | true | —        |
| inFullScreen      | 全屏加入会议           | true | —        |


**关于页细项**（`settingMenu.about` 传对象时，v4.0.10+）


| 字段                | 说明                                           | 默认    |
| ----------------- | -------------------------------------------- | ----- |
| showLogo          | 是否显示 Logo（可通过 `setUiConfig({ logoUrl })` 替换） | true  |
| showVersionLog    | 是否显示版本日志入口                                   | false |
| showSdkDriverLine | 是否显示 SDK 驱动说明                                | false |


**反馈页细项**（`settingMenu.feedback` 传对象时，v4.0.10+）


| 字段              | 说明         | 默认   |
| --------------- | ---------- | ---- |
| showDownloadLog | 是否显示「下载日志」 | true |
| showDebug       | 是否显示「调试模式」 | true |


## 设置界面语言

通过调用 `setLocale` 设置 MeetingKit 国际化语言。

**示例代码**

```ts
import { uiMeetingKit } from '@xylink/meetingkit';

// 设置界面语言为英文
uiMeetingKit.setLocale('en_US');

// 设置界面语言为中文
uiMeetingKit.setLocale('zh_CN');

// 设置界面语言为繁体
uiMeetingKit.setLocale('zh_TW');
```


| 英文  | 繁体  |
| --- | --- |
|     |     |


## 换肤配置（v4.0.10+）

MeetingKit 支持通过 `setTheme`（v4.0.10+）自定义会中界面主题色，并同步至 IM、会控等内嵌页面。

> 1. 会中换肤请使用 `uiMeetingKit.setTheme`；`useTheme` React Hook 仍保留用于 Ant Design 组件主题，不再承担会中品牌色换肤。
> 2. 首次设置请在 `uiMeetingKit.createClient()` 之前调用，避免首帧默认主题色。

### 设置主题色

**1. 基础主题设置（v4.0.10+）**

只需配置主色调 `colorPrimary`，即可实现整体主题色更换；可选 `displayMode` 控制亮/暗模式。

```ts
import { uiMeetingKit } from '@xylink/meetingkit';

uiMeetingKit.setTheme({
  colorPrimary: '#49A681',
  displayMode: 'light' // 'light' | 'dark' | 'system'
});
```

**2. 完整主题配置**

如需精细控制各个 UI 元素，可详细配置所有颜色变量。通过 `cssVariables`（v4.0.10+）覆盖设计 token（键名去掉 CSS 前缀 `--xy-`，如 `B1`、`Tag1_bg`）。`displayMode`（`'light' | 'dark' | 'system'`）同为 v4.0.10+。完整品牌色键列表见导出常量 `MEETING_KIT_BRAND_TOKEN_KEYS`（v4.0.10+）。

```ts
uiMeetingKit.setTheme({
  cssVariables: {
    B1: '#49A681',
    B2: '#3E8C6D',
    Tag1_text: '#49A681',
    Tag1_bg: '#E2F1EB'
  },
  displayMode: 'light' // 'light' | 'dark' | 'system'
});
```

**动态切换**

入会前或会中均可再次调用 `setTheme` 更新主题。MeetingKit 支持通过主题配置来自定义界面外观，包括背景色、字体颜色、图标颜色等。


| 默认主题色 | 自定义主题色 |
| ----- | ------ |
|       |        |


## 呼叫页背景音乐（呼叫页声音取消）

入会呼叫等待页默认会播放背景音乐。若业务要求**取消呼叫页声音**，在 `createClient` 之前关闭即可。

> v4.0.10+ 使用 `setBgmAudioConfig` / `setFeatureVisible({ enableBgmAudio })`；v4.0.9 及此前可在 `createClient({ bgmAudioConfig })` 中配置。

**方式一：全局关闭（推荐）**

```ts
uiMeetingKit.setFeatureVisible({ enableBgmAudio: false }); // enableBgmAudio：v4.0.10+
```

**方式二：显式关闭播放（可与方式一同时使用）**

```ts
uiMeetingKit.setBgmAudioConfig({ play: false });
```

**方式三：自定义音源与音量（v4.0.10+）**

```ts
uiMeetingKit.setBgmAudioConfig({
  src: 'https://your.cdn/hold-music.mp3',
  loop: true,
  volume: 0.3,
  play: false
});
```

本 Demo 在 `applyMeetingKitCustomization` 中使用方式一（`enableBgmAudio: false`）。

## 专业会控（v4.0.10+）

主持人在会中通过参会者侧栏 **「更多」→「专业会控」** 可在新窗口打开专业会控。业务侧需提供与主会中页**同源**的壳页，并完成下方接入。仅使用侧栏会控时可跳过本节。

`meetingControlUrl` 在 v4.0.9 及此前已支持；壳页组件 `XYMeetingControlHostComp` 为 v4.0.10+。

**1. `createClient` 配置壳页地址**

```ts
await uiMeetingKit.createClient({
  clientId: '…',
  clientSecret: '…',
  extId: '…',
  server: 'https://…',
  meetingControlUrl: `${window.location.origin}${window.location.pathname}#/host`
});
```

`meetingControlUrl` 为本应用内的**壳页路由**，非会控服务 URL。

- **未配置**：点击「更多」→「专业会控」时，新窗口**直接打开网关返回的专业会控页面**（非业务壳页），会控功能可用，**换肤不生效**。
- **已配置**：新窗口打开壳页，壳页内嵌专业会控，主会中页 `setTheme` 可同步至专业会控窗口。

**2. 注册壳页路由**

```tsx
import { XYMeetingControlHostComp } from '@xylink/meetingkit';

export function MeetingHostRoute() {
  return (
    <XYMeetingControlHostComp
      preloadHidden
      getDocumentTitle={() => '专业会控'}
      iframeTitle="专业会控"
      onMissingUrl={() => {
        window.location.href = '/';
      }}
    />
  );
}
```

壳页**无需**再次登录或 `makeCall`，须在用户已入会且主会中页已完成初始化的同一浏览器环境中打开。

> **换肤注意**：专业会控在**新窗口**加载，与会中页不共享内存中的 Client。壳页需调用一次 `createClient`（可用与主页相同的 `clientId` / `clientSecret` / `extId`，不必入会），否则无法 `createMeetingControlWidget`，主题无法通过 postMessage 下发到会控 iframe。本 Demo 见 `src/view/host/index.tsx`。

## 浏览器音频与「一键接听」提示

浏览器要求用户手势后才能播放远端音频。若自动播放被拦截，MeetingKit 会弹出**「一键接听」**（文案键 `low_audio_answer_tip` / `mobile_low_audio_answer_title`），用户点击后调用 `playAudio` 解锁收听。

**推荐接入（减少弹窗）**：在已渲染 `XYMeetingKitComp` 的前提下，于**用户触发入会的手势**（点击入会按钮等）中、`makeCall` **之前**调用 `playAudio`：

```ts
await uiMeetingKit.getClient()?.playAudio();
await uiMeetingKit.makeCall({ confNumber: '…', displayName: '…' });
```

说明：

- 本 Demo 在 `src/view/app/index.tsx` 的 `join` 中已按上述顺序调用。
- 即便已调用 `playAudio`，部分浏览器策略、页面切后台、或非用户手势路径入会时仍可能再次提示「一键接听」，属预期行为；点击弹窗按钮即可收听。
- 弹窗文案由 SDK 内置 i18n 管理，当前版本不提供业务侧关闭该提示的独立开关。

