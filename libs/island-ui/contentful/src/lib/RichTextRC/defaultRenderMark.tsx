import React, { ReactNode } from 'react'
import { MARKS } from '@contentful/rich-text-types'
import { RenderMark } from '@contentful/rich-text-react-renderer'

export const defaultRenderMarkObject: Readonly<RenderMark> = {
  [MARKS.BOLD]: (text: ReactNode) => <strong>{text}</strong>,
  [MARKS.ITALIC]: (text: ReactNode) => <em>{text}</em>,
  // should text be underlinable inside contentful rich text? it is at the moment
  // it is not provided by <Text> and we don't want the default <u> element
  [MARKS.UNDERLINE]: (text: ReactNode) => (
    <span style={{ textDecoration: 'underline' }}>{text}</span>
  ),
}
