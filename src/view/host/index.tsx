import { useEffect, useState } from 'react';
import { XYMeetingControlHostComp, uiMeetingKit } from '@xylink/meetingkit';
import { ACCOUNT, SERVER } from '../../utils/config';
import { applyMeetingKitCustomization } from '../../utils/customization';

/**
 * 专业会控壳页
 *
 * 会控在新窗口打开，与会中页是独立 JS 上下文。若本窗没有 Client，
 * `createMeetingControlWidget` 无法创建，主题无法下发到会控 iframe（换肤不生效）。
 * 因此壳页需 createClient（不必 login / makeCall），并再次 apply 主题以填充本窗 bridge store。
 */
export default function MeetingHostRoute() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        if (!uiMeetingKit.getClient()) {
          const { server = SERVER, clientId: cid, clientSecret: cse, extId: eId } =
            uiMeetingKit.getSettingConfig();

          await uiMeetingKit.createClient({
            clientId: cid || ACCOUNT.clientId,
            clientSecret: cse || ACCOUNT.clientSecret,
            extId: eId || ACCOUNT.extId,
            server: server || SERVER,
          });
        }

        applyMeetingKitCustomization();
      } catch (err) {
        console.warn('[MeetingHost] bootstrap failed:', err);
      } finally {
        if (!cancelled) setReady(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) {
    return (
      <div className="w-full h-screen xy-center text-xy_t3 text-sm">正在加载专业会控…</div>
    );
  }

  return (
    <XYMeetingControlHostComp
      preloadHidden
      getDocumentTitle={() => '专业会控'}
      iframeTitle="专业会控"
      onMissingUrl={() => {
        window.location.hash = '';
      }}
    />
  );
}
