import { States } from '@island.is/application/templates/social-insurance-administration-core/lib/constants'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import {
  Application,
  Field,
  FieldComponents,
  FieldTypes,
  RecordObject,
} from '@island.is/application/types'
import {
  Label,
  ReviewGroup,
  formatCurrencyWithoutSuffix,
} from '@island.is/application/ui-components'
import { StaticTableFormField } from '@island.is/application/ui-fields'
import {
  Box,
  Button,
  GridColumn,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC, useMemo } from 'react'
import { getApplicationAnswers } from '../../lib/incomePlanUtils'
import { inReviewFormMessages, incomePlanFormMessage } from '../../lib/messages'

interface ReviewScreenProps {
  application: Application
  field: Field & { props?: { editable?: boolean } }
  goToScreen?: (id: string) => void
  refetch?: () => void
  errors?: RecordObject
  editable?: boolean
}
export const Review: FC<ReviewScreenProps> = ({
  application,
  field,
  goToScreen,
}) => {
  const editable = field.props?.editable ?? false
  const { formatMessage } = useLocale()
  const { incomePlan } = getApplicationAnswers(application.answers)
  const { state } = application

  const rows = useMemo(
    () =>
      incomePlan.map((e) => [
        e.incomeType,
        formatCurrencyWithoutSuffix(e.incomePerYear),
        e.currency,
      ]),
    [incomePlan],
  )

  return (
    <>
      {state === `${States.DRAFT}` ? (
        <Box display="flex" justifyContent="spaceBetween">
          <Box>
            <Box marginBottom={2}>
              <Text variant="h2">
                {formatMessage(incomePlanFormMessage.confirm.title)}
              </Text>
            </Box>
            <Box marginBottom={10}>
              <Text variant="default">
                {formatMessage(incomePlanFormMessage.confirm.description)}
              </Text>
            </Box>
          </Box>
          <Box>
            <Button
              variant="utility"
              icon="print"
              onClick={(e) => {
                e.preventDefault()
                window.print()
              }}
            />
          </Box>
        </Box>
      ) : (
        <Box display="flex" justifyContent="spaceBetween">
          <Box>
            <Box marginBottom={2}>
              <Text variant="h2">
                {formatMessage(
                  socialInsuranceAdministrationMessage.confirm.overviewTitle,
                )}
              </Text>
            </Box>
            <Box marginBottom={10}>
              <Text variant="default">
                {state === `${States.TRYGGINGASTOFNUN_SUBMITTED}`
                  ? formatMessage(inReviewFormMessages.description)
                  : formatMessage(inReviewFormMessages.reviewDescription)}
              </Text>
            </Box>
          </Box>
          <Box display="flex" columnGap={2} alignItems="center">
            <Button
              variant="utility"
              icon="print"
              onClick={(e) => {
                e.preventDefault()
                window.print()
              }}
            />
          </Box>
        </Box>
      )}
      <ReviewGroup
        isLast
        isEditable={editable}
        editAction={() => goToScreen?.('incomePlanTable')}
      >
        <GridRow>
          <GridColumn span="12/12">
            <Label>
              {formatMessage(
                socialInsuranceAdministrationMessage.incomePlan.subSectionTitle,
              )}
            </Label>
            <Box paddingTop={3}>
              <StaticTableFormField
                application={application}
                field={{
                  type: FieldTypes.STATIC_TABLE,
                  component: FieldComponents.STATIC_TABLE,
                  children: undefined,
                  id: 'incomePlan',
                  title: '',
                  header: [
                    socialInsuranceAdministrationMessage.incomePlan.incomeType,
                    socialInsuranceAdministrationMessage.incomePlan
                      .incomePerYear,
                    socialInsuranceAdministrationMessage.incomePlan.currency,
                  ],
                  rows,
                }}
              />
            </Box>
          </GridColumn>
        </GridRow>
      </ReviewGroup>
    </>
  )
}
