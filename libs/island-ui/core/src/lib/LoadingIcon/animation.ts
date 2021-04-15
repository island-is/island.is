import { motion, useAnimation } from 'framer-motion'

const sequence = async () => {
  const controls = useAnimation()

  await controls.start({
    x1: 50,
    transition: { duration: 0.15, ease: 'easeInOutSine' },
  })
  await controls.start({
    x2: 50,
    transition: { duration: 0.15, ease: 'easeInOutSine' },
  })
  await controls.start({
    x1: 88,
    transition: { duration: 0.15, ease: 'easeInOutSine' },
  })
  await controls.start({
    x2: 88,
    transition: { duration: 0.15, ease: 'easeInOutSine' },
  })
  await controls.start({
    y1: 50,
    transition: { duration: 0.15, ease: 'easeInOutSine' },
  })
  await controls.start({
    y2: 50,
    transition: { duration: 0.15, ease: 'easeInOutSine' },
  })
  await controls.start({
    y1: 88,
    transition: { duration: 0.15, ease: 'easeInOutSine' },
  })
  await controls.start({
    y2: 88,
    transition: { duration: 0.15, ease: 'easeInOutSine' },
  })
  await controls.start({
    x1: 50,
    transition: { duration: 0.15, ease: 'easeInOutSine' },
  })
  await controls.start({
    x2: 50,
    transition: { duration: 0.15, ease: 'easeInOutSine' },
  })
  await controls.start({
    x1: 12,
    transition: { duration: 0.15, ease: 'easeInOutSine' },
  })
  await controls.start({
    x2: 12,
    transition: { duration: 0.15, ease: 'easeInOutSine' },
  })
  await controls.start({
    y1: 50,
    transition: { duration: 0.15, ease: 'easeInOutSine' },
  })
  await controls.start({
    y2: 50,
    transition: { duration: 0.15, ease: 'easeInOutSine' },
  })
  await controls.start({
    y1: 12,
    transition: { duration: 0.15, ease: 'easeInOutSine' },
  })
  await controls.start({
    y2: 12,
    transition: { duration: 0.15, ease: 'easeInOutSine' },
  })
  sequence()
}

export default sequence
