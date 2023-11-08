import {
  FieldBaseProps,
  FieldComponents,
  FieldTypes,
} from '@island.is/application/types'
import { Box, GridColumn, GridRow } from '@island.is/island-ui/core'
import { FC } from 'react'
import { review } from '../../lib/messages'
import { Citizenship } from '../../lib/dataSchema'
import { getSelectedCustodyChildren } from '../../utils/childrenInfo'
import { Routes } from '../../lib/constants'
import SummaryBlock from '../../components/SummaryBlock'
import { useLocale } from '@island.is/localization'
import { DescriptionFormField } from '@island.is/application/ui-fields'

interface Props extends FieldBaseProps {
  goToScreen?: (id: string) => void
  route: Routes
}

export const DocumentReview: FC<Props> = ({
  application,
  goToScreen,
  route,
}) => {
  const answers = application.answers as Citizenship
  const { formatMessage } = useLocale()

  const selectedChildren = getSelectedCustodyChildren(
    application.externalData,
    application.answers,
  )

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
                description: formatMessage(review.labels.documents, {
                  name: answers?.userInformation?.name,
                }),
                titleVariant: 'h4',
                type: FieldTypes.DESCRIPTION,
                component: FieldComponents.DESCRIPTION,
                children: undefined,
              },
            })}
          </GridColumn>
          {selectedChildren &&
            selectedChildren.map((child) => {
              return (
                <GridColumn span="1/2">
                  {DescriptionFormField({
                    application: application,
                    showFieldName: false,
                    field: {
                      id: 'title',
                      title: '',
                      description: formatMessage(review.labels.documents, {
                        name: `${child.givenName} ${child.familyName}`,
                      }),
                      titleVariant: 'h4',
                      type: FieldTypes.DESCRIPTION,
                      component: FieldComponents.DESCRIPTION,
                      children: undefined,
                    },
                  })}
                </GridColumn>
              )
            })}
        </GridRow>
      </Box>
    </SummaryBlock>
  )
}
