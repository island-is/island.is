import React from 'react'
import { Box, BoxProps } from '@island.is/island-ui/core'
import { HTMLText } from './types'

export type HTMLBoxProps = BoxProps & {
  html: HTMLText
  dangerouslySetInnerHTML?: undefined
}

export const HTMLBox = (props: HTMLBoxProps) => {
  const { html, ...boxProps } = props
  return <Box {...boxProps} dangerouslySetInnerHTML={{ __html: html }} />
}
