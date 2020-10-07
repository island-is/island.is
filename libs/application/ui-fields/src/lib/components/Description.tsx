import React, { FC } from 'react'
import { Typography } from '@island.is/island-ui/core'

const Description: FC<{ description: string }> = ({ description }) => {
  const getMarkup = () => {
    return {
      __html: description,
    }
  }
  return (
    <Typography marginTop={2} marginBottom={1} variant="p">
      <span dangerouslySetInnerHTML={getMarkup()} />
    </Typography>
  )
}

export default Description
