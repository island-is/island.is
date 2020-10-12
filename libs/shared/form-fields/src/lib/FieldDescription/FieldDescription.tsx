import React, { FC } from 'react'
import { Text } from '@island.is/island-ui/core'

interface Props {
  description: string
}

export const FieldDescription: FC<Props> = ({ description }) => {
  const getMarkup = () => {
    return {
      __html: description,
    }
  }
  return (
    <Text marginTop={2} marginBottom={1}>
      {/* <span dangerouslySetInnerHTML={getMarkup()} /> */}
      {description}
    </Text>
  )
}

export default FieldDescription
