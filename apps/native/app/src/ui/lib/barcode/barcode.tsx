import React, { useEffect, useMemo, useRef } from 'react'
import { Animated, Easing } from 'react-native'
import styled from 'styled-components/native'
import Svg, { G, Path } from 'react-native-svg'
import { createPDF417 } from '../../../lib/pdf417/pdf417-min'

const PDF417 = createPDF417()

const Wrapper = styled(Animated.View)`
  flex: 1;
  overflow: hidden;
`

interface BarcodeProps {
  value: string
  width: number
  /**
   * The height of each row within PDF417 must satisfy a width-to-height ratio between 1:2 and 1:5.
   */
  height: number
}

export const Barcode = ({ value, width, height }: BarcodeProps) => {
  const barcodeValue = useRef(value)
  const fadeAnim = useRef(new Animated.Value(0)).current

  const fadeIn = (duration = 200) => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration,
      useNativeDriver: true,
      easing: Easing.in(Easing.ease),
    }).start()
  }

  const fadeOut = (duration: number) => {
    Animated.timing(fadeAnim, {
      toValue: 0.5,
      duration,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }).start()
  }

  useEffect(() => {
    fadeIn()
  }, [fadeAnim])

  useEffect(() => {
    const fadeOutDuration = 400

    if (value !== barcodeValue.current) {
      fadeOut(fadeOutDuration)
      setTimeout(() => {
        fadeIn(400)
        barcodeValue.current = value
      }, fadeOutDuration)
    }
  }, [value])

  const path = useMemo(() => {
    PDF417.init(value, -1, 2)
    const barcode = PDF417.getBarcodeArray() as {
      num_rows: number
      num_cols: number
      bcode: Array<Array<string>>
    }

    // Calculate width and height of each cell in the barcode
    const cellWidth = width / barcode.num_cols
    const cellHeight = height / barcode.num_rows

    // Create a path string for the barcode shapes
    let pathStr = ''

    for (let i = 0; i < barcode.bcode.length; i++) {
      const line = barcode.bcode[i]

      for (let j = 0; j < line.length; j++) {
        const code = line[j]
        if (code === '1') {
          // Move to the starting point of the rectangle
          pathStr += `M ${j * cellWidth} ${i * cellHeight} `
          // Draw a rectangle of width 'cellWidth' and height 'cellHeight'
          pathStr += `h ${cellWidth} v ${cellHeight} h -${cellWidth} `
          // Close the path
          pathStr += `Z `
        }
      }
    }

    return pathStr
  }, [value])

  return (
    <Wrapper style={{ opacity: fadeAnim }}>
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <Path d={path} fill="#000000" />
      </Svg>
    </Wrapper>
  )
}
