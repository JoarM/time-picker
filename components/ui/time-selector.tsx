"use client"

import { useEffect, useRef, useState } from "react";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { MouseEvent, TouchEvent } from "react";

export type TimeSelectorProps = {

}

const circlePlacer = "opacity-75 text-sm font-regular absolute size-9 rounded-full inline-flex justify-center items-center top-[calc(50%-(var(--radius)-var(--padding))*cos(var(--rotation,_0deg)))] right-[calc(50%-(var(--radius)-var(--padding))*sin(var(--rotation,_0deg)))] translate-x-1/2 -translate-y-1/2 cursor-pointer select-none"

function TimeSelector({
  ...props
}: TimeSelectorProps) {
  const [picking, setPicking] = useState<"hour" | "minute">("hour");
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [time, setTime] = useState(new Date());
  const clockHandle = useRef<HTMLDivElement>(null);
  
  function calculateAngle(length: number, height: number) {
    return Math.atan2(height, length) * 57.2957795 < 0 ? Math.atan2(height, length) * 57.2957795 + 360 : Math.atan2(height, length) * 57.2957795;
  }

  function pythagoras(a: number, b: number) {
    return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
  }

  function setHandleToHourPosition() {
    const hours = time.getHours();
    const angle = (hours / 12 * 360) - 360;
    const currentAngle = getCurrentClockHandleAngle();
    const duration = 200 + 300 * toAlwaysPosetive(angle - currentAngle) / 360;
    animate(currentAngle, angle, duration, (value) => {
      clockHandle.current?.style.setProperty("--rotation", `${value}deg`);
    });
    if (hours > 11) {
      animate(256, 180, duration, (value) => {
        clockHandle.current?.style.setProperty("--radius", `${value}px/2`);
      });
    } else {
      animate(180, 256, duration, (value) => {
        clockHandle.current?.style.setProperty("--radius", `${value}px/2`);
      });
    }
  }

  function getCurrentClockHandleAngle() {
    const angle = Number(clockHandle.current?.style.getPropertyValue("--rotation").split("deg")[0]);
    return angle;
  }

  function getCurrentClockHandleLength() {
    const length = Number(clockHandle.current?.style.getPropertyValue("--radius").split("px")[0]);
    return length;
  }

  function setHandleToMinutePosition() {
    const minutes = time.getMinutes();
    const angle = minutes / 60 * 360;
    const currentAngle = getCurrentClockHandleAngle();
    console.log(currentAngle);
    const duration = 200 + 300 * toAlwaysPosetive(angle - currentAngle) / 360;
    animate(currentAngle, angle, duration, (value) => {
      clockHandle.current?.style.setProperty("--rotation", `${value}deg`);
    });
    if (getCurrentClockHandleLength() === 180) {
      animate(180, 256, duration, (value) => {
        clockHandle.current?.style.setProperty("--radius", `${value}px/2`);
      });
    }
  }

  useEffect(() => {
    setHandleToHourPosition();
  }, []);

  useEffect(() => {
    if (picking === "hour") {
      setHandleToHourPosition();
    } else {
      setHandleToMinutePosition();
    }
  }, [picking]);

  function updateHours(x: number, y: number) {
    if ((x < 10 && x > -10) && (y < 10 && y > -10)) {
      return;
    }
    
    const inner = pythagoras(x, y) < 85;
    if (inner) {
      clockHandle.current?.style.setProperty("--radius", "180px/2");
    } else {
      clockHandle.current?.style.setProperty("--radius", "256px/2");
    }
    
    const angle = (calculateAngle(x, y) + 90) % 360;
    clockHandle.current?.style.setProperty("--rotation", `${angle}deg`);
    
    const hour = inner ? (Math.round(angle / 360 * 12) % 12) + 12 : Math.round(angle / 360 * 12) % 12;
    const nextTime = new Date();
    nextTime.setHours(hour);
    nextTime.setMinutes(time.getMinutes());
    setTime(nextTime);
  }

  function updateMinutes(x: number, y: number) {
    if ((x < 10 && x > -10) && (y < 10 && y > -10)) {
      return;
    }

    const angle = (calculateAngle(x, y) + 90) % 360;
    clockHandle.current?.style.setProperty("--rotation", `${angle}deg`);

    const minute = Math.round(angle / 360 * 60) % 60;
    const nextTime = new Date();
    nextTime.setHours(time.getHours());
    nextTime.setMinutes(minute);
    setTime(nextTime);
  }

  function handleMouseMove(e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) {
    if (!isMouseDown) {
      return;
    }

    const x = e.pageX - e.currentTarget.offsetLeft - ((e.currentTarget.offsetWidth / 2) * -1) - e.currentTarget.offsetWidth;
    const y = e.pageY - e.currentTarget.offsetTop - ((e.currentTarget.offsetHeight / 2) * -1) - e.currentTarget.offsetHeight;

    if (picking === "hour") {
      updateHours(x, y);
    } else {
      updateMinutes(x, y);
    }
  }

  function handleTouchMove(e: TouchEvent<HTMLDivElement>) {
    if (!isMouseDown) {
      return;
    }

    const x = e.touches[0].pageX - e.currentTarget.offsetLeft - ((e.currentTarget.offsetWidth / 2) * -1) - e.currentTarget.offsetWidth;
    const y = e.touches[0].pageY - e.currentTarget.offsetTop - ((e.currentTarget.offsetHeight / 2) * -1) - e.currentTarget.offsetHeight;

    if (picking === "hour") {
      updateHours(x, y);
    } else {
      updateMinutes(x, y);
    }
  }

  function handleMouseDown(e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) {
    if (e.button != 0) {
      return;
    }

    const x = e.pageX - e.currentTarget.offsetLeft - ((e.currentTarget.offsetWidth / 2) * -1) - e.currentTarget.offsetWidth;
    const y = e.pageY - e.currentTarget.offsetTop - ((e.currentTarget.offsetHeight / 2) * -1) - e.currentTarget.offsetHeight;

    if (picking === "hour") {
      updateHours(x, y);
    } else {
      updateMinutes(x, y);
    }

    setIsMouseDown(true);
  }

  function handleTouchStart(e: TouchEvent<HTMLDivElement>) {
    const x = e.touches[0].pageX - e.currentTarget.offsetLeft - ((e.currentTarget.offsetWidth / 2) * -1) - e.currentTarget.offsetWidth;
    const y = e.touches[0].pageY - e.currentTarget.offsetTop - ((e.currentTarget.offsetHeight / 2) * -1) - e.currentTarget.offsetHeight;

    if (picking === "hour") {
      updateHours(x, y);
    } else {
      updateMinutes(x, y);
    }

    setIsMouseDown(true);
  }

  function handleMouseUp(e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) {
    if (e.button != 0) {
      return;
    }

    if (!isMouseDown) {
      return;
    }

    if (picking === "minute") {
      setHandleToMinutePosition();
    }
    setIsMouseDown(false);
    setPicking("minute");
  }

  function handleTouchEnd() {
    if (!isMouseDown) {
      return;
    }

    if (picking === "minute") {
      setHandleToMinutePosition();
    }
    setIsMouseDown(false);
    setPicking("minute");
  }

  function handleMouseLeave() {
    if (!isMouseDown) {
      return;
    }
    setIsMouseDown(false);
    if (picking === "hour") {
      setHandleToHourPosition();
    } else {
      setHandleToMinutePosition();
    }
  }

  function animate(from: number, to: number, duration: number, update: (value: number) => void, easingFunction: (i: number) => number = easeOutQuint) {
    const start = Date.now();
    let elapsedTime = 0;
    
    const tick = () => {
      elapsedTime = Date.now() - start;
      update(from + (to - from) * easingFunction(Math.min(elapsedTime / duration, 1)));
      if (elapsedTime < duration) {
        setTimeout(tick, 0.5);
      }
    }
    tick();
  }

  function easeOutQuint(x: number): number {
    return 1 - Math.pow(1 - x, 5);
  }

  function toAlwaysPosetive(i: number) {
    return Math.sqrt(Math.pow(i, 2));
  }

  return (
    <div className=" max-w-64 w-full">
      <div className="flex mx-1 text-3xl items-center gap-1 justify-center group" data-selecting={picking}>
        <Button
        className="h-14 w-20 text-3xl group-data-[selecting='hour']:bg-primary/50 group-data-[selecting='hour']:text-primary-foreground transition-colors" 
        onClick={() => {
          setPicking("hour");
        }}
        variant="secondary"
        >
          {time.getHours().toString().padStart(2, "0")}
        </Button>
        :
        <Button
        className="h-14 w-20 text-3xl group-data-[selecting='minute']:bg-primary/50 group-data-[selecting='minute']:text-primary-foreground transition-colors" 
        onClick={() => {
          setPicking("minute");
        }}
        variant="secondary"
        >
          {time.getMinutes().toString().padStart(2, "0")}
        </Button>
      </div>
      <div 
      className="w-full bg-muted aspect-square rounded-full mt-4 relative [--padding:_1.325rem]" 
      onMouseMove={handleMouseMove} 
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchStart={handleTouchStart}
      >
        <div className="[--rotation:_0deg] [--radius:_256px/2]" ref={clockHandle}>
          <span className="absolute size-5 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-muted-foreground/50"></span>
          <span className={cn(circlePlacer, "bg-primary opacity-100")}></span>
          <span className="absolute size-2 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary"></span>
          <span className="absolute bottom-1/2 h-[calc(var(--radius)-var(--padding))] w-0.5 bg-primary left-1/2 -translate-x-1/2 rotate-[var(--rotation)] origin-bottom"></span>
        </div>
        {picking === "hour" && (
          <>
            <div className="[--radius:_256px/2]">
              <span className={cn("[--rotation:_0deg]", circlePlacer)}>00</span>
              <span className={cn("[--rotation:_30deg]", circlePlacer)}>01</span>
              <span className={cn("[--rotation:_60deg]", circlePlacer)}>02</span>
              <span className={cn("[--rotation:_90deg]", circlePlacer)}>03</span>
              <span className={cn("[--rotation:_120deg]", circlePlacer)}>04</span>
              <span className={cn("[--rotation:_150deg]", circlePlacer)}>05</span>
              <span className={cn("[--rotation:_180deg]", circlePlacer)}>06</span>
              <span className={cn("[--rotation:_210deg]", circlePlacer)}>07</span>
              <span className={cn("[--rotation:_240deg]", circlePlacer)}>08</span>
              <span className={cn("[--rotation:_270deg]", circlePlacer)}>09</span>
              <span className={cn("[--rotation:_300deg]", circlePlacer)}>10</span>
              <span className={cn("[--rotation:_330deg]", circlePlacer)}>11</span>
            </div>
            <div className="[--radius:_180px/2]">
              <span className={cn("[--rotation:_0deg]", circlePlacer)}>12</span>
              <span className={cn("[--rotation:_30deg]", circlePlacer)}>13</span>
              <span className={cn("[--rotation:_60deg]", circlePlacer)}>14</span>
              <span className={cn("[--rotation:_90deg]", circlePlacer)}>15</span>
              <span className={cn("[--rotation:_120deg]", circlePlacer)}>16</span>
              <span className={cn("[--rotation:_150deg]", circlePlacer)}>17</span>
              <span className={cn("[--rotation:_180deg]", circlePlacer)}>18</span>
              <span className={cn("[--rotation:_210deg]", circlePlacer)}>19</span>
              <span className={cn("[--rotation:_240deg]", circlePlacer)}>20</span>
              <span className={cn("[--rotation:_270deg]", circlePlacer)}>21</span>
              <span className={cn("[--rotation:_300deg]", circlePlacer)}>22</span>
              <span className={cn("[--rotation:_330deg]", circlePlacer)}>23</span>
            </div>
          </>
        )}
        {picking === "minute" && (
          <div className="[--radius:_256px/2]">
            <span className={cn("[--rotation:_0deg]", circlePlacer)}>00</span>
            <span className={cn("[--rotation:_30deg]", circlePlacer)}>05</span>
            <span className={cn("[--rotation:_60deg]", circlePlacer)}>10</span>
            <span className={cn("[--rotation:_90deg]", circlePlacer)}>15</span>
            <span className={cn("[--rotation:_120deg]", circlePlacer)}>20</span>
            <span className={cn("[--rotation:_150deg]", circlePlacer)}>25</span>
            <span className={cn("[--rotation:_180deg]", circlePlacer)}>30</span>
            <span className={cn("[--rotation:_210deg]", circlePlacer)}>35</span>
            <span className={cn("[--rotation:_240deg]", circlePlacer)}>40</span>
            <span className={cn("[--rotation:_270deg]", circlePlacer)}>45</span>
            <span className={cn("[--rotation:_300deg]", circlePlacer)}>50</span>
            <span className={cn("[--rotation:_330deg]", circlePlacer)}>55</span>
          </div>
        )}
      </div>
    </div>
  )
} 

TimeSelector.displayName = "TimeSelector";

export { TimeSelector }