import React, { FC, useState, useRef, useCallback, useEffect } from 'react'
import ReactResizeDetector from 'react-resize-detector'
import cn from 'classnames'
import Carousel from 'nuka-carousel'
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
  boxProps?: BoxProps
}

const breakpoints = [
  {
    breakpoint: theme.breakpoints.xs,
    slidesToShow: 1,
  },
  {
    breakpoint: theme.breakpoints.md,
    slidesToShow: 2,
  },
  {
    breakpoint: theme.breakpoints.xl,
    slidesToShow: 3,
  },
]

export const Slider: FC<SliderProps> = ({ children, title, boxProps }) => {
  const containerRef = useRef(null)
  const ref = useRef(null)
  const [slidesToShow, setSlidesToShow] = useState<number>(3)

  const updateSlidesToShow = useCallback(
    (width) => {
      const windowWidth = width || window.innerWidth

      setSlidesToShow(() =>
        breakpoints.reduce((value, current) => {
          if (windowWidth > current.breakpoint) {
            return current.slidesToShow
          }

          return value
        }, slidesToShow),
      )
    },
    [slidesToShow],
  )

  useEffect(() => {
    if (typeof window === 'object') {
      updateSlidesToShow(window.innerWidth)
    }
  }, [updateSlidesToShow])

  const updateHeights = useCallback(() => {
    if (containerRef.current) {
      const liElems = Array.from(
        containerRef.current.querySelectorAll('li.slider-slide'),
      )

      const slides = Array.from(
        containerRef.current.querySelectorAll('li.slider-slide > div'),
      )

      liElems.forEach((x: HTMLDivElement) => {
        x.style.display = 'inline-flex'
      })

      slides.forEach((x: HTMLDivElement) => {
        x.style.height = 'auto'
      })

      setTimeout(() => {
        const tallest = slides.reduce(
          (height: number, current: HTMLElement) => {
            return Math.max(height, current.offsetHeight)
          },
          0,
        ) as number

        slides.forEach((x: HTMLDivElement) => {
          x.style.height = `${tallest}px`
        })

        console.log('tallest', tallest)
      }, 0)
    }
  }, [])

  const handleResize = ({ width }) => {
    updateSlidesToShow(width)
    // updateHeights()
  }

  return (
    <ReactResizeDetector
      // refreshMode="debounce"
      // refreshRate={500}
      handleWidth
      onResize={handleResize}
    >
      <Box position="relative">
        <Stack space={[3, 3, 6]}>
          <Box paddingX={[3, 3, 6]}>
            <Columns space={2} collapseBelow="md">
              <Column>
                <Typography variant="h3" as="h3">
                  {title}
                </Typography>
              </Column>
              <Column width="1/4">
                <span />
              </Column>
            </Columns>
          </Box>
          <Box {...boxProps} ref={containerRef}>
            <Carousel
              ref={ref}
              frameOverflow="visible"
              framePadding="0 -12px"
              heightMode="max"
              slidesToShow={slidesToShow}
              renderBottomCenterControls={null}
              renderCenterRightControls={null}
              renderCenterLeftControls={null}
              renderTopRightControls={({ previousSlide, nextSlide }) => (
                <Hidden below="md">
                  <Inline space={3}>
                    <NavButton
                      disabled={false}
                      dir="prev"
                      onClick={previousSlide}
                    />
                    <NavButton
                      disabled={false}
                      dir="next"
                      onClick={nextSlide}
                    />
                  </Inline>
                </Hidden>
              )}
              getControlsContainerStyles={(key) => {
                switch (key) {
                  case 'TopRight':
                    return {
                      top: -83,
                      right: 0,
                    }
                  default:
                    break
                }
              }}
            >
              <div className={styles.tester}>
                <div>waoinf awofinwaf</div>
                <div>waoinf awofinwaf</div>
                <div>waoinf awofinwaf</div>
                <div>waoinf awofinwaf</div>
                <div>waoinf awofinwaf</div>
                <div>waoinf awofinwaf</div>
                <div>waoinf awofinwaf</div>
              </div>
              <div className={styles.tester}>
                <div>waoinf awofinwaf</div>
                <div>waoinf awofinwaf</div>
                <div>waoinf awofinwaf</div>
                <div>waoinf awofinwaf</div>
                <div>waoinf awofinwaf</div>
                <div>
                  waoinf awofinwaf safkna owinopaiwn foiawbf saepiubf aisdupg
                  saidubgdsiaubg sdiaubg sdiab gpidsa
                </div>
                <div>waoinf awofinwaf</div>
                <div>waoinf awofinwaf</div>
                <div>waoinf awofinwaf</div>
                <div>waoinf awofinwaf</div>
                <div>waoinf awofinwaf</div>
                <div>waoinf awofinwaf</div>
                <div>waoinf awofinwaf</div>
              </div>
              <div className={styles.tester}>
                <div>waoinf awofinwaf</div>
                <div>waoinf awofinwaf</div>
                <div>waoinf awofinwaf</div>
                <div>waoinf awofinwaf</div>
                <div>waoinf awofinwaf</div>
                <div>waoinf awofinwaf</div>
                <div>waoinf awofinwaf</div>
              </div>
              <div className={styles.tester}>
                <div>waoinf awofinwaf</div>
                <div>waoinf awofinwaf</div>
                <div>waoinf awofinwaf</div>
                <div>waoinf awofinwaf</div>
                <div>waoinf awofinwaf</div>
                <div>waoinf awofinwaf</div>
                <div>waoinf awofinwaf</div>
              </div>
              <div className={styles.tester}>
                <div>waoinf awofinwaf</div>
                <div>waoinf awofinwaf</div>
                <div>waoinf awofinwaf</div>
                <div>waoinf awofinwaf</div>
                <div>waoinf awofinwaf</div>
                <div>waoinf awofinwaf</div>
                <div>waoinf awofinwaf</div>
              </div>
              <div className={styles.tester}>
                <div>waoinf awofinwaf</div>
                <div>waoinf awofinwaf</div>
                <div>waoinf awofinwaf</div>
                <div>waoinf awofinwaf</div>
              </div>
            </Carousel>
          </Box>
        </Stack>
      </Box>
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

export default Slider
