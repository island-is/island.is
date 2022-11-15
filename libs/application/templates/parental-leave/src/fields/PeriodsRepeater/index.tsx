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
  getExpectedDateOfBirth,
  getApplicationAnswers,
  calculateDaysUsedByPeriods,
} from '../../lib/parentalLeaveUtils'
import { parentalLeaveFormMessages } from '../../lib/messages'
import { NO, States } from '../../constants'
import { useDaysAlreadyUsed } from '../../hooks/useDaysAlreadyUsed'
import { useRemainingRights } from '../../hooks/useRemainingRights'
import { GetApplicationInformation } from '../../graphql/queries'
import { Period, VMSTPeriod, YesOrNo } from '../../types'

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

  // Need to be consider again when applicant could change basic information
  const shouldCall = application.state === States.EDIT_OR_ADD_PERIODS

  const showDescription = field?.props?.showDescription ?? true
  const dob = getExpectedDateOfBirth(application)
  const { formatMessage, locale } = useLocale()
  const rights = getAvailableRightsInDays(application)
  const daysAlreadyUsed = useDaysAlreadyUsed(application)
  const remainingRights = useRemainingRights(application)
  const { rawPeriods, periods } = getApplicationAnswers(application.answers)
  const { data, loading } = useQuery(GetApplicationInformation, {
    variables: {
      applicationId: application.id,
      nationalId: application.applicant,
      shouldNotCall: !shouldCall,
    },
  })

  useEffect(() => {
    if (loading) {
      return
    }
    const syncVMSTPeriods = async (VMSTPeriods: Period[]) => {
      setFieldLoadingState?.(true)
      await setRepeaterItems(VMSTPeriods)
      setFieldLoadingState?.(false)
    }

    // If periods is not sync with VMST periods, sync it
    const newPeriods: Period[] = []
    const temptVMSTPeriods: Period[] = []
    const VMSTPeriods: VMSTPeriod[] = data?.getApplicationInformation?.periods
    VMSTPeriods?.forEach((period, index) => {
      /*
       ** VMST could change startDate but still return 'date_of_birth'
       ** Make sure if period is in the past then we use the date they sent
       */
      let firstPeriodStart =
        period.firstPeriodStart === 'date_of_birth'
          ? 'actualDateOfBirth'
          : 'specificDate'
      if (new Date(period.firstPeriodStart).getTime() < new Date().getTime()) {
        firstPeriodStart = 'specificDate'
      }

      // API returns multiple rightsCodePeriod in string ('M-L-GR, M-FS')
      const rightsCodePeriod = period.rightsCodePeriod.split(',')[0]
      const obj = {
        startDate: period.from,
        endDate: period.to,
        ratio: period.ratio.split(',')[0],
        rawIndex: index,
        firstPeriodStart: firstPeriodStart,
        useLength: NO as YesOrNo,
        rightCodePeriod: rightsCodePeriod,
      }
      if (
        period.paid ||
        new Date(period.from).getTime() <= new Date().getTime()
      ) {
        newPeriods.push(obj)
      }
      temptVMSTPeriods.push(obj)
    })

    let index = newPeriods.length
    if (index > 0) {
      const VMSTEndDate = new Date(newPeriods[index - 1].endDate)
      periods.forEach((period) => {
        if (new Date(period.startDate) > VMSTEndDate) {
          newPeriods.push({ ...period, rawIndex: index })
          index += 1
        }
      })

      const usedDayNewPeriods = calculateDaysUsedByPeriods(newPeriods)
      // We don't want update periods if there isn't necessary. Otherwise, enable below code
      // if (usedDayNewPeriods > rights) {
      //   syncVMSTPeriods(temptVMSTPeriods)
      // } else {
      //   syncVMSTPeriods(newPeriods)
      // }
      let isMustSync = false
      if (periods.length !== newPeriods.length) {
        if (usedDayNewPeriods > rights) {
          syncVMSTPeriods(temptVMSTPeriods)
        } else {
          syncVMSTPeriods(newPeriods)
        }
      } else if (
        newPeriods[0].rightCodePeriod &&
        newPeriods[0]?.rightCodePeriod !== periods[0]?.rightCodePeriod
      ) {
        isMustSync = true
      } else {
        newPeriods.forEach((period, i) => {
          if (
            new Date(period.startDate).getTime() !==
              new Date(periods[i].startDate).getTime() ||
            new Date(period.endDate).getTime() !==
              new Date(periods[i].endDate).getTime() ||
            period.ratio !== periods[i].ratio ||
            period.firstPeriodStart !== periods[i].firstPeriodStart
          ) {
            isMustSync = true
          }
        })
      }

      if (isMustSync) {
        if (usedDayNewPeriods > rights) {
          syncVMSTPeriods(temptVMSTPeriods)
        } else {
          syncVMSTPeriods(newPeriods)
        }
      }
    }
  }, [loading])

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
          return [
            false,
            formatMessage(
              parentalLeaveFormMessages.errorMessages.periodsCouldNotContinue,
            ),
          ]
        }

        return [true, null]
      } catch (e) {
        const problem = findProblemInApolloError(e as any)

        if (problem && problem.type === ProblemType.VALIDATION_FAILED) {
          const message =
            (problem.fields?.periods as string) ??
            problem.detail ??
            formatMessage(
              parentalLeaveFormMessages.errorMessages.periodsUnexpectedError,
            )

          return [false, message]
        }

        return [
          false,
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
