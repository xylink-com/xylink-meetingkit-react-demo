import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import App from './view/app/index.tsx';
import MeetingHostRoute from './view/host/index.tsx';
import { applyMeetingKitCustomization } from './utils/customization';

// 方式一： 不包含Tailwind样式，仅支持MK提供的样式
import '@xylink/meetingkit/css/style.css';
import './assets/style/index.css';

// 方式二：导入MK样式
// import '@xylink/meetingkit/css/xy_var.css';
// import '@xylink/meetingkit/css/xy_base.css';
// import './assets/style/index.css';

// 加入会议页 XYButton / 勾选等使用 --xy-b1，需在首屏前写入主题
applyMeetingKitCustomization();

function Root() {
  const [hash, setHash] = useState(() => window.location.hash);

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // 专业会控壳页：#/host
  if (hash.startsWith('#/host')) {
    return <MeetingHostRoute />;
  }

  return <App />;
}

createRoot(document.getElementById('root')!).render(<Root />);
