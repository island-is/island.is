import React, { useState, useEffect, useRef, useCallback } from 'react'
import AliceCarousel from 'react-alice-carousel'
// import {} from '@island.is/island-ui/core'
import { Card } from '../Card/Card'

import * as styles from './CardsSlider.treat'

const tmp = [
  {
    title: 'Ferðagjöf',
    description:
      'Stafræn gjafabréf að fjárhæð 5.000 kr. til að verja í ferðaþjónustu innanlands.',
  },
  {
    title: 'Alþjóðlegt markaðsátak',
    description:
      'Kapp er lagt á að Ísland verði með fyrstu löndum til að byggja aftur upp eftirspurn.',
  },
  {
    title: 'Gistináttaskattur afnuminn',
    description:
      'Gistináttaskattur hefur verið afnuminn út næsta ár, til ársloka 2021.',
  },
  {
    title: 'Ferðagjöf',
    description:
      'Stafræn gjafabréf að fjárhæð 5.000 kr. til að verja í ferðaþjónustu innanlands.',
  },
  {
    title: 'Alþjóðlegt markaðsátak',
    description:
      'Kapp er lagt á að Ísland verði með fyrstu löndum til að byggja aftur upp eftirspurn.',
  },
  {
    title: 'Gistináttaskattur afnuminn',
    description:
      'Gistináttaskattur hefur verið afnuminn út næsta ár, til ársloka 2021.',
  },
  {
    title: 'Gistináttaskattur afnuminn',
    description:
      'Gistináttaskattur hefur verið afnuminn út næsta ár, til ársloka 2021.',
  },
]

interface StagePaddingProps {
  paddingLeft: number
  paddingRight: number
}

export const CardsSlider = () => {
  const [height, setHeight] = useState<string>('auto')
  const [stagePadding, setStagePadding] = useState<StagePaddingProps>({
    paddingLeft: 0,
    paddingRight: 0,
  })
  const ref = useRef(null)

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

  return (
    <>
      <div className={styles.wrapper}>
        <AliceCarousel
          ref={ref}
          infinite={false}
          dotsDisabled
          buttonsDisabled
          stagePadding={stagePadding}
          responsive={{
            0: {
              items: 1,
            },
            1200: {
              items: 2,
            },
          }}
          mouseTrackingEnabled
        >
          {tmp.map(({ title, description }, index) => {
            return (
              <>
                <div
                  onDragStart={handleOnDragStart}
                  style={{ minHeight: height, display: 'inline-flex' }}
                  className={styles.item}
                >
                  <Card
                    key={index}
                    description={description}
                    title={title}
                    tags={[
                      { title: 'Styrkir', tagProps: { variant: 'red' } },
                      { title: 'Lán', tagProps: { variant: 'red' } },
                      { title: 'Atvinnulíf', tagProps: { variant: 'red' } },
                    ]}
                  />
                </div>
              </>
            )
          })}
        </AliceCarousel>
      </div>
    </>
  )
}

export default CardsSlider
