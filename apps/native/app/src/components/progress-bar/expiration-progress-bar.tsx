import isNumber from 'lodash/isNumber'
import { useEffect, useState } from 'react'
import { useInterval } from '../../hooks/use-interval'

import { ProgressBar } from './progress-bar'

const getExpirationPercentage = (expireDate: Date, expireTime: number) => {
  const now = new Date()
  const timeDiff = expireDate.getTime() - now.getTime()

  if (timeDiff <= 0) {
    return 0
  } else {
    const percentage = (timeDiff / expireTime) * 100

    return Math.round(percentage)
  }
}

interface ExpirationProgressBarProps {
  expirationDate: Date
  /**
   * The interval delay in milliseconds
   * @default 700
   */
  intervalDelay?: number
  /**
   * The time in milliseconds to expire.
   */
  expireTime: number
  /**
   * The callback function to be called when the expiration date is reached.
   */
  doneCallback?(): void
  /**
   * The width of the progress bar container.
   */
  barContainerWidth?: number
}

export const ExpirationProgressBar = ({
  expirationDate,
  intervalDelay = 700,
  expireTime,
  doneCallback,
  barContainerWidth,
}: ExpirationProgressBarProps) => {
  const [progress, setProgress] = useState(() => 100)

  useEffect(() => {
    if (expirationDate) {
      // Reset the progress when the expiration date changes
      setProgress(100)
    }
  }, [expirationDate])

  useInterval(
    () => {
      if (isNumber(progress)) {
        const percentage = getExpirationPercentage(
          new Date(expirationDate),
          expireTime,
        )
        setProgress(percentage)

        if (percentage === 0) {
          doneCallback?.()
        }
      }
    },
    progress === 0 ? null : intervalDelay,
  )

  return (
    <ProgressBar
      progress={progress}
      animationDuration={1000}
      containerWidth={barContainerWidth}
    />
  )
}
