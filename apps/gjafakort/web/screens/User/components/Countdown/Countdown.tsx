import React from 'react'

interface PropTypes {
  countFromSeconds: number
  counter: number
}

function Countdown({ countFromSeconds, counter }: PropTypes) {
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

export default Countdown
