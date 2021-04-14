import { NoChildren } from '@island.is/web/types'
import React, { FC } from 'react'
import { HTMLText } from './Regulations.types'

export type HTMLDumpProps = {
  content: HTMLText
  className?: string
  tag?: 'span' | 'div' | 'p' | 'section'
}

export const HTMLDump: FC<HTMLDumpProps & NoChildren> = (props) => {
  const Tag = props.tag || 'div'
  return (
    <Tag
      className={props.className}
      dangerouslySetInnerHTML={{ __html: props.content }}
    />
  )
}
