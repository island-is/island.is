import React, {
  useState,
  useRef,
  useEffect,
  TouchEventHandler,
  FC,
  ReactNode,
} from 'react'
import cn from 'classnames'
import { useWindowSize } from 'react-use'
import {
  Box,
  Button,
  Hidden,
  Inline,
  Text,
  Logo,
} from '@island.is/island-ui/core'

import * as styles from './SimpleSlider.treat'

type BreakpointOption = Partial<
  Pick<SlideState, 'slideWidthOffset' | 'gutterWidth' | 'slideCount'>
>

type Breakpoints = Record<number, BreakpointOption>

interface SimpleSliderProps {
  title?: string
  titleColor?: 'white' | 'dark400'
  gutterWidth?: SlideState['gutterWidth']
  slideCount?: SlideState['slideCount']
  breakpoints?: SlideState['breakpoints']
  slideWidthOffset?: SlideState['slideWidthOffset']
  items: ReactNode[]
  carouselController?: boolean
  logo?: boolean
}

interface SlideState {
  slideWidth: number
  current: number
  gutterWidth: number
  slideCount: number
  slideWidthOffset?: number
  breakpoints: Breakpoints
}

export const SimpleSlider: FC<SimpleSliderProps> = ({
  items,
  slideCount = 1,
  gutterWidth = 0,
  slideWidthOffset = 0,
  breakpoints = {},
  title,
  titleColor,
  carouselController,
  logo,
}) => {
  const start = useRef(0)
  const touchDirection = useRef(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [ready, setReady] = useState<boolean>(false)
  const [position, setPosition] = useState<number>(0)
  const [slideState, setSlideState] = useState<SlideState>({
    slideCount,
    gutterWidth,
    slideWidthOffset,
    breakpoints,
    slideWidth: 0,
    current: 0,
  })

  const numberOfSlides = items.length

  const { width } = useWindowSize()

  useEffect(() => {
    const current = Object.keys(slideState.breakpoints).filter(
      (x) => parseInt(x, 10) <= width,
    )

    const key = current.length && current[current.length - 1]
    const breakpointOption = slideState.breakpoints[key] ?? {}

    const containerWidth = containerRef.current.offsetWidth

    const newSlideCount = breakpointOption.slideCount ?? slideCount
    const newGutterWidth = breakpointOption.gutterWidth ?? gutterWidth
    const newSlideWidthOffset = breakpointOption.slideWidthOffset ?? 0

    const slideWidth = Math.abs(
      newSlideWidthOffset - (containerWidth + newGutterWidth) / newSlideCount,
    )

    setSlideState({
      ...slideState,
      slideCount: newSlideCount,
      gutterWidth: newGutterWidth,
      slideWidthOffset: newSlideWidthOffset,
      slideWidth,
    })
  }, [width])

  useEffect(() => {
    setPosition(slideState.slideWidth * slideState.current * -1)
  }, [slideState.current])

  const goTo = (index: number) => {
    setSlideState({
      ...slideState,
      current: index,
    })
  }

  useEffect(() => {
    if (slideState.slideWidth > 0) {
      setReady(true)
    }
  }, [slideState.slideWidth])

  const traverse = (direction: 'prev' | 'next') => {
    let current: number

    switch (direction) {
      case 'next':
        current = slideState.current + 1
        if (current > numberOfSlides - slideState.slideCount) {
          return false
        }
        break
      case 'prev':
        current = slideState.current - 1
        if (current < 0) {
          return false
        }
        break
      default:
        break
    }

    setSlideState({
      ...slideState,
      current,
    })
  }

  const handleTouchStart: TouchEventHandler<HTMLDivElement> = (e) => {
    start.current = e.targetTouches[0].pageX
  }

  const handleTouchEnd: TouchEventHandler<HTMLDivElement> = (e) => {
    switch (touchDirection.current) {
      case 'right':
        traverse('next')
        break
      case 'left':
        traverse('prev')
        break
      default:
        break
    }
  }

  const handleTouchMove: TouchEventHandler<HTMLDivElement> = (e) => {
    const diff = Math.abs(start.current - e.targetTouches[0].pageX)

    if (diff > 10) {
      touchDirection.current =
        start.current < e.targetTouches[0].pageX ? 'left' : 'right'
    }
  }

  const atStart = slideState.current === 0
  const atEnd = slideState.current === items.length - 1
  return (
    <Box
      ref={containerRef}
      className={cn(styles.container)}
      style={{
        marginRight: `-${slideState.gutterWidth}px`,
      }}
    >
      {!!title && (
        <Box paddingBottom={4}>
          <Inline space={2}>
            {logo && <Logo width={24} iconOnly />}
            <Text variant="h3">{title}</Text>
          </Inline>
        </Box>
      )}
      <Box className={styles.nav}>
        {!carouselController && (
          <Hidden above="sm">
            <Inline space={2}>
              {items.map((x, index) => {
                return (
                  <button
                    key={index}
                    className={cn(styles.dot, {
                      [styles.dotActive]: index === slideState.current,
                    })}
                    onClick={() => goTo(index)}
                  />
                )
              })}
            </Inline>
          </Hidden>
        )}
        <Hidden below="md">
          <Inline space={2}>
            <Button
              circle
              colorScheme="light"
              disabled={atStart}
              icon="arrowBack"
              aria-label="previousSlides"
              onClick={() => traverse('prev')}
            />
            <Button
              circle
              colorScheme="light"
              disabled={atEnd}
              icon="arrowForward"
              aria-label="nextSlides"
              onClick={() => traverse('next')}
            />
          </Inline>
        </Hidden>
      </Box>
      {!!ready && (
        <Box
          className={styles.innerContainer}
          style={{
            transform: `translate3d(${position}px, 0, 0)`,
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {items.map((item, index) => {
            return (
              <Box
                key={index}
                className={styles.slide}
                style={{
                  width: `${slideState.slideWidth}px`,
                  paddingRight: `${slideState.gutterWidth}px`,
                }}
              >
                {item}
              </Box>
            )
          })}
        </Box>
      )}
      {carouselController && (
        <Box display={'flex'} justifyContent="flexEnd" marginTop={[3, 3, 4]}>
          <Inline space={2}>
            {items.map((x, index) => {
              if (index <= numberOfSlides - slideState.slideCount) {
                return (
                  <button
                    key={index}
                    className={cn(styles.dot, {
                      [styles.dotActive]: index === slideState.current,
                    })}
                    onClick={() => goTo(index)}
                  />
                )
              }
            })}
          </Inline>
        </Box>
      )}
    </Box>
  )
}

export default SimpleSlider
