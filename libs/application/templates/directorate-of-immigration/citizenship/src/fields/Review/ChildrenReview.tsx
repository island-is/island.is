import {
  ApplicantChildCustodyInformation,
  FieldBaseProps,
  FieldComponents,
  FieldTypes,
} from '@island.is/application/types'
import { personal, review, selectChildren } from '../../lib/messages'
import { Box, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Routes } from '../../lib/constants'
import SummaryBlock from '../../components/SummaryBlock'
import { DescriptionFormField } from '@island.is/application/ui-fields'

interface ChildrenReviewProps extends FieldBaseProps {
  selectedChildren: Array<ApplicantChildCustodyInformation> | undefined
  goToScreen?: (id: string) => void
  route: Routes
}

export const ChildrenReview = ({
  selectedChildren,
  goToScreen,
  route,
  application,
}: ChildrenReviewProps) => {
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
            description: formatMessage(review.labels.children),
            titleVariant: 'h4',
            type: FieldTypes.DESCRIPTION,
            component: FieldComponents.DESCRIPTION,
            children: undefined,
          },
        })}

        {selectedChildren &&
          selectedChildren.map((child) => {
            return (
              <GridRow>
                <GridColumn span="1/2">
                  <Text>{`${child.givenName} ${child.familyName}`}</Text>
                  {child.otherParent && (
                    <Text>
                      {`${formatMessage(selectChildren.checkboxes.subLabel)}: ${
                        child.otherParent?.fullName
                      }`}
                    </Text>
                  )}
                </GridColumn>
                <GridColumn span="1/2">
                  <Text>
                    {`${formatMessage(
                      personal.labels.userInformation.citizenship,
                    )}: ${child.citizenship?.name}`}
                  </Text>
                </GridColumn>
              </GridRow>
            )
          })}
      </Box>
    </SummaryBlock>
  )
}
