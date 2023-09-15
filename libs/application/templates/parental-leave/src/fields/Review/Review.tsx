import { FC } from 'react'
import get from 'lodash/get'
import has from 'lodash/has'

import { Application, RecordObject, Field } from '@island.is/application/types'
import { Box, Text } from '@island.is/island-ui/core'
import { ReviewGroup } from '@island.is/application/ui-components'

import { getSelectedChild } from '../../lib/parentalLeaveUtils'
// TODO: Bring back payment calculation info, once we have an api
// import PaymentsTable from '../PaymentSchedule/PaymentsTable'
// import { getEstimatedPayments } from '../PaymentSchedule/estimatedPaymentsQuery'
import {
  NO,
  ParentalRelations,
  PARENTAL_LEAVE,
  SINGLE,
  MANUAL,
  States,
  PARENTAL_GRANT,
  YES,
  PARENTAL_GRANT_STUDENTS,
} from '../../constants'
import { SummaryRights } from '../Rights/SummaryRights'
import { useStatefulAnswers } from '../../hooks/useStatefulAnswers'
import { BaseInformation } from './review-groups/BaseInformation'
import { OtherParent } from './review-groups/OtherParent'

import { Payments } from './review-groups/Payments'
import { PersonalAllowance } from './review-groups/PersonalAllowance'
import { SpousePersonalAllowance } from './review-groups/SpousePersonalAllowance'
import { Employment } from './review-groups/Employment'
import { Periods } from './review-groups/Periods'
import { PrintButton } from '../PrintButton'
import { useLocale } from '@island.is/localization'
import { parentalLeaveFormMessages } from '../../lib/messages'

interface ReviewScreenProps {
  application: Application
  field: Field & { props?: { editable?: boolean } }
  goToScreen?: (id: string) => void
  errors?: RecordObject
  editable?: boolean
}

export const Review: FC<React.PropsWithChildren<ReviewScreenProps>> = ({
  application,
  field,
  goToScreen,
  errors,
}) => {
  const editable = field.props?.editable ?? false
  const [{ applicationType, otherParent, employerLastSixMonths }] =
    useStatefulAnswers(application)
  const selectedChild = getSelectedChild(
    application.answers,
    application.externalData,
  )
  const { formatMessage } = useLocale()
  const { state } = application
  const isPrimaryParent =
    selectedChild?.parentalRelation === ParentalRelations.primary

  const hasSelectedOtherParent =
    otherParent !== NO && otherParent !== SINGLE && otherParent !== MANUAL

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

  return (
    <>
      {state === `${States.DRAFT}` && (
        <Box>
          <PrintButton />
          <Box marginBottom={2}>
            <Text variant="h2">
              {formatMessage(parentalLeaveFormMessages.confirmation.title)}
            </Text>
          </Box>
          <Box marginBottom={10}>
            <Text variant="default">
              {formatMessage(
                parentalLeaveFormMessages.confirmation.description,
              )}
            </Text>
          </Box>
        </Box>
      )}
      <BaseInformation {...childProps} />
      <OtherParent {...childProps} />
      <Payments {...childProps} />
      <PersonalAllowance {...childProps} />
      {isPrimaryParent && hasSelectedOtherParent && (
        <SpousePersonalAllowance {...childProps} />
      )}
      {(applicationType === PARENTAL_LEAVE ||
        ((applicationType === PARENTAL_GRANT ||
          applicationType === PARENTAL_GRANT_STUDENTS) &&
          employerLastSixMonths === YES)) && <Employment {...childProps} />}
      <ReviewGroup>
        <SummaryRights application={application} />
      </ReviewGroup>
      <Periods {...childProps} />

      {/**
       * TODO: Bring back payment calculation info, once we have an api
       * https://app.asana.com/0/1182378413629561/1200214178491335/f
       */}
      {/* <ReviewGroup
      isEditable={editable}>
        {!loading && !error && (
          <>
            <Label>
              {formatMessage(
                parentalLeaveFormMessages.paymentPlan.subSection,
              )}
            </Label>

            <PaymentsTable
              application={application}
              payments={data.getEstimatedPayments}
            />
          </>
        )}
      </ReviewGroup> */}

      {/**
       * TODO: Bring back this feature post v1 launch
       * Would also be good to combine it with the first accordion item
       * and make just one section for the other parent info, and sharing with the other parent
       * https://app.asana.com/0/1182378413629561/1200214178491339/f
       */}
      {/* {statefulOtherParentConfirmed === MANUAL && (
        <ReviewGroup
        isEditable={editable}>
          <Box paddingY={4}>
            <Box marginTop={1} marginBottom={2}>
              <Text variant="h5">
                {formatMessage(
                  parentalLeaveFormMessages.shareInformation.subSection,
                )}

                {formatMessage(
                  parentalLeaveFormMessages.shareInformation.title,
                )}
              </Text>
            </Box>

            {editable ? (
              <RadioController
                id="shareInformationWithOtherParent"
                name="shareInformationWithOtherParent"
                error={
                  (errors as RecordObject<string> | undefined)
                    ?.shareInformationWithOtherParent
                }
                defaultValue={shareInformationWithOtherParent}
                options={[
                  {
                    label: formatMessage(
                      parentalLeaveFormMessages.shared.yesOptionLabel,
                    ),
                    value: YES,
                  },
                  {
                    label: formatMessage(
                      parentalLeaveFormMessages.shared.noOptionLabel,
                    ),
                    value: NO,
                  },
                ]}
              />
            ) : (
              <RadioValue value={shareInformationWithOtherParent} />
            )}
          </Box>
        </ReviewGroup>
      )} */}
    </>
  )
}
