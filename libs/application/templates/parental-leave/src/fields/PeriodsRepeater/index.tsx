import React, { FC, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import round from 'lodash/round'

import { UPDATE_APPLICATION } from '@island.is/application/graphql'
import { RepeaterProps, FieldBaseProps } from '@island.is/application/core'
import {
  Box,
  Button,
  Inline,
  Tooltip,
  ContentBlock,
  AlertMessage,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FieldDescription } from '@island.is/shared/form-fields'

import { Timeline } from '../components/Timeline/Timeline'
import {
  formatPeriods,
  getAvailableRightsInDays,
  getExpectedDateOfBirth,
  getApplicationAnswers,
} from '../../lib/parentalLeaveUtils'
import { parentalLeaveFormMessages } from '../../lib/messages'
import { States } from '../../constants'
import { minPeriodDays, daysInMonth } from '../../config'
import { useDaysAlreadyUsed } from '../../hooks/useDaysAlreadyUsed'

type FieldProps = FieldBaseProps & {
  field?: {
    props?: {
      showDescription: boolean
    }
  }
}
type ScreenProps = RepeaterProps & FieldProps

const PeriodsRepeater: FC<ScreenProps> = ({
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
    application.state === States.EDIT_OR_ADD_PERIODS

  const showDescription = field?.props?.showDescription ?? true
  const dob = getExpectedDateOfBirth(application)
  const { formatMessage, locale } = useLocale()
  const rights = getAvailableRightsInDays(application)
  const daysAlreadyUsed = useDaysAlreadyUsed(application)
  const { rawPeriods, periods } = getApplicationAnswers(application.answers)

  useEffect(() => {
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
          return [
            false,
            formatMessage(
              parentalLeaveFormMessages.errorMessages.periodsCouldNotContinue,
            ),
          ]
        }

        return [true, null]
      } catch (e) {
        return [
          false,
          (e as Error)?.message ||
            formatMessage(
              parentalLeaveFormMessages.errorMessages.periodsUnexpectedError,
            ),
        ]
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
  const remainingDays = rights - daysAlreadyUsed
  const canAddAnotherPeriod = remainingDays >= minPeriodDays

  const monthsAlreadyUsed = round(daysAlreadyUsed / daysInMonth, 1)
  const monthsInRights = round(rights / daysInMonth, 1)

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
            parentalLeaveFormMessages.shared.expectedDateOfBirthTitle,
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
              size="small"
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
            {remainingDays > 0 && !canAddAnotherPeriod && (
              <Tooltip
                placement="bottom"
                text={formatMessage(
                  parentalLeaveFormMessages.leavePlan.cannotCreatePeriod,
                  {
                    daysLeft: rights - daysAlreadyUsed,
                    minimumNumberOfDays: minPeriodDays,
                  },
                )}
              />
            )}
          </Inline>
        </Box>
      )}
      {hasAddedPeriods && canAddAnotherPeriod && (
        <FieldDescription
          description={formatMessage(
            parentalLeaveFormMessages.leavePlan.usage,
            {
              alreadyUsed: monthsAlreadyUsed,
              rights: monthsInRights,
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
