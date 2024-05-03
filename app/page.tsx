"use client";

import { TimePicker } from "@/components/ui/time-picker";
import { useState } from "react";

export default function Home() {
  const [date, setDate] = useState(new Date());
 
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <TimePicker
      selected={date}
      onSelected={setDate}
      />
    </main>
  );
}
