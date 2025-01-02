import logo from '../../../../assets/img/logo.png';

export const XYHeader = () => {
  return (
    <div className="fixed left-0 top-0 w-full h-[50px] px-10 shadow-xy_header bg-xy_bg6 text-xy_t3 xy-center z-10">
      <a
        href="https://www.xylink.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute left-8 w-[134px]"
        style={{ width: '134px' }}
      >
        <img className="w-ful h-full" src={logo} alt="logo" />
      </a>
    </div>
  );
};
