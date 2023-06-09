import {
  ApplicationWithAttachments as Application,
  ApplicationStatus,
  ApplicationTypes,
} from '@island.is/application/types'
import addYears from 'date-fns/addYears'
import addMonths from 'date-fns/addMonths'

import { answerValidators } from './answerValidators'
import { validatorErrorMessages } from './messages'
import { MONTHS } from './constants'

const createBaseApplication = (): Application => ({
  answers: {
    someAnswer: 'someValue',
    applicationType: { option: 'oldAgePension' },
  },
  assignees: [],
  applicant: '0101307789',
  attachments: {},
  applicantActors: [],
  created: new Date(),
  externalData: {
    nationalRegistry: {
      data: {
        age: 93,
        address: {
          city: 'Kópavogur',
          locality: 'Kópavogur',
          postalCode: '200',
          streetAddress: 'Engihjalli 3',
          municipalityCode: '1000',
        },
        fullName: 'Gervimaður útlönd',
        genderCode: '1',
        nationalId: '0101307789',
        citizenship: { code: 'IS', name: 'Ísland' },
      },
      date: new Date('2023-06-06T15:13:50.360Z'),
      status: 'success',
    },
  },
  id: '',
  modified: new Date(),
  state: '',
  typeId: ApplicationTypes.EXAMPLE,
  status: ApplicationStatus.IN_PROGRESS,
})

describe('answerValidators', () => {
  let application: Application
  const today = new Date()

  beforeEach(() => {
    application = createBaseApplication()
  })

  it('should return an error if selectedYear is more than 2 years ago', () => {
    const newAnswers = [
      {
        year: addYears(today, -3).getFullYear().toString(),
        month: MONTHS[today.getMonth()],
      },
    ]

    expect(answerValidators['period'](newAnswers, application)).toStrictEqual({
      message: validatorErrorMessages.periodYear,
      path: 'period.year',
      values: {},
    })
  })

  it('should return an error if selectedYear is more than 6 months ahead', () => {
    const newAnswers = [
      {
        year: addYears(today, 1).getFullYear().toString(),
        month: MONTHS[today.getMonth()],
      },
    ]

    expect(answerValidators['period'](newAnswers, application)).toStrictEqual({
      message: validatorErrorMessages.periodYear,
      path: 'period.year',
      values: {},
    })
  })

  it('should return an error if selectedMonth is more than 2 years ago', () => {
    const newAnswers = [
      {
        year: addYears(today, -2).getFullYear().toString(),
        month: MONTHS[addMonths(today, -2).getMonth()],
      },
    ]

    expect(answerValidators['period'](newAnswers, application)).toStrictEqual({
      message: validatorErrorMessages.periodMonth,
      path: 'period.month',
      values: {},
    })
  })

  it('should return an error if selectedMonth is more than 6 months ahead', () => {
    const newAnswers = [
      {
        year: today.getFullYear().toString(),
        month: MONTHS[addMonths(today, 8).getMonth()],
      },
    ]

    expect(answerValidators['period'](newAnswers, application)).toStrictEqual({
      message: validatorErrorMessages.periodMonth,
      path: 'period.month',
      values: {},
    })
  })
})
