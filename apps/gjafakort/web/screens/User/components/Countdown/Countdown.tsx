import React, { useState, useEffect } from 'react'

export interface CountdownProps {
  minutes: number
}

export const Countdown = ({ minutes, timestamp }: CountdownProps) => {
  const countFromSeconds = minutes * 60
  const counter = useCountdown(countFromSeconds)

  const countdown = countFromSeconds - counter

  const min = Math.floor(countdown / 60)
  const sec = countdown % 60

  const formatMin = ('0' + min).slice(-2)
  const formatSec = ('0' + sec).slice(-2)

  return (
    <span>
      {formatMin}:{formatSec}
    </span>
  )
}

export const useCountdown = (countFrom: number) => {
  const [seconds, setSeconds] = useState(0)
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((pre) => {
        const incr = pre + 1
        if (incr === countFrom) {
          clearInterval(timer)
        }
        return incr
      })
    }, 1000)
    return () => {
      clearInterval(timer)
    }
  }, [setSeconds, countFrom])
  return seconds
}

export default Countdown
