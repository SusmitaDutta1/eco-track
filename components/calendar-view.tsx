"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { ChevronLeft, ChevronRight, Search } from "lucide-react"
import { cn } from "../lib/utils"
import { getCarbonDataForDate } from "../lib/carbon-storage"

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

interface CalendarViewProps {
  onSelectDate?: (date: Date) => void
}

export function CalendarView({ onSelectDate }: CalendarViewProps) {
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [selectedDate, setSelectedDate] = useState(today)

  // Get days in month
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay()
  }

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const handleSelectDate = (day: number) => {
    const newDate = new Date(currentYear, currentMonth, day)
    setSelectedDate(newDate)
    if (onSelectDate) {
      onSelectDate(newDate)
    }
  }

  // Generate calendar days
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear)
    const firstDayOfMonth = getFirstDayOfMonth(currentMonth, currentYear)
    const prevMonthDays = getDaysInMonth(
      currentMonth - 1 < 0 ? 11 : currentMonth - 1,
      currentMonth - 1 < 0 ? currentYear - 1 : currentYear,
    )

    const days = []

    // Previous month days
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      days.push({
        day: prevMonthDays - i,
        isCurrentMonth: false,
        isPast: true,
      })
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentYear, currentMonth, i)

      days.push({
        day: i,
        isCurrentMonth: true,
        isToday: date.toDateString() === today.toDateString(),
        isSelected: date.toDateString() === selectedDate.toDateString(),
      })
    }

    // Next month days
    const remainingDays = 42 - days.length // 6 rows * 7 days = 42
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        isPast: false,
      })
    }

    return days
  }

  const days = generateCalendarDays()

  return (
    <div className="p-4 bg-background/80 rounded-lg">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div className="relative">
            <Input placeholder="Search" className="pl-10 bg-background/50 border-none" />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-semibold mb-2">Calendar</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="rounded-full">
              Today
            </Button>
            <div className="text-xl font-medium">
              {MONTHS[currentMonth]} , {currentYear}
            </div>
          </div>
        </div>

        <div className="calendar">
          <div className="flex justify-between mb-4">
            <Button variant="ghost" size="icon" onClick={handlePrevMonth}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleNextMonth}>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {DAYS_OF_WEEK.map((day) => (
              <div key={day} className="text-center font-medium py-2">
                {day}
              </div>
            ))}

            {days.map((day, index) => (
              <div
                key={index}
                className={cn(
                  "aspect-square flex flex-col items-center justify-start text-sm rounded-md p-1",
                  day.isCurrentMonth ? "cursor-pointer hover:bg-primary/10" : "text-muted-foreground bg-background/30",
                  day.isToday && "border border-primary/50",
                  day.isSelected && "bg-primary text-red",
                )}
                onClick={() => day.isCurrentMonth && handleSelectDate(day.day)}
              >
                <span>{day.day}</span>
                {day.isCurrentMonth && (
                  <div className="text-xs mt-1">
                    {(() => {
                      const date = new Date(currentYear, currentMonth, day.day)
                      const entry = getCarbonDataForDate(date)
                      return entry ? `${entry.footprint.toFixed(1)} kg` : ''
                    })()}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
