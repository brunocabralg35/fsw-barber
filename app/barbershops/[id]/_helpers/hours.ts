import { addMinutes, format, setHours, setMinutes } from "date-fns";

export const generateDayTimeList = (date: Date) => {
  const startTime = setMinutes(setHours(date, 9), 0); // set start time to 9:00
  const endTime = setMinutes(setHours(date, 21), 0); // set end time to 21:00
  const interval = 45; // interval in minutes
  const timeList: string[] = [];

  let currentTime = startTime;

  while (currentTime <= endTime){
    timeList.push(format(currentTime, "HH:mm"));
    currentTime = addMinutes(currentTime, interval)
  }

  return timeList;
};
