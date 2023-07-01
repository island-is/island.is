import React, { useMemo } from 'react'
import { BLOCKS } from '@contentful/rich-text-types'
import { Typography } from '@island.is/island-ui/core'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'

const options = {
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node, children) => {
      return (
        <Typography variant="intro" links>
          {children}
        </Typography>
      )
    },
  },
}

type Props = {
  document: string
}

export const IntroText: React.FC<React.PropsWithChildren<Props>> = ({
  document,
}) => {
  const parsed = useMemo(() => {
    if (typeof document === 'object') {
      return document
    } else if (typeof document === 'string' && document[0] === '{') {
      return JSON.parse(document)
    }
    return null
  }, [document])
  return <>{documentToReactComponents(parsed, options)}</>
}

export default IntroText
