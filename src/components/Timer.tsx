import React, { useState, useEffect, useRef } from "react";
import { formatTime } from "../utils/time";

const Timer = () => {
  const [time, setTime] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = (): void => {
    intervalRef.current = setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, 1000);
  };

  const stopTimer = (): void => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const {
    hours,
    minutes,
    seconds,
  }: { hours: string; minutes: string; seconds: string } = formatTime(time);

  useEffect(() => {
    startTimer();
    return () => stopTimer();
  }, []);

  return (
    <div className="h-20 text-right">
      <div>
        <span>Last synced </span>
        <span className="font-bold">
          {parseInt(hours)} Hours, {parseInt(minutes)} Minutes,{" "}
          {parseInt(seconds)} Seconds <span></span>
        </span>
        ago.
      </div>
    </div>
  );
};

export default Timer;
