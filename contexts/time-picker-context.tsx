import { TimePickerProps, useTimePicker } from "@/hooks/use-time-picker";
import { createContext, useContext } from "react";

const TimePickerContext = createContext<TimePickerProps | null>(null);

const useTimePickerContext = () => useContext(TimePickerContext);

export { TimePickerContext, useTimePickerContext }