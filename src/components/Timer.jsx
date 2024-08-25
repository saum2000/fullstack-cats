import React, { useState, useEffect, useRef } from "react";
import { formatTime } from "../utils/time";

const Timer = () => {
  const [time, setTime] = useState(0);
  const intervalRef = useRef(null);

  const startTimer = () => {
    intervalRef.current = setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const { hours, minutes, seconds } = formatTime(time);

  useEffect(() => {
    startTimer();
    return () => stopTimer();
  }, []);

  return (
    <div className="h-20 text-right">
      <div>
        <span>Last synced </span>
        <span className="font-bold">
        {parseInt(hours)} Hours, {parseInt(minutes)} Minutes, {parseInt(seconds)} Seconds <span></span>
        </span>
        ago.
      </div>
    </div>
  );
};

export default Timer;
