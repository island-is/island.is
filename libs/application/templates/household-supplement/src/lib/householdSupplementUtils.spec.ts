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
  getAvailableYears,
  getApplicationAnswers,
  getAvailableMonths,
} from './householdSupplementUtils'
import { subYears } from 'date-fns'
import { MONTHS } from './constants'

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
    typeId: ApplicationTypes.HOUSEHOLD_SUPPLEMENT,
    created: new Date(),
    modified: new Date(),
    attachments: {},
    applicantActors: [],
    answers,
    state,
    externalData: {
      nationalRegistry: {
        data: {
          nationalId: '0101307789',
        },
        date: new Date(),
        status: 'success',
      },
    },
    status: ApplicationStatus.IN_PROGRESS,
  }
}

describe('getAvailableYears', () => {
  it('should return available years', () => {
    const application = buildApplication()
    const startDateYear = subYears(new Date(), 2).getFullYear()
    const endDateYear = addMonths(new Date(), 6).getFullYear()
    const res = getAvailableYears(application)

    // const expected = Array.from(
    //   Array(endDateYear - startDateYear + 1).keys(),
    // ).map((x) => {
    //   const theYear = x + startDateYear
    //   return { value: theYear.toString(), label: theYear.toString() }
    // })

    const expected = Array.from(
      Array(endDateYear - (startDateYear - 1)),
      (_, i) => {
        return {
          value: (i + startDateYear).toString(),
          label: (i + startDateYear).toString(),
        }
      },
    )

    expect(res).toEqual(expected)
  })
})

describe('getAvailableMonths', () => {
  it('should return available months for selected year, selected year same as start date', () => {
    const application = buildApplication()
    const startDate = subYears(new Date(), 2)
    const endDate = addMonths(new Date(), 6)
    const selectedYear = startDate.getFullYear().toString()
    const res = getAvailableMonths(application, selectedYear)

    let months = MONTHS

    if (startDate.getFullYear().toString() === selectedYear) {
      months = months.slice(startDate.getMonth(), months.length + 1)
    } else if (endDate.getFullYear().toString() === selectedYear) {
      months = months.slice(0, endDate.getMonth() + 1)
    }

    expect(res).toEqual(months)
  })

  it('should return available months for selected year, selected year same as end date', () => {
    const application = buildApplication()
    const startDate = subYears(new Date(), 2)
    const endDate = addMonths(new Date(), 6)
    const selectedYear = endDate.getFullYear().toString()
    const res = getAvailableMonths(application, selectedYear)

    let months = MONTHS

    if (startDate.getFullYear().toString() === selectedYear) {
      months = months.slice(startDate.getMonth(), months.length + 1)
    } else if (endDate.getFullYear().toString() === selectedYear) {
      months = months.slice(0, endDate.getMonth() + 1)
    }

    expect(res).toEqual(months)
  })

  it('should return available months for selected year, selected year is todays year', () => {
    const application = buildApplication()
    const startDate = subYears(new Date(), 2)
    const endDate = addMonths(new Date(), 6)
    const selectedYear = new Date().getFullYear().toString()
    const res = getAvailableMonths(application, selectedYear)

    let months = MONTHS

    if (startDate.getFullYear().toString() === selectedYear) {
      months = months.slice(startDate.getMonth(), months.length + 1)
    } else if (endDate.getFullYear().toString() === selectedYear) {
      months = months.slice(0, endDate.getMonth() + 1)
    }

    expect(res).toEqual(months)
  })
})
