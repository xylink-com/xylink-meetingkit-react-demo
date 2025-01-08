import { createRoot } from 'react-dom/client';
import App from './view/app/index.tsx';

// 方式一： 不包含Tailwind样式，仅支持MK提供的样式
import '@xylink/meetingkit/css/style.css';
import './assets/style/index.css';

// 方式二：导入MK样式
// import '@xylink/meetingkit/css/xy_var.css';
// import '@xylink/meetingkit/css/xy_base.css';
// import './assets/style/index.css';

createRoot(document.getElementById('root')!).render(<App />);
