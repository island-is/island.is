import 'matchmedia-polyfill'
import 'matchmedia-polyfill/matchMedia.addListener'
import React, { FC, Children, useState, useRef } from 'react'
import ReactResizeDetector from 'react-resize-detector'
import cn from 'classnames'
import Slick from 'react-slick'
import {
  Stack,
  Typography,
  Icon,
  Column,
  Columns,
  Box,
  Inline,
  BoxProps,
  Hidden,
} from '../..'

import { theme } from '../../theme/theme'
import * as styles from './Slider.treat'

interface SliderProps {
  settings?: object
  title?: string
  boxProps: BoxProps
}

const responsive = [
  {
    breakpoint: theme.breakpoints.md,
    settings: {
      slidesToShow: 1,
    },
  },
  {
    breakpoint: theme.breakpoints.lg,
    settings: {
      slidesToShow: 2,
    },
  },
]

export const Slider: FC<SliderProps> = ({
  settings,
  children,
  title,
  boxProps,
}) => {
  const [noPrev, setNoPrev] = useState<boolean>(true)
  const [noNext, setNoNext] = useState<boolean>(true)

  const ref = useRef(null)

  const isClient = typeof window === 'object'

  const slickSettings = Object.assign(
    {},
    {
      dots: false,
      arrows: false,
      speed: 300,
      slidesToShow: 3,
      slidesToScroll: 1,
      infinite: false,
      responsive: isClient ? responsive : null,
      afterChange: () => {
        updateArrows()
      },
    },
    settings,
  )

  const nextSlide = () => {
    if (ref.current) {
      ref.current.slickNext()
    }
  }

  const prevSlide = () => {
    if (ref.current) {
      ref.current.slickPrev()
    }
  }

  const slideCount = Children.toArray(children).filter((c) => c).length

  const updateArrows = () => {
    if (ref.current) {
      const { slidesToShow } = ref.current.innerSlider.props
      const { currentSlide } = ref.current.innerSlider.state

      setNoPrev(currentSlide === 0)
      setNoNext(currentSlide + slidesToShow === slideCount)
    }
  }

  const handleResize = () => {
    updateArrows()
  }

  return (
    <ReactResizeDetector
      refreshMode="debounce"
      refreshRate={600}
      handleWidth
      onResize={handleResize}
    >
      <Stack space={[3, 3, 6]}>
        <Box paddingX={[3, 3, 6]}>
          <Columns space={2} collapseBelow="md">
            <Column>
              <Typography variant="h3" as="h3">
                {title}
              </Typography>
            </Column>
            <Column width="content">
              <Hidden below="md">
                <Inline space={3}>
                  <NavButton disabled={noPrev} dir="prev" onClick={prevSlide} />
                  <NavButton disabled={noNext} dir="next" onClick={nextSlide} />
                </Inline>
              </Hidden>
            </Column>
          </Columns>
        </Box>
        <Box {...boxProps}>
          <Slick ref={ref} {...slickSettings}>
            {children}
          </Slick>
        </Box>
      </Stack>
    </ReactResizeDetector>
  )
}

const NavButton = ({ dir = 'next', onClick, disabled }) => {
  return (
    <Box
      component="button"
      display="flex"
      justifyContent="center"
      alignItems="center"
      onClick={onClick}
      borderRadius="circle"
      transform="touchable"
      disabled={disabled}
      className={styles.navButton}
    >
      <span
        className={cn(styles.arrowIcon, { [styles.rotated]: dir === 'next' })}
      >
        <Icon type="arrowLeft" color={disabled ? 'blue300' : 'blue400'} />
      </span>
    </Box>
  )
}
