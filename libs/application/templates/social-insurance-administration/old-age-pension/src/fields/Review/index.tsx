import { useMutation } from '@apollo/client'
import {
  Application,
  Field,
  FieldComponents,
  FieldTypes,
  RecordObject,
} from '@island.is/application/types'
import {
  Box,
  Button,
  GridColumn,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import get from 'lodash/get'
import has from 'lodash/has'
import { FC } from 'react'

import { YES } from '@island.is/application/core'
import { SUBMIT_APPLICATION } from '@island.is/application/graphql'
import { States } from '@island.is/application/templates/social-insurance-administration-core/lib/constants'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import {
  RadioValue,
  ReviewGroup,
  handleServerError,
} from '@island.is/application/ui-components'
import { OverviewFormField } from '@island.is/application/ui-fields'
import { oldAgePensionFormMessage } from '../../lib/messages'
import { ApplicationType } from '../../utils/constants'
import { getApplicationAnswers } from '../../utils/oldAgePensionUtils'
import {
  incomePlanItems,
  incomePlanTable,
  paymentItems,
} from '../../utils/overviewItems'
import { Attachments } from './review-groups/Attachments'
import { BaseInformation } from './review-groups/BaseInformation'
import { Comment } from './review-groups/Comment'
import { Employers } from './review-groups/Employers'
import { OnePaymentPerYear } from './review-groups/OnePaymentPerYear'
import { Period } from './review-groups/Period'
import { ResidenceHistory } from './review-groups/ResidenceHistory'

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
  errors,
}) => {
  const editable = field.props?.editable ?? false
  const { formatMessage } = useLocale()
  const { applicationType } = getApplicationAnswers(application.answers)
  const { state } = application

  const hasError = (id: string) => get(errors, id) as string

  const groupHasNoErrors = (ids: string[]) =>
    ids.every((id) => !has(errors, id))

  const childProps = {
    application,
    editable,
    groupHasNoErrors,
    hasError,
    goToScreen,
  }

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

  const canView =
    state === States.TRYGGINGASTOFNUN_SUBMITTED ||
    state === States.TRYGGINGASTOFNUN_IN_REVIEW ||
    state === States.APPROVED ||
    state === States.REJECTED

  return (
    <>
      {state === `${States.DRAFT}` && (
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
                {formatMessage(
                  socialInsuranceAdministrationMessage.confirm
                    .overviewDescription,
                )}
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
      )}

      {canView && (
        <Box
          display="flex"
          justifyContent="spaceBetween"
          marginTop={5}
          marginBottom={10}
        >
          <Box>
            <Text variant="h2">
              {formatMessage(
                socialInsuranceAdministrationMessage.confirm.overviewTitle,
              )}
            </Text>
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
                {formatMessage(
                  socialInsuranceAdministrationMessage.confirm.editButton,
                )}
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
      <BaseInformation {...childProps} />
      <OverviewFormField
        application={application}
        goToScreen={goToScreen}
        field={{
          id: 'overview.paymentInfo',
          backId: editable ? 'paymentInfo' : undefined,
          type: FieldTypes.OVERVIEW,
          component: FieldComponents.OVERVIEW,
          children: undefined,
          items: paymentItems,
        }}
      />
      <OverviewFormField
        application={application}
        goToScreen={goToScreen}
        field={{
          id: 'overview.incomePlan',
          title:
            socialInsuranceAdministrationMessage.incomePlan.subSectionTitle,
          backId: editable ? 'incomePlan' : undefined,
          type: FieldTypes.OVERVIEW,
          component: FieldComponents.OVERVIEW,
          children: undefined,
          tableData: incomePlanTable,
          items: incomePlanItems,
        }}
      />
      <ResidenceHistory {...childProps} />
      {applicationType === ApplicationType.HALF_OLD_AGE_PENSION && (
        <Employers {...childProps} />
      )}
      <Period {...childProps} />
      {applicationType === ApplicationType.SAILOR_PENSION && (
        <ReviewGroup>
          <GridRow>
            <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
              <RadioValue
                label={formatMessage(oldAgePensionFormMessage.review.fishermen)}
                value={YES}
              />
            </GridColumn>
          </GridRow>
        </ReviewGroup>
      )}
      <OnePaymentPerYear {...childProps} />
      <Comment {...childProps} />
      <Attachments {...childProps} />
    </>
  )
}
