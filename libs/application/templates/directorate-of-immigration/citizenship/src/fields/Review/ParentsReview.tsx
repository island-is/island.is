import {
  FieldBaseProps,
  FieldComponents,
  FieldTypes,
} from '@island.is/application/types'
import { Box, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import { FC } from 'react'
import { review } from '../../lib/messages'
import { Citizenship } from '../../lib/dataSchema'
import { Routes } from '../../lib/constants'
import SummaryBlock from '../../components/SummaryBlock'
import { DescriptionFormField } from '@island.is/application/ui-fields'
import { useLocale } from '@island.is/localization'

interface Props extends FieldBaseProps {
  goToScreen?: (id: string) => void
  route: Routes
}

export const ParentsReview: FC<Props> = ({
  application,
  goToScreen,
  route,
}) => {
  const answers = application.answers as Citizenship
  const { formatMessage } = useLocale()
  return (
    <SummaryBlock editAction={() => goToScreen?.(route)}>
      <Box paddingBottom={4}>
        {DescriptionFormField({
          application: application,
          showFieldName: false,
          field: {
            id: 'title',
            title: '',
            description: formatMessage(review.labels.parents),
            titleVariant: 'h4',
            type: FieldTypes.DESCRIPTION,
            component: FieldComponents.DESCRIPTION,
            children: undefined,
          },
        })}
        <GridRow>
          {answers?.parentInformation?.parents &&
            answers?.parentInformation?.parents?.map((parent) => {
              if (parent.wasRemoved === 'false') {
                return (
                  <GridColumn span="1/2">
                    <Text>{parent.fullName}</Text>
                  </GridColumn>
                )
              } else return null
            })}
        </GridRow>
      </Box>
    </SummaryBlock>
  )
}
