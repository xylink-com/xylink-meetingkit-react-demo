import { createRoot } from 'react-dom/client';
import App from './view/app/index.tsx';

// 不包含Tailwind样式，仅支持MK提供的样式
import '@xylink/meetingkit/css/style.css';
import './index.css';

// 导入MK样式
// import '@xylink/meetingkit/css/xy_var.css';
// import '@xylink/meetingkit/css/xy_base.css';
// import './index.css';

createRoot(document.getElementById('root')!).render(<App />);
