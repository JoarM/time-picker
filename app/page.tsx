"use client";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TimePicker } from "@/components/ui/time-picker";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [date, setDate] = useState(new Date());
 
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      {/* <TimePicker
      /> */}

      <div>
        <h1>Time picker demo</h1>
        <Popover>
          <PopoverTrigger asChild>
            <Button
            variant="outline"
            className={cn(
              "w-[280px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
            >
              <Clock className="mr-2 size-4" />
              {date ? `${date.getHours().toString().padStart(2, "0")} : ${date.getMinutes().toString().padStart(2, "0")}` : <span>Pick a time</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[280px] grid place-items-center">
            <TimePicker 
            selected={date}
            onSelected={setDate}
            className="w-64"
            />
          </PopoverContent>
        </Popover>
      </div>
    </main>
  );
}
