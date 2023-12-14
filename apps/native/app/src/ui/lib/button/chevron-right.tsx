import React from 'react'
import { Image } from 'react-native'
import ChevronForward from '../../assets/alert/chevron-forward.png'
import { blue400 } from '../../utils'

export function ChevronRight() {
  return (
    <Image
      source={ChevronForward}
      style={{ width: 24, height: 24, tintColor: blue400 }}
    />
  )
}
