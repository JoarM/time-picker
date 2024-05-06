import { animate } from "@/lib/animations";
import { toAlwaysPosetive, pythagoras, calculateAngle } from "@/lib/math";
import { getRects } from "@/lib/utils";
import { useState, useRef, useEffect, MouseEvent, TouchEvent, Dispatch, SetStateAction, RefObject } from "react";

export type TimePickerProps = {
  handleMouseDown: (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => void;
  handleMouseLeave: () => void;
  handleMouseMove: (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => void;
  handleMouseUp: (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => void;
  handleTouchEnd: (e: TouchEvent<HTMLDivElement>) => void;
  handleTouchMove: (e: TouchEvent<HTMLDivElement>) => void;
  handleTouchStart: (e: TouchEvent<HTMLDivElement>) => void;
  picking: "hour" | "minute";
  setPicking: Dispatch<SetStateAction<"hour" | "minute">>;
  time: Date;
  clockHandle: RefObject<HTMLDivElement>;
}

export function useTimePicker(selected?: Date, onSelected?: (date: Date) => any) {
  const [picking, setPicking] = useState<"hour" | "minute">("hour");
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [time, setTime] = selected ? [selected, onSelected] : useState(new Date());
  const clockHandle = useRef<HTMLDivElement>(null);

  function setHandleToHourPosition() {
    const hours = time.getHours();
    const angle = (hours / 12 * 360) % 360; 
    const currentAngle = getCurrentClockHandleAngle();
    const duration = 200 + 300 * toAlwaysPosetive(angle - currentAngle) / 360;
    animate(currentAngle, angle, duration, (value) => {
      clockHandle.current?.style.setProperty("--rotation", `${value}deg`);
    });
    if (hours > 11) {
      animate(256, 180, duration, (value) => {
        clockHandle.current?.style.setProperty("--radius", `${value}px/2`);
      });
    } else if (getCurrentClockHandleLength() != 256) {
      console.log(getCurrentClockHandleLength());
      animate(180, 256, duration, (value) => {
        clockHandle.current?.style.setProperty("--radius", `${value}px/2`);
      });
    }
  }

  function getCurrentClockHandleAngle() {
    return Number(clockHandle.current?.style.getPropertyValue("--rotation").split("deg")[0]);
  }

  function getCurrentClockHandleLength() {
    return Number(clockHandle.current?.style.getPropertyValue("--radius").split("px")[0]);
  }

  function setHandleToMinutePosition() {
    const minutes = time.getMinutes();
    const angle = minutes / 60 * 360;
    const currentAngle = getCurrentClockHandleAngle();
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
    if (pythagoras(x, y) < 10) {
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
    setTime && setTime(nextTime);
  }

  function updateMinutes(x: number, y: number) {
    if (pythagoras(x, y) < 10) {
      return;
    }

    const angle = (calculateAngle(x, y) + 90) % 360;
    clockHandle.current?.style.setProperty("--rotation", `${angle}deg`);

    const minute = Math.round(angle / 360 * 60) % 60;
    const nextTime = new Date();
    nextTime.setHours(time.getHours());
    nextTime.setMinutes(minute);
    setTime && setTime(nextTime);
  }

  function handleMouseMove(e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) {
    e.preventDefault();
    if (!isMouseDown) {
      return;
    }
    const rects = getRects(e.currentTarget);

    const x = e.pageX - rects.left - ((rects.width / 2) * -1) - rects.width;
    const y = e.pageY - rects.top - ((rects.height / 2) * -1) - rects.height;

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

    const rects = getRects(e.currentTarget);
    const x = e.touches[0].pageX - rects.left - ((rects.width / 2) * -1) - rects.width;
    const y = e.touches[0].pageY - rects.top - ((rects.height / 2) * -1) - rects.height;

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

    const rects = getRects(e.currentTarget);
    const x = e.pageX - rects.left - ((rects.width / 2) * -1) - rects.width;
    const y = e.pageY - rects.top - ((rects.height / 2) * -1) - rects.height;

    if (pythagoras(x, y) < 10) {
      return;
    }

    if (picking === "hour") {
      updateHours(x, y);
    } else {
      updateMinutes(x, y);
    }

    setIsMouseDown(true);
  }

  function handleTouchStart(e: TouchEvent<HTMLDivElement>) {
    e.preventDefault();

    const rects = getRects(e.currentTarget);
    const x = e.touches[0].pageX - rects.left - ((rects.width / 2) * -1) - rects.width;
    const y = e.touches[0].pageY - rects.top - ((rects.height / 2) * -1) - rects.height;

    if (pythagoras(x, y) < 10) {
      return;
    }

    if (!isMouseDown) {
      if (picking === "hour") {
        updateHours(x, y);
      } else {
        updateMinutes(x, y);
      }
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

  function handleTouchEnd(e: TouchEvent<HTMLDivElement>) {
    e.preventDefault();
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

  return { handleMouseDown, handleMouseLeave, handleMouseMove, handleMouseUp, handleTouchEnd, handleTouchMove, handleTouchStart, picking, setPicking, time, clockHandle }
}