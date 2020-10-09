import React, { FC } from 'react'
import { Text } from '@island.is/island-ui/core'

const Description: FC<{ description: string }> = ({ description }) => {
  const getMarkup = () => {
    return {
      __html: description,
    }
  }
  return (
    <Text marginTop={2} marginBottom={1}>
      <span dangerouslySetInnerHTML={getMarkup()} />
    </Text>
  )
}

export default Description
