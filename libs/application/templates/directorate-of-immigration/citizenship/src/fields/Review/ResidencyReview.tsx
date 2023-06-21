import { FieldBaseProps } from '@island.is/application/types'
import { Box, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import React, { FC } from 'react'
import DescriptionText from '../../components/DescriptionText'
import { review } from '../../lib/messages'
import { Citizenship } from '../../lib/dataSchema'

export const ResidencyReview: FC<FieldBaseProps> = ({ application }) => {
  const answers = application.answers as Citizenship

  return (
    <Box paddingBottom={4} paddingTop={4}>
      <DescriptionText
        text={review.labels.residency}
        textProps={{
          as: 'h4',
          fontWeight: 'semiBold',
          marginBottom: 0,
        }}
      />
      <GridRow>
        <GridColumn span="1/1">
          <Text></Text>
        </GridColumn>
      </GridRow>
    </Box>
  )
}
