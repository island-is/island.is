import React, { FC, useState } from 'react'
import { useFormContext } from 'react-hook-form'

import * as styles from './period.css'
import { Box } from '@island.is/island-ui/core'
import { getErrorViaPath } from '@island.is/application/core'
import {
  FieldBaseProps,
  FieldComponents,
  FieldTypes,
  SelectOption,
} from '@island.is/application/types'
import { SelectFormField } from '@island.is/application/ui-fields'

import { oldAgePensionFormMessage } from '../../lib/messages'
import {
  getApplicationAnswers,
  getAvailableMonths,
  getAvailableYears,
} from '../../lib/oldAgePensionUtils'

export const Period: FC<FieldBaseProps> = ({ application }) => {
  const {
    formState: { errors },
  } = useFormContext()

  const { selectedYear: year, selectedMonth: month } = getApplicationAnswers(
    application.answers,
  )

  const [selectedYear, setSeletedYear] = useState(year)
  const [, setSeletedMonth] = useState(month)

  const optionsYears = getAvailableYears(application)
  const [optionsMonths, setOptionsMonths] = useState(() => {
    const rightYear = year ?? new Date().getFullYear().toString()
    return getAvailableMonths(application, rightYear)
  })

  const getError = (path: string) => {
    const periodError = getErrorViaPath(errors, 'period')
    return (
      getErrorViaPath(errors, path) ??
      (periodError && typeof periodError != 'string' ? undefined : periodError)
    )
  }

  const onSelectYear = (option: SelectOption) => {
    const value = option.value as string
    setSeletedYear(value)

    const months = getAvailableMonths(application, value)
    setOptionsMonths(months)
  }

  const onSelectMonth = (option: SelectOption) => {
    const value = option.value as string
    setSeletedMonth(value)
  }

  return (
    <></>
  )
}
