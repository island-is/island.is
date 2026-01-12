import { Application, Field, RecordObject } from '@island.is/application/types'
import {
  Box,
  GridColumn,
  GridRow,
  Text,
  Button,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC } from 'react'
import { useMutation } from '@apollo/client'
import get from 'lodash/get'
import has from 'lodash/has'

import { BaseInformation } from './review-groups/BaseInformation'
import { Period } from './review-groups/Period'
import { Comment } from './review-groups/Comment'
import { Attachments } from './review-groups/Attachments'
import { ResidenceHistory } from './review-groups/ResidenceHistory'
import { Employers } from './review-groups/Employers'
import { PaymentInformation } from './review-groups/PaymentInformation'
import { oldAgePensionFormMessage } from '../../lib/messages'
import { getApplicationAnswers } from '../../lib/oldAgePensionUtils'
import { ApplicationType } from '../../lib/constants'
import {
  RadioValue,
  ReviewGroup,
  handleServerError,
} from '@island.is/application/ui-components'
import { OnePaymentPerYear } from './review-groups/OnePaymentPerYear'
import { SUBMIT_APPLICATION } from '@island.is/application/graphql'
import { States } from '@island.is/application/templates/social-insurance-administration-core/lib/constants'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import { YES } from '@island.is/application/core'

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
      <PaymentInformation {...childProps} />
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
