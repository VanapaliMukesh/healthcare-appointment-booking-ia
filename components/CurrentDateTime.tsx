"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock } from "lucide-react"

export function CurrentDateTime() {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  return (
    <div className="hidden md:flex items-center gap-4 text-sm text-gray-600">
      <div className="flex items-center gap-1">
        <Calendar className="w-4 h-4" />
        <span>{formatDate(currentTime)}</span>
      </div>
      <div className="flex items-center gap-1">
        <Clock className="w-4 h-4" />
        <span>{formatTime(currentTime)}</span>
      </div>
    </div>
  )
}
