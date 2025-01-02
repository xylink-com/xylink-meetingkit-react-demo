const { theme } = require('./node_modules/@xylink/meetingkit/config/theme.config');

module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}', 'node_modules/@xylink/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      ...theme.extend,
    },
  },
  plugins: [],
};
