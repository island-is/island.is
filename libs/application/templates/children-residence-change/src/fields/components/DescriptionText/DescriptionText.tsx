import React from 'react'
import HtmlParser from 'react-html-parser'
import { Box, Text } from '@island.is/island-ui/core'

interface Props {
  textNode: string
}

const DescriptionText = ({ textNode }: Props) => {
  const text = HtmlParser(textNode)
  return (
    <Box marginBottom={5} marginTop={3}>
      {text.map((item, i) => (
        <Text marginBottom={i + 1 === text.length ? 0 : 2}>
          {item.props.children[0]}
        </Text>
      ))}
    </Box>
  )
}

export default DescriptionText
