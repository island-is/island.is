import { Application } from '@island.is/application/core'
import isWithinInterval from 'date-fns/isWithinInterval'
import parseISO from 'date-fns/parseISO'
import addYears from 'date-fns/addYears'
import addDays from 'date-fns/addDays'
import subtractDays from 'date-fns/subDays'
import { StartDateOptions, YES, NO } from '../constants'
import { getExpectedDateOfBirth } from './parentalLeaveUtils'
import {
  minimumPeriodStartBeforeExpectedDateOfBirth,
  minPeriodDays,
} from '../config'

import { Period } from '../types'

export const dateIsWithinOtherPeriods = (date: Date, periods: Period[]) => {
  for (const currentPeriod of periods) {
    if (!currentPeriod.startDate || !currentPeriod.endDate) {
      return false
    }

    const currentPeriodStart = parseISO(currentPeriod.startDate)
    const currentPeriodEnd = parseISO(currentPeriod.endDate)

    const currentPeriodRange = {
      start: currentPeriodStart,
      end: currentPeriodEnd,
    }

    return isWithinInterval(date, currentPeriodRange)
  }

  return false
}

const validFirstPeriodStartValues = [
  StartDateOptions.ESTIMATED_DATE_OF_BIRTH,
  StartDateOptions.ACTUAL_DATE_OF_BIRTH,
  StartDateOptions.SPECIFIC_DATE,
]

export const validatePeriod = (
  period: Period,
  isFirstPeriod: boolean,
  existingPeriods: Period[],
  application: Application,
  buildError: (
    field: string | null,
    message: string,
    values?: object,
  ) => { path: string; message: string; values: object },
) => {
  console.log('Validating period')
  console.log(period)
  const expectedDateOfBirth = getExpectedDateOfBirth(application)

  if (!expectedDateOfBirth) {
    return buildError(null, 'Áætlaðan fæðingardag vantar í umsókn')
  }

  const dob = parseISO(expectedDateOfBirth)
  const minimumStartDate = subtractDays(
    dob,
    minimumPeriodStartBeforeExpectedDateOfBirth,
  )
  const maximumEndDate = addYears(dob, 2)

  const {
    firstPeriodStart,
    startDate,
    useLength,
    duration,
    percentage,
    endDate,
    days,
    ratio,
  } = period

  if (isFirstPeriod) {
    if (!firstPeriodStart) {
      return buildError(
        'firstPeriodStart',
        'Ekki er tilgreint hvenær tímabil á að hefjast',
      )
    } else if (
      !validFirstPeriodStartValues.includes(
        firstPeriodStart as StartDateOptions,
      )
    ) {
      return buildError(
        'firstPeriodStart',
        'Ekki rétt tilgreint hvernig tímabil á að hefjast',
      )
    }
  }

  let startDateValue: Date | undefined
  if (startDate !== undefined) {
    if (isFirstPeriod) {
      startDateValue =
        firstPeriodStart === StartDateOptions.ACTUAL_DATE_OF_BIRTH ||
        firstPeriodStart === StartDateOptions.ESTIMATED_DATE_OF_BIRTH
          ? dob
          : parseISO(startDate)
    } else {
      startDateValue = parseISO(startDate)
    }

    if (startDateValue < minimumStartDate) {
      return buildError('startDate', 'Ógild upphafsdagsetning')
    }

    if (dateIsWithinOtherPeriods(startDateValue, existingPeriods)) {
      return buildError(
        'startDate',
        'Upphafsdagsetning skarast á við annað tímabil',
      )
    }
  } else {
    return buildError('startDate', 'Upphafsdagsetningu vantar')
  }

  if (endDate !== undefined) {
    if (useLength !== YES && useLength !== NO) {
      return buildError(
        'endDate',
        'Ekki tilgreint hvernig eigi að velja endalok tímabils',
      )
    }

    if (useLength === YES && duration === undefined) {
      return buildError(
        'endDate',
        'Ekki tókst að finna upplýsingar um fjölda mánaða valda',
      )
    }

    const endDateValue = parseISO(endDate)

    if (dateIsWithinOtherPeriods(endDateValue, existingPeriods)) {
      return buildError(
        useLength === YES ? 'endDateDuration' : 'endDate',
        'Endadagsetning skarast á við annað tímabil',
      )
    }

    if (endDateValue > maximumEndDate) {
      return buildError(
        useLength === YES ? 'endDateDuration' : 'endDate',
        'Endadagsetning of langt frá áætluðum fæðingardegi',
      )
    }

    if (endDateValue < startDateValue) {
      return buildError(
        useLength === YES ? 'endDateDuration' : 'endDate',
        'Endadagsetning getur ekki verið á undan upphafsdagsetningu',
      )
    }

    if (endDateValue < addDays(startDateValue, minPeriodDays)) {
      return buildError(
        useLength === YES ? 'endDateDuration' : 'endDate',
        'Tímabil verður of stutt með þessa endadagsetningu',
      )
    }
  }

  if (ratio !== undefined) {
    const ratioValue = Number(ratio)

    if (days === undefined) {
      return buildError(
        'ratio',
        'Upplýsingar um fjölda daga sem á að nýta vantar',
      )
    }

    if (percentage === undefined) {
      return buildError(
        'ratio',
        'Upplýsingar um mögulega hámarksnýtingu á tímibili vantar',
      )
    }

    if (ratioValue > Number(percentage)) {
      return buildError(
        'ratio',
        'Nýtingarhlutfall hærra en möguleg hámarksnýting fyrir valið tímabil',
      )
    }
  }
  console.log('\t its valid')
}
