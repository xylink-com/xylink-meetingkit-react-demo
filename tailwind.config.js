const { theme } = require('./node_modules/@xylink/meetingkit/config/theme.config');

module.exports = {
  // MeetingKit 已提供完整 CSS；扫描包源码会生成覆盖内嵌图片的相对 URL。
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      ...theme.extend,
    },
  },
  plugins: [],
};
