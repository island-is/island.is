import React, { FC, useMemo } from 'react'
import { Document } from '@contentful/rich-text-types'
import {
  documentToReactComponents,
  Options,
} from '@contentful/rich-text-react-renderer'

export interface RichTextProps extends Options {
  document?: string | Document
}

export const RichText: FC<React.PropsWithChildren<RichTextProps>> = ({
  document,
  renderNode,
  renderMark,
  renderText,
}) => {
  const parsed = useMemo(() => {
    if (typeof document === 'object') {
      return document
    } else if (typeof document === 'string' && document[0] === '{') {
      return JSON.parse(document)
    }
    return null
  }, [document])

  return (
    <>
      {parsed
        ? documentToReactComponents(parsed, {
            renderNode,
            renderMark,
            renderText,
          })
        : document || null}
    </>
  )
}

export default RichText
