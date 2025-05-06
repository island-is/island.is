import { generatePerson } from 'kennitala'
import addMonths from 'date-fns/addMonths'
import subYears from 'date-fns/subYears'
import {
  ApplicationWithAttachments as Application,
  ApplicationStatus,
  ApplicationTypes,
  ExternalData,
  FormValue,
} from '@island.is/application/types'

import {
  getAvailableYears,
  getAvailableMonths,
  isExistsCohabitantBetween18and25,
} from './householdSupplementUtils'
import { MONTHS } from '@island.is/application/templates/social-insurance-administration-core/lib/constants'
import { isExistsCohabitantOlderThan25 } from './householdSupplementUtils'

const buildApplication = (data?: {
  answers?: FormValue
  externalData?: ExternalData
  state?: string
}): Application => {
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
    externalData,
    status: ApplicationStatus.IN_PROGRESS,
  }
}

describe('getAvailableYears', () => {
  it('should return available years', () => {
    const today = new Date()
    const startDateYear = subYears(
      today.setMonth(today.getMonth() + 1),
      2,
    ).getFullYear()
    const endDateYear = addMonths(new Date(), 6).getFullYear()
    const res = getAvailableYears()

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
    const startDate = subYears(new Date(), 2)
    const endDate = addMonths(new Date(), 6)
    const selectedYear = startDate.getFullYear().toString()
    const res = getAvailableMonths(selectedYear)

    let months = MONTHS

    if (startDate.getFullYear().toString() === selectedYear) {
      months = months.slice(startDate.getMonth() + 1, months.length)
    } else if (endDate.getFullYear().toString() === selectedYear) {
      months = months.slice(0, endDate.getMonth() + 1)
    }

    expect(res).toEqual(months)
  })

  it('should return available months for selected year, selected year same as end date', () => {
    const startDate = subYears(new Date(), 2)
    const endDate = addMonths(new Date(), 6)
    const selectedYear = endDate.getFullYear().toString()
    const res = getAvailableMonths(selectedYear)

    let months = MONTHS

    if (startDate.getFullYear().toString() === selectedYear) {
      months = months.slice(startDate.getMonth(), months.length + 1)
    } else if (endDate.getFullYear().toString() === selectedYear) {
      months = months.slice(0, endDate.getMonth() + 1)
    }

    expect(res).toEqual(months)
  })

  it('should return available months for selected year, selected year is todays year', () => {
    const startDate = subYears(new Date(), 2)
    const endDate = addMonths(new Date(), 6)
    const selectedYear = new Date().getFullYear().toString()
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

describe('isExistsCohabitantOlderThan25', () => {
  it('should return true if user has cohabitant older than 25', () => {
    const birthday = new Date()
    birthday.setFullYear(birthday.getFullYear() - 26)
    const application = buildApplication({
      externalData: {
        nationalRegistry: {
          data: {
            nationalId: '0101307789',
          },
          date: new Date(),
          status: 'success',
        },
        nationalRegistryCohabitants: {
          // eslint-disable-next-line local-rules/disallow-kennitalas
          data: [generatePerson(birthday)],
          date: new Date(),
          status: 'success',
        },
      },
    })

    const res = isExistsCohabitantOlderThan25(application.externalData)

    expect(res).toEqual(true)
  })

  it('should return false if user has cohabitant younger than 25', () => {
    const birthday = new Date()
    birthday.setFullYear(birthday.getFullYear() - 24)
    const application = buildApplication({
      externalData: {
        nationalRegistry: {
          data: {
            nationalId: '0101307789',
          },
          date: new Date(),
          status: 'success',
        },
        nationalRegistryCohabitants: {
          // eslint-disable-next-line local-rules/disallow-kennitalas
          data: [generatePerson(birthday)],
          date: new Date(),
          status: 'success',
        },
      },
    })

    const res = isExistsCohabitantOlderThan25(application.externalData)

    expect(res).toEqual(false)
  })
})

describe('isExistsCohabitantBetween18and25', () => {
  it('should return true if user has cohabitant that is between 18 and 25 of age', () => {
    const birthday = new Date()
    birthday.setFullYear(birthday.getFullYear() - 24)
    const application = buildApplication({
      externalData: {
        nationalRegistry: {
          data: {
            nationalId: '0101307789',
          },
          date: new Date(),
          status: 'success',
        },
        nationalRegistryCohabitants: {
          // eslint-disable-next-line local-rules/disallow-kennitalas
          data: [generatePerson(birthday)],
          date: new Date(),
          status: 'success',
        },
      },
    })

    const res = isExistsCohabitantBetween18and25(application.externalData)

    expect(res).toEqual(true)
  })

  it('should return false if user has cohabitant that is between 18 and 25 of age', () => {
    const birthday = new Date()
    birthday.setFullYear(birthday.getFullYear() - 26)
    const application = buildApplication({
      externalData: {
        nationalRegistry: {
          data: {
            nationalId: '0101307789',
          },
          date: new Date(),
          status: 'success',
        },
        nationalRegistryCohabitants: {
          // eslint-disable-next-line local-rules/disallow-kennitalas
          data: [generatePerson(birthday)],
          date: new Date(),
          status: 'success',
        },
      },
    })

    const res = isExistsCohabitantBetween18and25(application.externalData)

    expect(res).toEqual(false)
  })
})
