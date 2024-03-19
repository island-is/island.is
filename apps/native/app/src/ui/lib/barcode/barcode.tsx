import React, { useEffect, useRef } from 'react'
import { Animated, Easing, StyleSheet } from 'react-native'
import { BarcodeCreatorView, BarcodeFormat } from 'react-native-barcode-creator'
import styled from 'styled-components/native'
import { theme } from '../../utils/theme'

const Wrapper = styled(Animated.View)`
  flex: 1;
  overflow: hidden;
`

const BARCODE_VERTICAL_PADDING = (theme.spacing.smallGutter / 2) * 2
export const BARCODE_CONTAINER_HEIGHT = 80
export const BARCODE_HEIGHT =
  BARCODE_CONTAINER_HEIGHT - BARCODE_VERTICAL_PADDING

interface BarcodeProps {
  value: string
  format?: keyof typeof BarcodeFormat
}

export const Barcode = ({
  value,
  format = BarcodeFormat.PDF417,
}: BarcodeProps) => {
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

  return (
    <Wrapper style={{ opacity: fadeAnim }}>
      <BarcodeCreatorView
        value={value}
        background={'#FFFFFF'}
        foregroundColor={'#000000'}
        format={format}
        style={styles.box}
      />
    </Wrapper>
  )
}

const styles = StyleSheet.create({
  box: {
    height: BARCODE_HEIGHT,
  },
})
