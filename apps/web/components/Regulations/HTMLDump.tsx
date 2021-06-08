import React from 'react'
import { Box, BoxProps } from '@island.is/island-ui/core'
import { HTMLText } from '@island.is/regulations'

export type HTMLDumpProps = BoxProps & {
  html: HTMLText
  dangerouslySetInnerHTML?: undefined
}

export const HTMLDump = (props: HTMLDumpProps) => {
  const { html, ...boxProps } = props
  return <Box {...boxProps} dangerouslySetInnerHTML={{ __html: html }} />
}
