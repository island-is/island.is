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
  getAgeBetweenTwoDates,
  getApplicationExternalData,
  isEarlyRetirement,
  filterValidEmployers,
} from './oldAgePensionUtils'
import { ApplicationType, MONTHS } from './constants'
import * as kennitala from 'kennitala'

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
    typeId: ApplicationTypes.OLD_AGE_PENSION,
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
    const application = buildApplication()
    const { applicationType } = getApplicationAnswers(application.answers)
    const today = new Date()
    const startDate = addMonths(addYears(today, -2), 1).toDateString()
    const endDate = addMonths(today, 6).toDateString()
    const res = getStartDateAndEndDate(application.applicant, applicationType)

    expect({
      startDate: res.startDate?.toDateString(),
      endDate: res.endDate?.toDateString(),
    }).toEqual({ startDate, endDate })
  })
})

describe('getAvailableYears', () => {
  it('should return available years', () => {
    const application = buildApplication({
      externalData: {
        nationalRegistry: {
          data: {
            nationalId: '0101307789',
          },
          date: new Date(),
          status: 'success',
        },
      },
    })
    const today = new Date()
    const startDateYear = addMonths(addYears(today, -2), 1).getFullYear()
    const endDateYear = addMonths(today, 6).getFullYear()

    const res = getAvailableYears(application)
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
    const application = buildApplication({
      externalData: {
        nationalRegistry: {
          data: {
            nationalId: '0101307789',
          },
          date: new Date(),
          status: 'success',
        },
      },
    })
    const today = new Date()
    const startDate = addMonths(addYears(today, -2), 1)
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
    const application = buildApplication({
      externalData: {
        nationalRegistry: {
          data: {
            nationalId: '0101307789',
          },
          date: new Date(),
          status: 'success',
        },
      },
    })
    const today = new Date()
    const startDate = addMonths(addYears(today, -2), 1)
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
    const application = buildApplication({
      externalData: {
        nationalRegistry: {
          data: {
            nationalId: '0101307789',
          },
          date: new Date(),
          status: 'success',
        },
      },
    })
    const today = new Date()
    const startDate = addMonths(addYears(today, -2), 1)
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

describe('getAgeBetweenTwoDates', () => {
  it('should return age between two dates', () => {
    const application = buildApplication({
      externalData: {
        nationalRegistry: {
          data: {
            nationalId: '0101307789',
          },
          date: new Date(),
          status: 'success',
        },
      },
    })

    const { applicantNationalId } = getApplicationExternalData(
      application.externalData,
    )
    const dateOfBirth = kennitala.info(applicantNationalId).birthday
    const dateOfBirth00 = new Date(
      dateOfBirth.getFullYear(),
      dateOfBirth.getMonth(),
    )

    const age = getAgeBetweenTwoDates(new Date(2023, 7, 17), dateOfBirth00)

    expect(age).toEqual(93)
  })
})

describe('isEarlyRetirement', () => {
  it('should return false if user is not taking early retirement', () => {
    const application = buildApplication({
      answers: {
        applicationType: {
          option: ApplicationType.OLD_AGE_PENSION,
        },
        period: {
          year: '2021',
          month: 'August',
        },
      },
      externalData: {
        nationalRegistry: {
          data: {
            nationalId: '0101307789',
          },
          date: new Date(),
          status: 'success',
        },
      },
    })

    const res = isEarlyRetirement(application.answers, application.externalData)

    expect(res).toEqual(false)
  })
})

describe('filterValidEmployers', () => {
  it('should return true filtered employers list', () => {
    const application = buildApplication({
      answers: {
        applicationType: {
          option: ApplicationType.OLD_AGE_PENSION,
        },
        employers: [
          {
            email: 'fajefja@bs.is',
            phoneNumber: '',
            ratioType: 'monthly',
            ratioYearly: '20',
            ratioMonthlyAvg: '20',
            ratioMonth: {
              March: '400',
              April: '400',
            },
          },
          {
            email: '',
            phoneNumber: '',
            ratioType: 'yearly',
            ratioYearly: '20',
          },
          {
            email: 'fajefja@bs.is',
            phoneNumber: '',
            ratioType: 'yearly',
            ratioYearly: '20',
          },
          {
            email: 'fajefja@bs.is',
            phoneNumber: '',
            ratioType: '',
            ratioYearly: '20',
          },
        ],
      },
    })

    const filteredList = [
      {
        email: 'fajefja@bs.is',
        phoneNumber: '',
        ratioType: 'monthly',
        ratioYearly: '20',
        ratioMonthlyAvg: '20',
        ratioMonth: {
          March: '400',
          April: '400',
        },
        rawIndex: 0,
      },
      {
        email: 'fajefja@bs.is',
        phoneNumber: '',
        ratioType: 'yearly',
        ratioYearly: '20',
        rawIndex: 2,
      },
    ]

    const { rawEmployers, employers } = getApplicationAnswers(
      application.answers,
    )
    const res = filterValidEmployers(rawEmployers)

    expect(employers).toEqual(filteredList)
    expect(res).toEqual(filteredList)
  })
})
