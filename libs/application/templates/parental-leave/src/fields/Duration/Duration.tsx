import React, { FC, useEffect, useState, useCallback } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import format from 'date-fns/format'
import * as Sentry from '@sentry/react'

import { FieldBaseProps, RecordObject } from '@island.is/application/core'
import { Box } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { useLocale } from '@island.is/localization'
import { FieldDescription } from '@island.is/shared/form-fields'

import Slider from '../components/Slider'
import {
  getExpectedDateOfBirth,
  getApplicationAnswers,
} from '../../lib/parentalLeaveUtils'
import { errorMessages, parentalLeaveFormMessages } from '../../lib/messages'
import { usageMaxMonths, usageMinMonths } from '../../config'
import { StartDateOptions } from '../../constants'
import { monthsToDays } from '../../lib/directorateOfLabour.utils'
import { useGetOrRequestEndDates } from '../../hooks/useGetOrRequestEndDates'
import * as styles from './Duration.treat'

const df = 'yyyy-MM-dd'
const DEFAULT_PERIOD_LENGTH = usageMinMonths

export const Duration: FC<FieldBaseProps> = ({
  field,
  application,
  setFieldLoadingState,
  errors,
}) => {
  const { id } = field
  const { register, setError, clearErrors } = useFormContext()
  const { formatMessage, formatDateFns } = useLocale()
  const { answers } = application
  const { rawPeriods } = getApplicationAnswers(answers)
  const expectedDateOfBirth = getExpectedDateOfBirth(application)
  const currentIndex = rawPeriods.length - 1
  const currentPeriod = rawPeriods[currentIndex]
  const currentStartDateAnswer = currentPeriod.startDate ?? expectedDateOfBirth

  const [chosenEndDate, setChosenEndDate] = useState<string | undefined>(
    currentPeriod.endDate,
  )
  const [chosenDuration, setChosenDuration] = useState<number>(
    currentPeriod.duration
      ? Number(currentPeriod.duration)
      : DEFAULT_PERIOD_LENGTH,
  )
  const [durationInDays, setDurationInDays] = useState<number>(
    chosenDuration * 30,
  )
  const [percent, setPercent] = useState<number>(
    currentPeriod.percentage ? Number(currentPeriod.percentage) : 100,
  )
  const { getEndDate, loading } = useGetOrRequestEndDates(application)
  const errorMessage =
    (errors?.component as RecordObject<string>)?.message ||
    (errors as RecordObject<string>)?.[id]

  const monthsToEndDate = useCallback(
    async (duration: number) => {
      try {
        const days = monthsToDays(duration)

        const endDateResult = await getEndDate({
          startDate: currentStartDateAnswer,
          length: days,
        })

        if (!endDateResult || !endDateResult.date) {
          setError('component', {
            type: 'error',
            message: formatMessage(errorMessages.durationPeriods),
          })
          return
        }

        const date = new Date(endDateResult.date)

        setChosenEndDate(date.toISOString())
        setPercent(endDateResult.percentage)
        setDurationInDays(endDateResult.days)

        return date
      } catch (e) {
        Sentry.captureException((e as Error).message)

        setError('component', {
          type: 'error',
          message: formatMessage(errorMessages.durationPeriods),
        })
      }
    },
    [currentStartDateAnswer, formatMessage, getEndDate, setError],
  )

  const handleChange = async (months: number) => {
    clearErrors([id, 'component'])
    setChosenDuration(months)
  }

  const handleChangeEnd = async (
    months: number,
    onChange: (...event: any[]) => void,
  ) => {
    const date = await monthsToEndDate(months)

    if (date) {
      onChange(format(date, df))
    }
  }

  useEffect(() => {
    setFieldLoadingState?.(loading)
  }, [loading, setFieldLoadingState])

  useEffect(() => {
    const init = async () => {
      await monthsToEndDate(DEFAULT_PERIOD_LENGTH)
    }

    init()
  }, [])

  const rangeDates =
    currentPeriod.firstPeriodStart !== StartDateOptions.ACTUAL_DATE_OF_BIRTH
      ? {
          start: {
            date: formatDateFns(currentStartDateAnswer),
            message: formatMessage(
              parentalLeaveFormMessages.shared.rangeStartDate,
            ),
          },
          end: {
            date: chosenEndDate ? formatDateFns(chosenEndDate) : '—',
            message: formatMessage(
              parentalLeaveFormMessages.shared.rangeEndDate,
            ),
          },
        }
      : undefined

  return (
    <Box>
      <FieldDescription
        description={formatMessage(
          parentalLeaveFormMessages.duration.monthsDescription,
        )}
      />

      <Box
        background="blue100"
        paddingTop={6}
        paddingBottom={4}
        paddingX={3}
        marginTop={3}
      >
        {chosenEndDate ? (
          <Controller
            defaultValue={chosenEndDate}
            name={id}
            render={({ onChange }) => (
              <Slider
                min={usageMinMonths}
                max={usageMaxMonths}
                trackStyle={{ gridTemplateRows: 8 }}
                calculateCellStyle={() => ({
                  background: theme.color.dark200,
                })}
                showMinMaxLabels
                showToolTip
                label={{
                  singular: formatMessage(
                    parentalLeaveFormMessages.shared.month,
                  ),
                  plural: formatMessage(
                    parentalLeaveFormMessages.shared.months,
                  ),
                }}
                rangeDates={rangeDates}
                currentIndex={chosenDuration}
                onChange={(months: number) => handleChange(months)}
                onChangeEnd={(months: number) =>
                  handleChangeEnd(months, onChange)
                }
              />
            )}
          />
        ) : (
          'Sæki gögn...'
        )}
      </Box>

      {errorMessage && (
        <Box
          paddingTop={2}
          className={styles.errorMessage}
          aria-live="assertive"
        >
          {errorMessage}
        </Box>
      )}

      <input
        readOnly
        ref={register}
        type="hidden"
        value={chosenEndDate}
        name={`periods[${currentIndex}].endDate`}
      />

      <input
        readOnly
        ref={register}
        type="hidden"
        value={chosenDuration}
        name={`periods[${currentIndex}].duration`}
      />

      <input
        readOnly
        ref={register}
        type="hidden"
        value={durationInDays}
        name={`periods[${currentIndex}].days`}
      />

      <input
        readOnly
        ref={register}
        type="hidden"
        value={percent}
        name={`periods[${currentIndex}].percentage`}
      />
    </Box>
  )
}
