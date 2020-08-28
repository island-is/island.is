import React, {
  FC,
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
} from 'react'
import cn from 'classnames'
import AliceCarousel from 'react-alice-carousel'
import { Icon, Inline } from '@island.is/island-ui/core'
import { AdgerdirPage } from '@island.is/api/schema'
import { ColorSchemeContext, ColorSchemes } from '@island.is/adgerdir/context'
import { Card } from '../Card/Card'

import * as styles from './CardsSlider.treat'

interface StagePaddingProps {
  paddingLeft: number
  paddingRight: number
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface CardsSliderProps {
  variant?: ColorSchemes
  items: Array<AdgerdirPage>
}

export const CardsSlider: FC<CardsSliderProps> = ({ items, variant }) => {
  const { colorScheme } = useContext(ColorSchemeContext)

  const [height, setHeight] = useState<string>('auto')
  const [stagePadding, setStagePadding] = useState<StagePaddingProps>({
    paddingLeft: 0,
    paddingRight: 0,
  })
  const ref = useRef(null)
  const prevRef = useRef(null)
  const nextRef = useRef(null)

  const handleOnDragStart = (e) => e.preventDefault()

  const handleResize = useCallback(() => {
    let paddingRight = 0

    const w = window.innerWidth

    if (w >= 768) {
      paddingRight = 124
    }

    setStagePadding({
      paddingLeft: 0,
      paddingRight,
    })

    const el = ref && ref.current?.stageComponent?.offsetParent

    if (el) {
      setHeight('auto')
      setHeight(`${el.offsetHeight}px`)
    }
  }, [ref])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize)
      setTimeout(handleResize, 0)
    }

    return () => window.removeEventListener('resize', handleResize)
  }, [handleResize])

  const slideNext = () => {
    ref.current.slideNext()
  }

  const slidePrev = () => {
    ref.current.slidePrev()
  }

  const Dots = () => {
    if (ref.current) {
      const { slides, items } = ref.current.state

      const jump = Math.floor(slides.length / items)

      return (
        <div className={styles.dotsContainer}>
          {[...Array(jump).keys()].map((item, index) => {
            return (
              <button
                key={item}
                onClick={() => ref.current.slideTo(index * items)}
                className={styles.dot}
              />
            )
          })}
        </div>
      )
    }

    return null
  }

  return (
    <div
      className={cn(styles.wrapper, styles.variants[variant || colorScheme])}
    >
      <AliceCarousel
        ref={ref}
        infinite={false}
        stagePadding={stagePadding}
        responsive={{
          0: {
            items: 1,
          },
          1200: {
            items: 2,
          },
        }}
        preservePosition
        dotsDisabled
        buttonsDisabled
        mouseTrackingEnabled
      >
        {items.map(({ title, description, tags }, index) => {
          return (
            <div
              key={index}
              onDragStart={handleOnDragStart}
              style={{ minHeight: height, display: 'inline-flex' }}
              className={styles.item}
            >
              <Card
                description={description}
                title={title}
                tags={tags}
                variant={colorScheme}
              />
            </div>
          )
        })}
      </AliceCarousel>

      <div className={styles.controls}>
        <Inline space={2}>
          <button
            className={cn(styles.arrowButton, {})}
            ref={prevRef}
            onClick={slidePrev}
          >
            <Icon type="arrowLeft" color="white" width="18" height="18" />
          </button>
          <button
            className={cn(styles.arrowButton, {})}
            ref={nextRef}
            onClick={slideNext}
          >
            <Icon type="arrowRight" color="white" width="18" height="18" />
          </button>
        </Inline>
      </div>

      <Dots />
    </div>
  )
}

export default CardsSlider
