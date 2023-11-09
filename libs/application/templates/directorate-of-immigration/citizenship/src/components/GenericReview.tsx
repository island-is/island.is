import SummaryBlock from './SummaryBlock'
import { Box, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import { Routes } from '../lib/constants'
import { DescriptionFormField } from '@island.is/application/ui-fields'
import {
  Application,
  FieldComponents,
  FieldTypes,
  FormValue,
} from '@island.is/application/types'

interface GenericReviewProps {
  leftColumnItems: Array<string>
  rightColumnItems: Array<string>
  leftDescription: string
  goToScreen?: (id: string) => void
  route: Routes
  application: Application<FormValue>
}

export const GenericReview = ({
  leftColumnItems,
  rightColumnItems,
  leftDescription,
  goToScreen,
  route,
  application,
}: GenericReviewProps) => {
  return (
    <SummaryBlock editAction={() => goToScreen?.(route)}>
      <Box paddingBottom={4}>
        <Box>
          {DescriptionFormField({
            application: application,
            showFieldName: false,
            field: {
              id: 'title',
              title: '',
              description: leftDescription,
              titleVariant: 'h4',
              type: FieldTypes.DESCRIPTION,
              component: FieldComponents.DESCRIPTION,
              children: undefined,
            },
          })}
        </Box>
        <GridRow>
          <GridColumn span="1/2">
            {leftColumnItems.map((item) => {
              return <Text>{item}</Text>
            })}
          </GridColumn>
          <GridColumn span="1/2">
            {rightColumnItems.map((item) => {
              return <Text>{item}</Text>
            })}
          </GridColumn>
        </GridRow>
      </Box>
    </SummaryBlock>
  )
}
