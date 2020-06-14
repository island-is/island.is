import React, { useState, useEffect } from 'react'

export interface CountdownProps {
  countFromSeconds: number
  counter: number
}

export const Countdown = ({ countFromSeconds, counter }: CountdownProps) => {
  const countdown = Math.round(countFromSeconds) - counter
  const min = Math.floor(countdown / 60)
  const sec = countdown % 60
  const formatMin = countdown <= 0 ? '00' : ('0' + min).slice(-2)
  const formatSec = countdown <= 0 ? '00' : ('0' + sec).slice(-2)
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
