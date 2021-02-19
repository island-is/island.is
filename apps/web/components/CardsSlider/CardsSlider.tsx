import React, { FC, useState, useRef, useCallback } from 'react'
import { useWindowSize, useIsomorphicLayoutEffect } from 'react-use'
import cn from 'classnames'
import AliceCarousel, { EventObject } from 'react-alice-carousel'
import 'react-alice-carousel/lib/alice-carousel.css'
import {
  Inline,
  Text,
  Box,
  Hidden,
  Button,
  TextProps,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { Card, CardProps } from '@island.is/web/components'
import * as styles from './CardsSlider.treat'

interface StagePaddingProps {
  paddingLeft: number
  paddingRight: number
}

interface CardsSliderProps {
  title: string
  titleProps?: TextProps
  cards: Array<CardProps>
}

const initialSlideState = {
  item: 0,
  slide: 0,
  itemsInSlide: 0,
  isPrevSlideDisabled: true,
  isNextSlideDisabled: false,
} as EventObject

export const CardsSlider: FC<CardsSliderProps> = ({
  title,
  titleProps = {},
  cards,
}) => {
  const { width } = useWindowSize()

  const [cardHeight, setCardHeight] = useState<string>('auto')
  const [slideState, setSlideState] = useState<EventObject>(initialSlideState)
  const [stagePadding, setStagePadding] = useState<StagePaddingProps>({
    paddingLeft: 0,
    paddingRight: 0,
  })
  const ref = useRef(null)

  const handleOnDragStart = (e) => e.preventDefault()

  const onResize = useCallback(() => {
    setCardHeight('auto')
    setStagePadding({
      paddingLeft: 0,
      paddingRight: width <= theme.breakpoints.md ? 80 : 0,
    })
  }, [ref, width])

  const spacing = width <= theme.breakpoints.md ? 16 : 24

  useIsomorphicLayoutEffect(() => {
    setTimeout(() => {
      if (cardHeight === 'auto') {
        const el = ref && ref.current?.stageComponent?.offsetParent
        if (el) {
          setCardHeight(el.offsetHeight)
        }
      }
    }, 0)
  }, [cardHeight])

  useIsomorphicLayoutEffect(() => {
    onResize()
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [onResize])

  const slideNext = () => {
    ref.current.slideNext()
  }

  const slidePrev = () => {
    ref.current.slidePrev()
  }

  const onSlideChanged = (e: EventObject) => {
    setSlideState(e)
  }

  const atEnd = slideState.isNextSlideDisabled
  const atStart = slideState.isPrevSlideDisabled

  return (
    <div className={cn(styles.wrapper)}>
      <Box paddingBottom={4}>
        <Text variant={'h3'} {...titleProps}>
          {title}
        </Text>
      </Box>

      <AliceCarousel
        ref={ref}
        infinite={false}
        onInitialized={onSlideChanged}
        onSlideChanged={onSlideChanged}
        stagePadding={stagePadding}
        startIndex={slideState.item}
        slideToIndex={slideState.item}
        responsive={{
          [theme.breakpoints.sm]: {
            items: 1,
          },
          [theme.breakpoints.md]: {
            items: 2,
          },
          [theme.breakpoints.lg]: {
            items: 3,
          },
        }}
        dotsDisabled={theme.breakpoints.md <= width}
        buttonsDisabled
        mouseTrackingEnabled
        items={cards.map(({ title, description, link, tags, image }, index) => (
          <div
            key={index}
            onDragStart={handleOnDragStart}
            style={{
              minHeight: cardHeight,
              paddingLeft: spacing,
            }}
            className={styles.item}
          >
            <Card
              description={description}
              title={title}
              tags={tags}
              link={link}
              image={image}
            />
          </div>
        ))}
      />
      <Hidden below="md">
        <Box position="absolute" top={0} right={0}>
          <Inline space={2}>
            <Button
              circle
              colorScheme="light"
              disabled={atStart}
              icon="arrowBack"
              aria-label="previousSlides"
              onClick={slidePrev}
            />
            <Button
              circle
              colorScheme="light"
              disabled={atEnd}
              icon="arrowForward"
              aria-label="nextSlides"
              onClick={slideNext}
            />
          </Inline>
        </Box>
      </Hidden>
    </div>
  )
}

export default CardsSlider
