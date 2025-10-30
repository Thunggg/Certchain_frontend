"use client"

import { useEffect, useState } from "react"

interface CountdownTimerProps {
  endTime: Date
}

export function CountdownTimer({ endTime }: CountdownTimerProps) {
  const [time, setTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      const diff = endTime.getTime() - now.getTime()

      if (diff > 0) {
        setTime({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [endTime])

  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="text-center">
        <div className="text-2xl font-bold text-primary">{String(time.days).padStart(2, "0")}</div>
        <div className="text-xs text-muted-foreground mt-1">Days</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-primary">{String(time.hours).padStart(2, "0")}</div>
        <div className="text-xs text-muted-foreground mt-1">Hours</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-primary">{String(time.minutes).padStart(2, "0")}</div>
        <div className="text-xs text-muted-foreground mt-1">Min</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-primary">{String(time.seconds).padStart(2, "0")}</div>
        <div className="text-xs text-muted-foreground mt-1">Sec</div>
      </div>
    </div>
  )
}
