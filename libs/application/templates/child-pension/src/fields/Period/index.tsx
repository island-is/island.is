import React, { FC, useState } from 'react'
import { FieldErrors, FieldValues } from 'react-hook-form'

import * as styles from './period.css'
import { AlertMessage, Box } from '@island.is/island-ui/core'
import { getErrorViaPath } from '@island.is/application/core'
import {
  FieldBaseProps,
  FieldComponents,
  FieldTypes,
  SelectOption,
} from '@island.is/application/types'
import { SelectFormField } from '@island.is/application/ui-fields'

import {
  childPensionFormMessage,
  validatorErrorMessages,
} from '../../lib/messages'
import {
  getApplicationAnswers,
  getAvailableMonths,
  getAvailableYears,
} from '../../lib/childPensionUtils'
import { useLocale } from '@island.is/localization'

export const Period: FC<FieldBaseProps> = ({ application, errors }) => {
  const { selectedYear: year, selectedMonth: month } = getApplicationAnswers(
    application.answers,
  )
  const { formatMessage } = useLocale()
  const [selectedYear, setSeletedYear] = useState(year)
  const [, setSeletedMonth] = useState(month)

  const optionsYears = getAvailableYears()
  const [optionsMonths, setOptionsMonths] = useState(() => {
    const rightYear = year ?? new Date().getFullYear().toString()
    return getAvailableMonths(rightYear)
  })

  const errorYear = getErrorViaPath(
    errors as FieldErrors<FieldValues>,
    'period.year',
  )

  const errorMonth = getErrorViaPath(
    errors as FieldErrors<FieldValues>,
    'period.month',
  )

  const periodError = getErrorViaPath(
    errors as FieldErrors<FieldValues>,
    'period',
  )

  const onSelectYear = (option: SelectOption) => {
    const value = option.value as string
    setSeletedYear(value)

    const months = getAvailableMonths(value)
    setOptionsMonths(months)
  }

  const onSelectMonth = (option: SelectOption) => {
    const value = option.value as string
    setSeletedMonth(value)
  }

  return (
    <Box>
      <Box display={'flex'} className={styles.flexBox}>
        <Box width="half" marginRight={3} className={styles.yearBox}>
          <SelectFormField
            application={application}
            error={errorYear}
            field={{
              type: FieldTypes.SELECT,
              component: FieldComponents.SELECT,
              title: childPensionFormMessage.period.periodInputYear,
              placeholder:
                childPensionFormMessage.period.periodInputYearDefaultText,
              id: 'period.year',
              children: undefined,
              options: optionsYears,
              backgroundColor: 'blue',
              onSelect: onSelectYear,
            }}
          />
        </Box>
        <Box width="half" marginLeft={3} className={styles.monthBox}>
          <SelectFormField
            application={application}
            error={errorMonth}
            field={{
              type: FieldTypes.SELECT,
              component: FieldComponents.SELECT,
              title: childPensionFormMessage.period.periodInputMonth,
              placeholder:
                childPensionFormMessage.period.periodInputMonthDefaultText,
              id: 'period.month',
              children: undefined,
              options: selectedYear ? optionsMonths : [],
              backgroundColor: 'blue',
              onSelect: onSelectMonth,
            }}
          />
        </Box>
      </Box>
      {periodError && (
        <Box paddingTop={4}>
          <AlertMessage
            type="warning"
            title={formatMessage(
              childPensionFormMessage.info.childPensionNameAlertTitle,
            )}
            message={formatMessage(
              validatorErrorMessages.childPensionNoRightsForPeriod,
            )}
          />
        </Box>
      )}
    </Box>
  )
}
