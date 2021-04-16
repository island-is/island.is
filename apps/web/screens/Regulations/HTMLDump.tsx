import React, { FC } from 'react'
import { NoChildren } from '@island.is/web/types'
import { Box, BoxProps } from '@island.is/island-ui/core'
import { HTMLText } from './Regulations.types'

export type HTMLDumpProps = BoxProps & {
  html: HTMLText
  dangerouslySetInnerHTML?: undefined
}

export const HTMLDump: FC<HTMLDumpProps & NoChildren> = (props) => {
  const { html, ...boxProps } = props
  return <Box {...boxProps} dangerouslySetInnerHTML={{ __html: html }} />
}
