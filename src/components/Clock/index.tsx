import { CSSProperties, useEffect, useState } from "react";

interface ClockProps {
  style?: CSSProperties;
}

const Clock: React.FC<ClockProps> = (props) => {
  const { style } = props;
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <time style={style} dateTime={time.toISOString()}>{time.toLocaleTimeString()}</time>;
};

export { Clock };
