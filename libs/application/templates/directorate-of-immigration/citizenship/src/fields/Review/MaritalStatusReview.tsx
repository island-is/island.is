import { FieldBaseProps } from '@island.is/application/types'
import { Box, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import { FC } from 'react'
import DescriptionText from '../../components/DescriptionText'
import { review } from '../../lib/messages'
import { Citizenship } from '../../lib/dataSchema'
import * as kennitala from 'kennitala'
import { Routes } from '../../lib/constants'
import SummaryBlock from '../../components/SummaryBlock'

interface Props extends FieldBaseProps {
  goToScreen?: (id: string) => void
  route: Routes
}

export const MaritalStatusReview: FC<Props> = ({
  application,
  goToScreen,
  route,
}: Props) => {
  const answers = application.answers as Citizenship

  return (
    <SummaryBlock editAction={() => goToScreen?.(route)}>
      <Box paddingBottom={4}>
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
            <Text>{answers?.maritalStatus?.dateOfMaritalStatus}</Text>
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
    </SummaryBlock>
  )
}
