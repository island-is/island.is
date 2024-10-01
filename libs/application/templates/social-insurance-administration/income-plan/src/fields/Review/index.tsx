import {
  Application,
  Field,
  FieldComponents,
  FieldTypes,
  RecordObject,
} from '@island.is/application/types'
import {
  Box,
  Text,
  Button,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC, useMemo } from 'react'
import { useMutation } from '@apollo/client'
import {
  Label,
  ReviewGroup,
  formatCurrencyWithoutSuffix,
  handleServerError,
} from '@island.is/application/ui-components'
import { StaticTableFormField } from '@island.is/application/ui-fields'
import { SUBMIT_APPLICATION } from '@island.is/application/graphql'
import { inReviewFormMessages, incomePlanFormMessage } from '../../lib/messages'
import { getApplicationAnswers } from '../../lib/incomePlanUtils'
import { States } from '@island.is/application/templates/social-insurance-administration-core/lib/constants'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'

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
  refetch,
}) => {
  const editable = field.props?.editable ?? false
  const { formatMessage } = useLocale()
  const { incomePlan } = getApplicationAnswers(application.answers)
  const { state } = application
  const [submitApplication, { loading: loadingSubmit }] = useMutation(
    SUBMIT_APPLICATION,
    {
      onError: (e) => handleServerError(e, formatMessage),
    },
  )

  const handleSubmit = async (event: string) => {
    const res = await submitApplication({
      variables: {
        input: {
          id: application.id,
          event,
          answers: application.answers,
        },
      },
    })

    if (res?.data) {
      // Takes them to the next state (which loads the relevant form)
      refetch?.()
    }
  }

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
                {formatMessage(inReviewFormMessages.description)}
              </Text>
            </Box>
          </Box>
          <Box display="flex" columnGap={2} alignItems="center">
            {state === `${States.TRYGGINGASTOFNUN_SUBMITTED}` && (
              <Button
                colorScheme="default"
                iconType="filled"
                size="small"
                type="button"
                variant="text"
                icon="pencil"
                loading={loadingSubmit}
                disabled={loadingSubmit}
                onClick={() => handleSubmit('EDIT')}
              >
                {formatMessage(incomePlanFormMessage.confirm.buttonEdit)}
              </Button>
            )}
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
          <GridColumn span={['12/12', '12/12', '12/12', '12/12']}>
            <Label>{formatMessage(incomePlanFormMessage.info.section)}</Label>
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
                    incomePlanFormMessage.incomePlan.incomeType,
                    incomePlanFormMessage.incomePlan.incomePerYear,
                    incomePlanFormMessage.incomePlan.currency,
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
