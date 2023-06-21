import { FieldBaseProps } from '@island.is/application/types'
import { Box, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import React, { FC } from 'react'
import DescriptionText from '../../components/DescriptionText'
import { review } from '../../lib/messages'
import { Citizenship } from '../../lib/dataSchema'
import * as kennitala from 'kennitala'

export const MaritalStatusReview: FC<FieldBaseProps> = ({ application }) => {
  const answers = application.answers as Citizenship

  return (
    <Box paddingBottom={4} paddingTop={4}>
      <GridRow>
        <GridColumn span="1/2">
          <DescriptionText
            text={review.labels.maritalStatus}
            textProps={{
              as: 'h4',
              fontWeight: 'semiBold',
              marginBottom: 0,
            }}
          />
          <Text>{answers?.maritalStatus?.status}</Text>
          <Text>{answers?.maritalStatus?.dateOfMarritalStatus}</Text>
        </GridColumn>
        <GridColumn span="1/2">
          <DescriptionText
            text={review.labels.partner}
            textProps={{
              as: 'h4',
              fontWeight: 'semiBold',
              marginBottom: 0,
            }}
          />
          <Text>{answers?.maritalStatus?.name}</Text>
          <Text>{kennitala.format(answers?.maritalStatus?.nationalId)}</Text>
          <Text>{answers?.maritalStatus?.birthCountry}</Text>
          <Text>{answers?.maritalStatus?.citizenship}</Text>
        </GridColumn>
      </GridRow>
    </Box>
  )
}
