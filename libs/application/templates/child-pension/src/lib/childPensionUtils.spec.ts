import addYears from 'date-fns/addYears'
import addMonths from 'date-fns/addMonths'
import {
  ApplicationWithAttachments as Application,
  ApplicationStatus,
  ApplicationTypes,
  ExternalData,
  FormValue,
} from '@island.is/application/types'

import {
  getStartDateAndEndDate,
  getAvailableYears,
  getApplicationAnswers,
  getAvailableMonths,
} from './childPensionUtils'
import { MAX_MONTHS_BACKWARD, MAX_MONTHS_FORWARD, MONTHS } from './constants'

function buildApplication(data?: {
  answers?: FormValue
  externalData?: ExternalData
  state?: string
}): Application {
  const { answers = {}, externalData = {}, state = 'draft' } = data ?? {}

  return {
    id: '12345',
    assignees: [],
    applicant: '0101307789',
    typeId: ApplicationTypes.CHILD_PENSION,
    created: new Date(),
    modified: new Date(),
    attachments: {},
    applicantActors: [],
    answers,
    state,
    externalData,
    status: ApplicationStatus.IN_PROGRESS,
  }
}

describe('getStartDateAndEndDate', () => {
  it('should return 1 year 11 months ago for startDate and 6 months ahead for endDate', () => {
    const today = new Date()
    const startDate = addMonths(
      addMonths(today, MAX_MONTHS_BACKWARD),
      1,
    ).toDateString()
    const endDate = addMonths(today, MAX_MONTHS_FORWARD).toDateString()
    const res = getStartDateAndEndDate()

    expect({
      startDate: res.startDate?.toDateString(),
      endDate: res.endDate?.toDateString(),
    }).toEqual({ startDate, endDate })
  })
})

describe('getAvailableYears', () => {
  it('should return available years', () => {
    const today = new Date()
    const startDateYear = addMonths(
      addMonths(today, MAX_MONTHS_BACKWARD),
      1,
    ).getFullYear()
    const endDateYear = addMonths(today, MAX_MONTHS_FORWARD).getFullYear()

    const res = getAvailableYears()
    const expected = Array.from(
      Array(endDateYear - startDateYear + 1).keys(),
    ).map((x) => {
      const theYear = x + startDateYear
      return { value: theYear.toString(), label: theYear.toString() }
    })

    expect(res).toEqual(expected)
  })
})

describe('getAvailableMonths', () => {
  it('should return available months for selected year, selected year same as start date', () => {
    const today = new Date()
    const startDate = addMonths(addMonths(today, MAX_MONTHS_BACKWARD), 1)
    const endDate = addMonths(new Date(), MAX_MONTHS_FORWARD)
    const selectedYear = startDate.getFullYear().toString()
    const res = getAvailableMonths(selectedYear)

    let months = MONTHS

    if (startDate.getFullYear().toString() === selectedYear) {
      months = months.slice(startDate.getMonth(), months.length + 1)
    } else if (endDate.getFullYear().toString() === selectedYear) {
      months = months.slice(0, endDate.getMonth() + 1)
    }

    expect(res).toEqual(months)
  })
})
