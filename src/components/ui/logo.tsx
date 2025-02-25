interface LogoProps {
  width?: number;
  height?: number;
}

export const Logo = ({ width = 157, height = 414 }: LogoProps) => {
  return (
    <div className="w-full h-auto absolute bottom-0 right-0 text-right flex gap-0 pointer-events-none">
      <svg width={width} height={height} viewBox="0 0 157 414" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M118.058 0C139.367 0 156.643 17.2375 156.643 38.497V120H84.1312V170H118.058C139.367 170 156.643 187.238 156.643 208.5V414H0V294H72.5121V244H38.5849C17.2768 244 0 226.762 0 205.5V38.497C0 17.2375 17.2768 0 38.5849 0H118.058Z"
          fill="#ffffff"
        />
      </svg>
      <svg width={width} height={height} viewBox="0 0 157 414" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M118.058 0C139.367 0 156.643 17.2375 156.643 38.497V375.503C156.643 396.765 139.367 414 118.058 414H38.5849C17.2768 414 0 396.765 0 375.503V38.497C0 17.2375 17.2768 0 38.5849 0H118.058Z"
          fill="#ffffff"
        />
        <rect x="70" y="100" width="15" height="214" fill="#000000" />
      </svg>
      <svg width={width} height={height} viewBox="0 0 157 414" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M156.643 0V414H84.1312V207L38.5849 414H0V0H72.5121V207L118.058 0H156.643Z"
          fill="#ffffff"
        />
      </svg>
      <svg
        width={width}
        height={height}
        viewBox="0 0 157 413"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          translate: "none",
          rotate: "none",
          scale: "none",
          transform: "perspective(1063.83px) translate3d(0px, 0px, 0px)",
        }}
      >
        <path
          d="M118.058 0.957886C139.367 0.957886 156.643 18.1954 156.643 39.455V412.147H84.1312V230.578C84.1312 224.161 78.9292 218.959 72.5121 218.959V218.959V412.147H0V39.455C0 18.1954 17.2768 0.957886 38.5849 0.957886H118.058ZM72.5121 196.104C78.9292 196.104 84.1312 190.902 84.1312 184.485V43.8388C84.1312 37.4218 78.9292 32.2197 72.5121 32.2197V32.2197V196.104V196.104Z"
          fill="#ffffff"
          data-v-8c7ce5cc=""
        ></path>
      </svg>
      <svg
        width={width}
        height={height}
        viewBox="0 0 157 414"
        xmlns="http://www.w3.org/2000/svg"
        data-v-8c7ce5cc=""
        style={{
          translate: "none",
          rotate: "none",
          scale: "none",
          transform: "perspective(1063.83px) translate3d(0px, 0px, 0px)",
        }}
      >
        <path
          d="M156.651 40.1561V185.255C156.651 195.059 153.195 204.287 147.436 210.631C153.195 217.552 156.651 226.78 156.651 236.008V413.07H84.1386V237.246C84.1386 230.829 78.9365 225.627 72.5194 225.627V225.627V413.07H0.00732422V0H118.642C139.374 0 156.651 18.8164 156.651 40.1561ZM72.5194 196.213C78.9365 196.213 84.1386 191.011 84.1386 184.594V42.5473C84.1386 36.1302 78.9365 30.9281 72.5194 30.9281V30.9281V196.213V196.213Z"
          fill="#ffffff"
          data-v-8c7ce5cc=""
        ></path>
      </svg>
    </div>
  );
};
