"use client"

import { Button } from "./button";
import { cn } from "@/lib/utils";
import React from "react";
import { TimePickerContext, useTimePickerContext } from "@/contexts/time-picker-context";
import { useTimePicker } from "@/hooks/use-time-picker";

export type TimePickerProps = {
  className?: string
}

const circlePlacer = "opacity-75 text-sm font-regular absolute size-9 rounded-full inline-flex justify-center items-center top-[calc(50%-(var(--radius)-var(--padding))*cos(var(--rotation,_0deg)))] right-[calc(50%-(var(--radius)-var(--padding))*sin(var(--rotation,_0deg)))] translate-x-1/2 -translate-y-1/2 cursor-pointer select-none";

function TimePicker({
  className,
  ...props
}: TimePickerProps) {
  const timePicker = useTimePicker();

  return (
    <TimePickerContext.Provider value={timePicker}>
      <div 
      className={cn("max-w-64 w-full", className)}
      {...props}
      >
        <TimePickerHeader />
        <TimePickerBody />
      </div>
    </TimePickerContext.Provider>
  )
} 

function TimePickerLabel({
  className,
  children,
  ...props
}: React.HtmlHTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={cn(
      circlePlacer,
      className
    )}
    {...props}
    >
      {children}
    </span>
  )
}

function TimePickerHandle({ 
  className, 
  ...props 
}: React.HtmlHTMLAttributes<HTMLDivElement>) {
  const timePicker  = useTimePickerContext();
  if (!timePicker) return;

  const { clockHandle } = timePicker;

  return (
    <div className={cn("[--rotation:_0deg] [--radius:_256px/2]", className)} ref={clockHandle} {...props}>
      <span className="absolute size-5 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-muted-foreground/50"></span>
      <span className={cn(circlePlacer, "bg-primary opacity-100")}></span>
      <span className="absolute size-2 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary"></span>
      <span className="absolute bottom-1/2 h-[calc(var(--radius)-var(--padding))] w-0.5 bg-primary left-1/2 -translate-x-1/2 rotate-[var(--rotation)] origin-bottom"></span>
    </div>
  )
};

function TimePickerHeader() {
  const timePicker  = useTimePickerContext();
  if (!timePicker) return;

  const { picking, setPicking, time } = timePicker;

  return (
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
      <span>:</span>
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
  )
}

function TimePickerBody() {
  const timePicker  = useTimePickerContext();
  if (!timePicker) return;

  const { handleMouseDown, handleMouseLeave, handleMouseMove, handleMouseUp, handleTouchEnd, handleTouchMove, handleTouchStart } = timePicker;

  return (
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
        <TimePickerHandle />
        <TimePickerLabels />
      </div>
  )
}

function TimePickerLabels() {
  const timePicker  = useTimePickerContext();
  if (!timePicker) return;

  const { picking } = timePicker;

  if (picking === "hour") {
    return (
      <>
        <div className="[--radius:_256px/2]">
          <TimePickerLabel className="[--rotation:_0deg]">00</TimePickerLabel>
          <TimePickerLabel className="[--rotation:_30deg]">01</TimePickerLabel>
          <TimePickerLabel className="[--rotation:_60deg]">02</TimePickerLabel>
          <TimePickerLabel className="[--rotation:_90deg]">03</TimePickerLabel>
          <TimePickerLabel className="[--rotation:_120deg]">04</TimePickerLabel>
          <TimePickerLabel className="[--rotation:_150deg]">05</TimePickerLabel>
          <TimePickerLabel className="[--rotation:_180deg]">06</TimePickerLabel>
          <TimePickerLabel className="[--rotation:_210deg]">07</TimePickerLabel>
          <TimePickerLabel className="[--rotation:_240deg]">08</TimePickerLabel>
          <TimePickerLabel className="[--rotation:_270deg]">09</TimePickerLabel>
          <TimePickerLabel className="[--rotation:_300deg]">10</TimePickerLabel>
          <TimePickerLabel className="[--rotation:_330deg]">11</TimePickerLabel>
        </div>
        <div className="[--radius:_180px/2]">
          <TimePickerLabel className="[--rotation:_0deg]">12</TimePickerLabel>
          <TimePickerLabel className="[--rotation:_30deg]">13</TimePickerLabel>
          <TimePickerLabel className="[--rotation:_60deg]">14</TimePickerLabel>
          <TimePickerLabel className="[--rotation:_90deg]">15</TimePickerLabel>
          <TimePickerLabel className="[--rotation:_120deg]">16</TimePickerLabel>
          <TimePickerLabel className="[--rotation:_150deg]">17</TimePickerLabel>
          <TimePickerLabel className="[--rotation:_180deg]">18</TimePickerLabel>
          <TimePickerLabel className="[--rotation:_210deg]">19</TimePickerLabel>
          <TimePickerLabel className="[--rotation:_240deg]">20</TimePickerLabel>
          <TimePickerLabel className="[--rotation:_270deg]">21</TimePickerLabel>
          <TimePickerLabel className="[--rotation:_300deg]">22</TimePickerLabel>
          <TimePickerLabel className="[--rotation:_330deg]">23</TimePickerLabel>
        </div>
      </>
    )
  }

  return (
    <div className="[--radius:_256px/2]">
      <TimePickerLabel className="[--rotation:_0deg]">00</TimePickerLabel>
      <TimePickerLabel className="[--rotation:_30deg]">05</TimePickerLabel>
      <TimePickerLabel className="[--rotation:_60deg]">10</TimePickerLabel>
      <TimePickerLabel className="[--rotation:_90deg]">15</TimePickerLabel>
      <TimePickerLabel className="[--rotation:_120deg]">20</TimePickerLabel>
      <TimePickerLabel className="[--rotation:_150deg]">25</TimePickerLabel>
      <TimePickerLabel className="[--rotation:_180deg]">30</TimePickerLabel>
      <TimePickerLabel className="[--rotation:_210deg]">35</TimePickerLabel>
      <TimePickerLabel className="[--rotation:_240deg]">40</TimePickerLabel>
      <TimePickerLabel className="[--rotation:_270deg]">45</TimePickerLabel>
      <TimePickerLabel className="[--rotation:_300deg]">50</TimePickerLabel>
      <TimePickerLabel className="[--rotation:_330deg]">55</TimePickerLabel>
    </div>
  )
}

TimePicker.displayName = "TimePicker";

export { TimePicker }