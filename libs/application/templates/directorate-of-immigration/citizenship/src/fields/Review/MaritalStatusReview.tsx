import {
  FieldBaseProps,
  FieldComponents,
  FieldTypes,
} from '@island.is/application/types'
import { Box, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import { FC } from 'react'
import { review } from '../../lib/messages'
import { Citizenship } from '../../lib/dataSchema'
import * as kennitala from 'kennitala'
import { Routes } from '../../lib/constants'
import SummaryBlock from '../../components/SummaryBlock'
import { useLocale } from '@island.is/localization'
import { DescriptionFormField } from '@island.is/application/ui-fields'
import { formatDate } from '../../utils'

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

  const { formatMessage } = useLocale()

  return (
    <SummaryBlock editAction={() => goToScreen?.(route)}>
      <Box paddingBottom={4}>
        <GridRow>
          <GridColumn span="1/2">
            {DescriptionFormField({
              application: application,
              showFieldName: false,
              field: {
                id: 'title',
                title: '',
                description: formatMessage(review.labels.maritalStatus),
                titleVariant: 'h4',
                type: FieldTypes.DESCRIPTION,
                component: FieldComponents.DESCRIPTION,
                children: undefined,
              },
            })}
            <Text>{answers?.maritalStatus?.status}</Text>
            <Text>
              {formatDate(
                new Date(answers?.maritalStatus?.dateOfMaritalStatusStr),
              )}
            </Text>
          </GridColumn>
          <GridColumn span="1/2">
            {DescriptionFormField({
              application: application,
              showFieldName: false,
              field: {
                id: 'title',
                title: '',
                description: formatMessage(review.labels.partner),
                titleVariant: 'h4',
                type: FieldTypes.DESCRIPTION,
                component: FieldComponents.DESCRIPTION,
                children: undefined,
              },
            })}
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
