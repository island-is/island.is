import React, { FC, useEffect } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'
import { RepeaterProps, FieldBaseProps } from '@island.is/application/types'
import {
  Box,
  Button,
  Inline,
  Tooltip,
  ContentBlock,
  AlertMessage,
} from '@island.is/island-ui/core'
import {
  findProblemInApolloError,
  ProblemType,
} from '@island.is/shared/problem'
import { useLocale } from '@island.is/localization'
import { FieldDescription } from '@island.is/shared/form-fields'
import { Timeline } from '../components/Timeline/Timeline'
import {
  formatPeriods,
  getAvailableRightsInDays,
  getApplicationAnswers,
  synchronizeVMSTPeriods,
  getExpectedDateOfBirthOrAdoptionDateOrBirthDate,
} from '../../lib/parentalLeaveUtils'
import { errorMessages, parentalLeaveFormMessages } from '../../lib/messages'
import { States } from '../../constants'
import { useDaysAlreadyUsed } from '../../hooks/useDaysAlreadyUsed'
import { useRemainingRights } from '../../hooks/useRemainingRights'
import { GetApplicationInformation } from '../../graphql/queries'

type FieldProps = FieldBaseProps & {
  field?: {
    props?: {
      showDescription: boolean
    }
  }
}
type ScreenProps = RepeaterProps & FieldProps

const PeriodsRepeater: FC<React.PropsWithChildren<ScreenProps>> = ({
  application,
  expandRepeater,
  field,
  error,
  setRepeaterItems,
  setBeforeSubmitCallback,
  setFieldLoadingState,
}) => {
  const [updateApplication] = useMutation(UPDATE_APPLICATION)
  const editable =
    application.state === States.DRAFT ||
    application.state === States.EDIT_OR_ADD_EMPLOYERS_AND_PERIODS

  // Need to be consider again when applicant could change basic information
  const shouldCall =
    application.state === States.EDIT_OR_ADD_EMPLOYERS_AND_PERIODS

  const showDescription = field?.props?.showDescription ?? true
  const dob = getExpectedDateOfBirthOrAdoptionDateOrBirthDate(application)
  const { formatMessage, locale } = useLocale()
  const rights = getAvailableRightsInDays(application)
  const daysAlreadyUsed = useDaysAlreadyUsed(application)
  const remainingRights = useRemainingRights(application)
  const { rawPeriods, periods } = getApplicationAnswers(application.answers)
  const { data, loading } = useQuery(GetApplicationInformation, {
    variables: {
      applicationId: application.id,
      nationalId: application.applicant,
    },
    skip: !shouldCall,
  })

  useEffect(() => {
    if (loading) {
      return
    }
    synchronizeVMSTPeriods(
      data,
      rights,
      periods,
      setRepeaterItems,
      setFieldLoadingState,
    )
  }, [loading]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!editable) {
      return
    }

    const syncPeriods = async () => {
      setFieldLoadingState?.(true)
      await setRepeaterItems(periods)
      setFieldLoadingState?.(false)
    }
    // Upon entering this screen, if rawPeriods are not in sync with periods, sync them
    // This means that there is an incomplete period inside answers.periods which we will remove
    // TODO: real comparison
    if (rawPeriods.length !== periods.length) {
      syncPeriods()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!editable) {
      return
    }

    if (rawPeriods.length === 0) {
      expandRepeater()
    }

    setBeforeSubmitCallback?.(async () => {
      try {
        // Run answer validator on the periods selected by the user
        const { errors } = await updateApplication({
          variables: {
            input: {
              id: application.id,
              answers: { validatedPeriods: periods },
            },
            locale,
          },
        })

        if (errors) {
          return [false, formatMessage(errorMessages.periodsCouldNotContinue)]
        }

        return [true, null]
      } catch (e) {
        const problem = findProblemInApolloError(e as any)

        if (problem && problem.type === ProblemType.VALIDATION_FAILED) {
          const message =
            (problem.fields?.periods as string) ??
            problem.detail ??
            formatMessage(errorMessages.periodsUnexpectedError)

          return [false, message]
        }

        return [false, formatMessage(errorMessages.periodsUnexpectedError)]
      }
    })
  }, [
    application,
    editable,
    expandRepeater,
    formatMessage,
    locale,
    periods,
    rawPeriods,
    setBeforeSubmitCallback,
    setRepeaterItems,
    updateApplication,
  ])

  const onDeletePeriod = async (startDate: string) => {
    const remainingAfterDelete = periods.filter(
      (period) => period.startDate !== startDate,
    )

    await setRepeaterItems(remainingAfterDelete)
  }

  if (!dob) {
    return null
  }

  const dobDate = new Date(dob)

  const hasAddedPeriods = periods?.length > 0
  const canAddAnotherPeriod = remainingRights >= 1

  return (
    <Box>
      {showDescription && (
        <FieldDescription
          description={formatMessage(
            hasAddedPeriods
              ? parentalLeaveFormMessages.leavePlan.description
              : parentalLeaveFormMessages.leavePlan.emptyDescription,
          )}
        />
      )}

      <Box marginTop={showDescription ? 3 : undefined} marginBottom={3}>
        <Timeline
          initDate={dobDate}
          title={formatMessage(
            parentalLeaveFormMessages.shared.dateOfBirthTitle,
          )}
          titleSmall={formatMessage(
            parentalLeaveFormMessages.shared.dateOfBirthTitle,
          )}
          periods={formatPeriods(application, formatMessage)}
          onDeletePeriod={onDeletePeriod}
          editable={editable}
        />
        {!hasAddedPeriods && (
          <FieldDescription
            description={formatMessage(
              parentalLeaveFormMessages.leavePlan.empty,
            )}
          />
        )}
      </Box>

      {editable && (
        <Box alignItems="center">
          <Inline space={1} alignY="center">
            <Button
              variant="ghost"
              icon="add"
              disabled={!canAddAnotherPeriod}
              onClick={expandRepeater}
            >
              {formatMessage(
                hasAddedPeriods
                  ? parentalLeaveFormMessages.leavePlan.addAnother
                  : parentalLeaveFormMessages.leavePlan.addFirst,
              )}
            </Button>

            {daysAlreadyUsed >= rights && (
              <Tooltip
                placement="bottom"
                text={formatMessage(parentalLeaveFormMessages.leavePlan.limit)}
              />
            )}
          </Inline>
        </Box>
      )}
      {editable &&
        hasAddedPeriods &&
        (canAddAnotherPeriod || remainingRights < 0) && (
          <FieldDescription
            description={formatMessage(
              parentalLeaveFormMessages.leavePlan.usage,
              {
                alreadyUsed: daysAlreadyUsed,
                rights: rights,
              },
            )}
          />
        )}
      {!!error && (
        <Box marginTop={3}>
          <ContentBlock>
            <AlertMessage type="error" title={error} />
          </ContentBlock>
        </Box>
      )}
    </Box>
  )
}

export default PeriodsRepeater
