import React, { FC, Children, useRef, useState, useEffect } from 'react'
import cn from 'classnames'
import chunk from 'lodash/chunk'

import {
  Box,
  GridColumn,
  GridColumnProps,
  GridContainer,
  GridRow,
  Hidden,
  Inline,
} from '@island.is/island-ui/core'

import * as styles from './SimpleStackedSlider.treat'

interface SimpleStackedSliderProps {
  span?: GridColumnProps['span']
  levels?: number
  itemWidth?: number
}

export const SimpleStackedSlider: FC<SimpleStackedSliderProps> = ({
  children,
  levels = 3,
  itemWidth = 400,
  span = '4/12',
}) => {
  const [activeDot, setActiveDot] = useState(0)
  const [fullItemWidth, setFullItemWidth] = useState(0)
  const scrollRef = useRef(null)
  const itemRef = useRef(null)

  const items = Children.toArray(children)

  const chunks = chunk(items, Math.round(items.length / levels))
  const rowLength = chunks[0].length

  useEffect(() => {
    if (itemRef.current) {
      const style = window.getComputedStyle
        ? getComputedStyle(itemRef.current, null)
        : itemRef.current.currentStyle

      setFullItemWidth(
        itemRef.current.offsetWidth + parseInt(style.marginRight) || 0,
      )
    }
  }, [itemRef])

  const renderedItems = (
    <GridContainer>
      <GridRow>
        {items.map((item, index) => {
          return (
            <GridColumn key={index} span={span} paddingBottom={3}>
              {item}
            </GridColumn>
          )
        })}
      </GridRow>
    </GridContainer>
  )

  if (items.length <= levels) {
    return renderedItems
  }

  return (
    <>
      <Hidden below="lg">{renderedItems}</Hidden>

      <Hidden above="md">
        <Box ref={scrollRef} className={styles.outer}>
          <GridContainer>
            <Box className={styles.inner}>
              {chunks.map((chunk, chunkIndex) => {
                return (
                  <Box key={`chunk-${chunkIndex}`} className={styles.row}>
                    {chunk.map((item, index) => {
                      const firstItem = chunkIndex === 0 && index === 0

                      return (
                        <Box
                          {...(firstItem && { ref: itemRef })}
                          key={`item-${index}`}
                          paddingBottom={3}
                          className={styles.column}
                          style={{
                            width: itemWidth,
                          }}
                        >
                          {item}
                        </Box>
                      )
                    })}
                  </Box>
                )
              })}
            </Box>
          </GridContainer>
        </Box>

        <GridContainer>
          <Box display="flex" justifyContent="flexEnd">
            <Inline space={2}>
              {[...Array(rowLength)].map((_, index) => {
                return (
                  <button
                    key={index}
                    className={cn(styles.dot, {
                      [styles.dotActive]: activeDot === index,
                    })}
                    onClick={() => {
                      setActiveDot(index)
                      scrollRef.current.scrollTo({
                        left: index * fullItemWidth,
                        behavior: 'smooth',
                      })
                    }}
                  />
                )
              })}
            </Inline>
          </Box>
        </GridContainer>
      </Hidden>
    </>
  )
}

export default SimpleStackedSlider
