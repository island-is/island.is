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
  shouldNotUpdateBankAccount,
} from './householdSupplementUtils'
import { MONTHS } from './constants'
import { isExistsCohabitantOlderThan25 } from './householdSupplementUtils'

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
    externalData,
    status: ApplicationStatus.IN_PROGRESS,
  }
}

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
    const startDateYear = subYears(new Date(), 2).getFullYear()
    const endDateYear = addMonths(new Date(), 6).getFullYear()
    const res = getAvailableYears(application)

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
    const startDate = subYears(new Date(), 2)
    const endDate = addMonths(new Date(), 6)
    const selectedYear = startDate.getFullYear().toString()
    const res = getAvailableMonths(application, selectedYear)

    let months = MONTHS

    if (startDate.getFullYear().toString() === selectedYear) {
      months = months.slice(startDate.getMonth() + 1, months.length)
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

describe('isExistsCohabitantOlderThan25', () => {
  it('should return true if user has cohabitant older than 25', () => {
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
          data: ['2605791429'],
          date: new Date(),
          status: 'success',
        },
      },
    })

    const res = isExistsCohabitantOlderThan25(application.externalData)

    expect(res).toEqual(true)
  })

  it('should return false if user has cohabitant older than 25', () => {
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
          data: ['0212181460'],
          date: new Date(),
          status: 'success',
        },
      },
    })

    const res = isExistsCohabitantOlderThan25(application.externalData)

    expect(res).toEqual(false)
  })
})

describe('shouldNotUpdateBankAccount', () => {
  it('should return true if bank account returned from TR is not changed', () => {
    const application = buildApplication({
      answers: {
        paymentInfo: {
          bank: '222200123456',
          bankAccountType: 'icelandic',
        },
      },
      externalData: {
        socialInsuranceAdministrationApplicant: {
          data: {
            bankAccount: {
              bank: '2222',
              ledger: '00',
              accountNumber: '123456',
            },
          },
          date: new Date(),
          status: 'success',
        },
      },
    })

    const res = shouldNotUpdateBankAccount(
      application.answers,
      application.externalData,
    )

    expect(true).toEqual(res)
  })

  it('should return false if bank account returned from TR is changed', () => {
    const application = buildApplication({
      answers: {
        paymentInfo: {
          bank: '222200000000',
          bankAccountType: 'icelandic',
        },
      },
      externalData: {
        socialInsuranceAdministrationApplicant: {
          data: {
            bankAccount: {
              bank: '2222',
              ledger: '00',
              accountNumber: '123456',
            },
          },
          date: new Date(),
          status: 'success',
        },
      },
    })

    const res = shouldNotUpdateBankAccount(
      application.answers,
      application.externalData,
    )

    expect(false).toEqual(res)
  })

  it('should return true if foreign bank account returned from TR is not changed', () => {
    const application = buildApplication({
      answers: {
        paymentInfo: {
          bankAccountType: 'foreign',
          iban: 'NL91ABNA0417164300',
          swift: 'NEDSZAJJXXX',
          bankName: 'Heiti banka',
          bankAddress: 'Heimili banka',
          currency: 'EUR',
        },
      },
      externalData: {
        socialInsuranceAdministrationApplicant: {
          data: {
            bankAccount: {
              iban: 'NL91ABNA0417164300',
              swift: 'NEDSZAJJXXX',
              foreignBankName: 'Heiti banka',
              foreignBankAddress: 'Heimili banka',
              currency: 'EUR',
            },
          },
          date: new Date(),
          status: 'success',
        },
      },
    })

    const res = shouldNotUpdateBankAccount(
      application.answers,
      application.externalData,
    )

    expect(true).toEqual(res)
  })

  it('should return false if foreign bank account returned from TR is changed', () => {
    const application = buildApplication({
      answers: {
        paymentInfo: {
          bankAccountType: 'foreign',
          iban: 'NL91ABNA0417164300',
          swift: 'NEDSZAJJXXX',
          bankName: 'Heiti banka',
          bankAddress: 'Heimili banka',
          currency: 'EUR',
        },
      },
      externalData: {
        socialInsuranceAdministrationApplicant: {
          data: {
            bankAccount: {
              iban: 'NLLLABNA0417164300',
              swift: 'NEDSZAJJXXX',
              foreignBankName: 'Heiti banka',
              foreignBankAddress: 'Heimili banka',
              currency: 'EUR',
            },
          },
          date: new Date(),
          status: 'success',
        },
      },
    })

    const res = shouldNotUpdateBankAccount(
      application.answers,
      application.externalData,
    )

    expect(false).toEqual(res)
  })
})
