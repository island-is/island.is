import React, { useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { Colors, theme } from '@island.is/island-ui/theme'

interface Props {
  color?: Colors
}

const AnimatedLine: React.FC<Props> = (props) => {
  useEffect(() => {
    seq()
  }, [])

  const controls = useAnimation()
  const { color } = props

  const usedColor = color
    ? theme.color[color]
    : `url(#loading-icon-new-linear-gradient)`

  const seq = async () => {
    const transitionOptions = { duration: 0.15, ease: 'easeInOut' }
    // Right
    await controls.start({
      x1: 50,
      transition: transitionOptions,
    })
    await controls.start({
      x2: 50,
      transition: transitionOptions,
    })
    await controls.start({
      x1: 88,
      transition: transitionOptions,
    })
    await controls.start({
      x2: 88,
      transition: transitionOptions,
    })
    // Down
    await controls.start({
      y1: 50,
      transition: transitionOptions,
    })
    await controls.start({
      y2: 50,
      transition: transitionOptions,
    })
    await controls.start({
      y1: 88,
      transition: transitionOptions,
    })
    await controls.start({
      y2: 88,
      transition: transitionOptions,
    })
    // Left
    await controls.start({
      x1: 50,
      transition: transitionOptions,
    })
    await controls.start({
      x2: 50,
      transition: transitionOptions,
    })
    await controls.start({
      x1: 12,
      transition: transitionOptions,
    })
    await controls.start({
      x2: 12,
      transition: transitionOptions,
    })
    // Up
    await controls.start({
      y1: 50,
      transition: transitionOptions,
    })
    await controls.start({
      y2: 50,
      transition: transitionOptions,
    })
    await controls.start({
      y1: 12,
      transition: transitionOptions,
    })
    await controls.start({
      y2: 12,
      transition: transitionOptions,
    })

    seq()
  }

  return (
    <motion.line
      animate={controls}
      x1="12"
      x2="12"
      y1="12"
      y2="12"
      stroke={usedColor}
      strokeWidth="24"
      strokeLinecap="round"
    />
  )
}

export default AnimatedLine
