import { Box } from '@island.is/island-ui/core'
import React, { useRef, FC } from 'react'
import cn from 'classnames'
import * as styles from './ProgressBar.css'

interface Props {
  progress: number
  className?: string
  variant?: boolean
  onClick?: (percentage?: number) => void
  renderProgressBar?: boolean
}

export const ProgressBar: FC<Props> = ({
  progress,
  className,
  variant,
  onClick,
  renderProgressBar = true,
}) => {
  const ref = useRef<HTMLElement>(null)

  if (progress > 1 || progress < 0) {
    return null
  }

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    if (!onClick) {
      return
    }
    const boundingBox = ref.current?.getBoundingClientRect()

    if (!boundingBox) {
      return
    }
    //First get relative coord by element, then divide by the element width for a percentage
    const clickWidthPercent =
      (event.clientX - boundingBox.left) / boundingBox.width
    onClick(clickWidthPercent)
  }

  return (
    <Box
      className={cn(styles.progress, className)}
      position="relative"
      overflow="hidden"
      borderRadius="large"
      background={variant ? 'white' : 'blue100'}
      width="full"
      style={{ top: 0 }}
      onClick={handleClick}
      ref={ref}
    >
      {renderProgressBar && (
        <Box
          className={styles.inner}
          background={'blue400'}
          borderRadius="large"
          position="absolute"
          style={{
            transform: `translateX(${(1 - progress) * -100}%)`,
          }}
        />
      )}
    </Box>
  )
}
