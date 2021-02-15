import React, {
  FC,
  useState,
  useRef,
  useCallback,
  useEffect,
} from 'react'
import cn from 'classnames'
import AliceCarousel, { EventObject } from 'react-alice-carousel'
import {
  Inline,
  Text,
  Box,
  Hidden,
  Button,
} from '@island.is/island-ui/core'
import 'react-alice-carousel/lib/alice-carousel.css'
import * as styles from './CardsSlider.treat'
import { Card, CardProps } from '@island.is/web/components'
import { useWindowSize, useIsomorphicLayoutEffect, useMountedState, useMeasure } from 'react-use'

interface StagePaddingProps {
  paddingLeft: number
  paddingRight: number
}

interface CardsSliderProps {
  title: string
  cards: Array<CardProps>
}

const initialSlideState = {
  item: 0,
  slide: 0,
  itemsInSlide: 0,
  isPrevSlideDisabled: true,
  isNextSlideDisabled: false,
} as EventObject

export const CardsSlider: FC<CardsSliderProps> = ({ title, cards }) => {
  const { width } = useWindowSize()
  const isMounted = useMountedState()
  const [wrapperHeight] = useMeasure()
  const [titleHeight] = useMeasure()

  const [cardHeight, setCardHeight] = useState<string>('auto')
  const [slideState, setSlideState] = useState<EventObject>(initialSlideState)
  const [stagePadding, setStagePadding] = useState<StagePaddingProps>({
    paddingLeft: 0,
    paddingRight: 0,
  })
  const ref = useRef(null)

  const handleOnDragStart = (e) => e.preventDefault()


  useEffect(() => {
    setCardHeight('auto')

    if(isMounted ) {
      const wrapperHeight = document.getElementById('wrapperwrapper')?.clientHeight
      const titleHeight = document.getElementById('titlewrapper')?.clientHeight
       //setCardHeight(`${wrapperHeight - titleHeight}px`)

    }
      
    
  }, [ref])

  const onResize = useCallback(() => {
    setCardHeight('auto')

    setStagePadding({
      paddingLeft: 0,
      paddingRight: width >= 768 ? 124 : 50,
    })

    const el = ref && ref.current?.stageComponent?.offsetParent

    console.log("el er:", el)

    if (el) {
      console.log("setjum height sem: ", el.offsetHeight)
      setCardHeight(`${el.offsetHeight}px`)
      setSlideState({
        ...initialSlideState,
        itemsInSlide: ref.current.state.items,
      })
    }
  }, [ref])

  useIsomorphicLayoutEffect(() => {
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
    <div className={cn(styles.wrapper)} id="wrapper" ref={wrapperHeight}>
      <Box id="titleWrapper" paddingBottom={4} ref={titleHeight}>
        <Text variant={'h3'}>{title}</Text>
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
          0: {
            items: 1,
          },
          425: {
            items: 2,
          },
        }}
        dotsDisabled
        buttonsDisabled
        mouseTrackingEnabled
        items={cards.map(({ title, description, link, tags, image }, index) => (
          <div
            key={index}
            onDragStart={handleOnDragStart}
            style={{ minHeight: cardHeight }}
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
