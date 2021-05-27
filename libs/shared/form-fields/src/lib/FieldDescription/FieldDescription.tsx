import React, { FC } from 'react'
import { Text } from '@island.is/island-ui/core'
import Markdown from 'markdown-to-jsx'

interface Props {
  description: string
}

export const FieldDescription: FC<Props> = ({ description }) => {
  return (
    <Text marginTop={1} marginBottom={1}>
      <Markdown>{description}</Markdown>
    </Text>
  )
}

export default FieldDescription
