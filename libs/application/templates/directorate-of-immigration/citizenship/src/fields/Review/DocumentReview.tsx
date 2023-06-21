import { FieldBaseProps } from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import React, { FC } from 'react'
import DescriptionText from '../../components/DescriptionText'
import { review } from '../../lib/messages'

export const DocumentReview: FC<FieldBaseProps> = ({ application }) => {
  return (
    <Box paddingBottom={4} paddingTop={4}>
      <DescriptionText
        text={review.labels.documents}
        format={{ name: 'bla' }}
        textProps={{
          as: 'h4',
          fontWeight: 'semiBold',
          marginBottom: 0,
        }}
      />
    </Box>
  )
}
