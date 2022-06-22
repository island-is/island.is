import React, { FC } from 'react'
import { Text } from '@island.is/island-ui/core'
import Markdown, { MarkdownToJSX } from 'markdown-to-jsx'

interface Props {
  description: string
  markdownOptions?: MarkdownToJSX.Options
}

export const FieldDescription: FC<Props> = ({
  description,
  markdownOptions,
}) => {
  return (
    <Text marginTop={1} marginBottom={1} as="div">
      <Markdown options={markdownOptions}>{description}</Markdown>
    </Text>
  )
}

export default FieldDescription
