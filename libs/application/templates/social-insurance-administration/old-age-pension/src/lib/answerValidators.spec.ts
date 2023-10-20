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
    period: {
      year: '2023',
      month: 'February',
    },
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
    const newAnswers = {
      year: addYears(today, -3).getFullYear().toString(),
      month: MONTHS[today.getMonth()],
    }

    expect(answerValidators['period'](newAnswers, application)).toStrictEqual({
      message: validatorErrorMessages.periodYear,
      path: 'period.year',
      values: undefined,
    })
  })

  it('should return an error if selectedYear is more than 6 months ahead', () => {
    const newAnswers = {
      year: addYears(today, 2).getFullYear().toString(),
      month: MONTHS[today.getMonth()],
    }

    expect(answerValidators['period'](newAnswers, application)).toStrictEqual({
      message: validatorErrorMessages.periodYear,
      path: 'period.year',
      values: undefined,
    })
  })

  it('should return an error if selectedMonth is more than 2 years ago', () => {
    const newAnswers = {
      year: addYears(today, -2).getFullYear().toString(),
      month: MONTHS[addMonths(today, -2).getMonth()],
    }

    expect(answerValidators['period'](newAnswers, application)).toStrictEqual({
      message: validatorErrorMessages.periodMonth,
      path: 'period.month',
      values: undefined,
    })
  })

  it('should return an error if missing employer email', () => {
    const newAnswers = [
      {
        email: '',
        phoneNumber: '',
        ratioType: '',
        ratioYearly: '',
        ratioMonthlyAvg: '',
        ratioMonth: {
          March: '',
          April: '',
        },
      },
    ]

    const newApplication = {
      ...application,
      answers: {
        employment: {
          status: 'employee',
        },
      },
    }

    expect(
      answerValidators['employers'](newAnswers, newApplication),
    ).toStrictEqual({
      message: validatorErrorMessages.employerEmailMissing,
      path: 'employers[0].email',
      values: undefined,
    })
  })

  it('should return an error if missing employer rate', () => {
    const newAnswers = [
      {
        email: 'fajefja@bs.is',
        phoneNumber: '',
        ratioType: '',
        ratioYearly: '',
        ratioMonthlyAvg: '',
        ratioMonth: {
          March: '',
          April: '',
        },
      },
    ]

    const newApplication = {
      ...application,
      answers: {
        employment: {
          status: 'employee',
        },
      },
    }

    expect(
      answerValidators['employers'](newAnswers, newApplication),
    ).toStrictEqual({
      message: validatorErrorMessages.employerRatioTypeMissing,
      path: 'employers[0].ratioType',
      values: undefined,
    })
  })

  it('should return an error if phoneNumber is not GSM', () => {
    const newAnswers = [
      {
        email: 'fajefja@bs.is',
        phoneNumber: '5555555',
        ratioType: 'yearly',
        ratioYearly: '',
        ratioMonthlyAvg: '',
        ratioMonth: {
          March: '',
          April: '',
        },
      },
    ]

    const newApplication = {
      ...application,
      answers: {
        employment: {
          status: 'employee',
        },
      },
    }

    expect(
      answerValidators['employers'](newAnswers, newApplication),
    ).toStrictEqual({
      message: validatorErrorMessages.employersPhoneNumberInvalid,
      path: 'employers[0].phoneNumber',
      values: undefined,
    })
  })

  it('should return an error if missing ratioYearly', () => {
    const newAnswers = [
      {
        email: 'fajefja@bs.is',
        phoneNumber: '',
        ratioType: 'yearly',
        ratioYearly: '',
        ratioMonthlyAvg: '',
        ratioMonth: {
          March: '',
          April: '',
        },
      },
    ]

    const newApplication = {
      ...application,
      answers: {
        employment: {
          status: 'employee',
        },
      },
    }

    expect(
      answerValidators['employers'](newAnswers, newApplication),
    ).toStrictEqual({
      message: validatorErrorMessages.employerRatioMissing,
      path: 'employers[0].ratioYearly',
      values: undefined,
    })
  })

  it('should return an error if ratioYearly is more than 50', () => {
    const newAnswers = [
      {
        email: 'fajefja@bs.is',
        phoneNumber: '',
        ratioType: 'yearly',
        ratioYearly: '56',
        ratioMonthlyAvg: '',
        ratioMonth: {
          March: '',
          April: '',
        },
      },
    ]

    const newApplication = {
      ...application,
      answers: {
        employment: {
          status: 'employee',
        },
      },
    }

    expect(
      answerValidators['employers'](newAnswers, newApplication),
    ).toStrictEqual({
      message: validatorErrorMessages.employersRatioMoreThan50,
      path: 'employers[0].ratioYearly',
      values: undefined,
    })
  })

  it('should return an error if ratioYearly is less than 1', () => {
    const newAnswers = [
      {
        email: 'fajefja@bs.is',
        phoneNumber: '',
        ratioType: 'yearly',
        ratioYearly: '0',
        ratioMonthlyAvg: '',
        ratioMonth: {
          March: '',
          April: '',
        },
      },
    ]

    const newApplication = {
      ...application,
      answers: {
        employment: {
          status: 'employee',
        },
      },
    }

    expect(
      answerValidators['employers'](newAnswers, newApplication),
    ).toStrictEqual({
      message: validatorErrorMessages.employersRatioLessThan0,
      path: 'employers[0].ratioYearly',
      values: undefined,
    })
  })

  it('should return on ratioYearly an error if summary ratio is more than 50', () => {
    const newAnswers = [
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
        email: 'fajja@bs.is',
        phoneNumber: '',
        ratioType: 'yearly',
        ratioYearly: '40',
        ratioMonthlyAvg: '40',
        ratioMonth: {
          March: '400',
          April: '400',
        },
      },
    ]

    const newApplication = {
      ...application,
      answers: {
        employment: {
          status: 'employee',
        },
      },
    }

    expect(
      answerValidators['employers'](newAnswers, newApplication),
    ).toStrictEqual({
      message: validatorErrorMessages.totalEmployersRatioMoreThan50,
      path: 'employers[1].ratioYearly',
      values: undefined,
    })
  })

  it('should return an error if missing ratioMonthlyAvg', () => {
    const newAnswers = [
      {
        email: 'fajefja@bs.is',
        phoneNumber: '',
        ratioType: 'monthly',
        ratioYearly: '',
        ratioMonthlyAvg: '',
        ratioMonth: {
          March: '30',
          April: '40',
        },
      },
    ]

    const newApplication = {
      ...application,
      answers: {
        employment: {
          status: 'employee',
        },
      },
    }

    expect(
      answerValidators['employers'](newAnswers, newApplication),
    ).toStrictEqual({
      message: validatorErrorMessages.employerRatioMissing,
      path: 'employers[0].ratioMonthlyAvg',
      values: undefined,
    })
  })

  it('should return an error if ratioMonthlyAvg is more than 50', () => {
    const newAnswers = [
      {
        email: 'fajefja@bs.is',
        phoneNumber: '',
        ratioType: 'monthly',
        ratioYearly: '56',
        ratioMonthlyAvg: '67',
        ratioMonth: {
          March: '400',
          April: '400',
        },
      },
    ]

    const newApplication = {
      ...application,
      answers: {
        employment: {
          status: 'employee',
        },
      },
    }

    expect(
      answerValidators['employers'](newAnswers, newApplication),
    ).toStrictEqual({
      message: validatorErrorMessages.employersRatioMoreThan50,
      path: 'employers[0].ratioMonthlyAvg',
      values: undefined,
    })
  })

  it('should return on ratioMonthlyAvg an error if summary ratio is more than 50', () => {
    const newAnswers = [
      {
        email: 'fajja@bs.is',
        phoneNumber: '',
        ratioType: 'yearly',
        ratioYearly: '40',
        ratioMonthlyAvg: '40',
        ratioMonth: {
          March: '400',
          April: '400',
        },
      },
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
    ]

    const newApplication = {
      ...application,
      answers: {
        employment: {
          status: 'employee',
        },
      },
    }

    expect(
      answerValidators['employers'](newAnswers, newApplication),
    ).toStrictEqual({
      message: validatorErrorMessages.totalEmployersRatioMoreThan50,
      path: 'employers[1].ratioMonthlyAvg',
      values: undefined,
    })
  })

  it('should return an error if ratioMonthlyAvg is less than 1', () => {
    const newAnswers = [
      {
        email: 'fajefja@bs.is',
        phoneNumber: '',
        ratioType: 'monthly',
        ratioYearly: '0',
        ratioMonthlyAvg: '0',
        ratioMonth: {
          March: '',
          April: '',
        },
      },
    ]

    const newApplication = {
      ...application,
      answers: {
        employment: {
          status: 'employee',
        },
      },
    }

    expect(
      answerValidators['employers'](newAnswers, newApplication),
    ).toStrictEqual({
      message: validatorErrorMessages.employersRatioLessThan0,
      path: 'employers[0].ratioMonthlyAvg',
      values: undefined,
    })
  })

  it('should return an error if personalAllowance is yes but personalAllowanceUsage is missing', () => {
    const newAnswers = {
      personalAllowance: 'yes',
    }

    expect(
      answerValidators['paymentInfo'](newAnswers, application),
    ).toStrictEqual({
      message: validatorErrorMessages.requireAnswer,
      path: 'paymentInfo.personalAllowanceUsage',
      values: undefined,
    })
  })

  it('should return an error if personalAllowance is yes but personalAllowanceUsage is less than 1', () => {
    const newAnswers = {
      personalAllowance: 'yes',
      personalAllowanceUsage: '0',
    }

    expect(
      answerValidators['paymentInfo'](newAnswers, application),
    ).toStrictEqual({
      message: validatorErrorMessages.personalAllowance,
      path: 'paymentInfo.personalAllowanceUsage',
      values: undefined,
    })
  })

  it('should return an error if personalAllowance is yes but personalAllowanceUsage is more than 100', () => {
    const newAnswers = {
      personalAllowance: 'yes',
      personalAllowanceUsage: '220',
    }

    expect(
      answerValidators['paymentInfo'](newAnswers, application),
    ).toStrictEqual({
      message: validatorErrorMessages.personalAllowance,
      path: 'paymentInfo.personalAllowanceUsage',
      values: undefined,
    })
  })

  it('should return an error if spouseAllowance is yes but spouseAllowanceUsage is missing', () => {
    const newAnswers = {
      spouseAllowance: 'yes',
    }

    expect(
      answerValidators['paymentInfo'](newAnswers, application),
    ).toStrictEqual({
      message: validatorErrorMessages.requireAnswer,
      path: 'paymentInfo.spouseAllowanceUsage',
      values: undefined,
    })
  })

  it('should return an error if spouseAllowance is yes but spouseAllowanceUsage is less than 1', () => {
    const newAnswers = {
      spouseAllowance: 'yes',
      spouseAllowanceUsage: '0',
    }

    expect(
      answerValidators['paymentInfo'](newAnswers, application),
    ).toStrictEqual({
      message: validatorErrorMessages.personalAllowance,
      path: 'paymentInfo.spouseAllowanceUsage',
      values: undefined,
    })
  })

  it('should return an error if spouseAllowance is yes but spouseAllowanceUsage is more than 100', () => {
    const newAnswers = {
      spouseAllowance: 'yes',
      spouseAllowanceUsage: '220',
    }

    expect(
      answerValidators['paymentInfo'](newAnswers, application),
    ).toStrictEqual({
      message: validatorErrorMessages.personalAllowance,
      path: 'paymentInfo.spouseAllowanceUsage',
      values: undefined,
    })
  })

  it('should return an error if missing child national id', () => {
    const newAnswers = [
      {
        name: '',
        nationalIdOrBirthDate: '',
        childDoesNotHaveNationalId: false,
      },
    ]

    expect(
      answerValidators['childPensionRepeater'](newAnswers, application),
    ).toStrictEqual({
      message: validatorErrorMessages.childNationalId,
      path: 'childPensionRepeater[0].nationalIdOrBirthDate',
      values: undefined,
    })
  })

  it('should return an error if missing child birth date', () => {
    const newAnswers = [
      {
        name: '',
        nationalIdOrBirthDate: '',
        childDoesNotHaveNationalId: true,
      },
    ]

    expect(
      answerValidators['childPensionRepeater'](newAnswers, application),
    ).toStrictEqual({
      message: validatorErrorMessages.childBirthDate,
      path: 'childPensionRepeater[0].nationalIdOrBirthDate',
      values: undefined,
    })
  })

  it('should return an error if missing child name', () => {
    const newAnswers = [
      {
        name: '',
        nationalIdOrBirthDate: '2008-01-01',
        childDoesNotHaveNationalId: true,
      },
    ]

    expect(
      answerValidators['childPensionRepeater'](newAnswers, application),
    ).toStrictEqual({
      message: validatorErrorMessages.childName,
      path: 'childPensionRepeater[0].name',
      values: undefined,
    })
  })

  it('should return an error if child is 18 or older at period', () => {
    const newAnswers = [
      {
        name: '',
        // eslint-disable-next-line local-rules/disallow-kennitalas
        nationalIdOrBirthDate: '010105-1450',
        childDoesNotHaveNationalId: false,
      },
    ]

    expect(
      answerValidators['childPensionRepeater'](newAnswers, application),
    ).toStrictEqual({
      message: validatorErrorMessages.childPensionChildMustBeUnder18AtPeriod,
      path: 'childPensionRepeater[0].nationalIdOrBirthDate',
      values: undefined,
    })
  })

  it('should return an error if child is 18 or older at period', () => {
    const newAnswers = [
      {
        name: '',
        nationalIdOrBirthDate: '2005-01-01',
        childDoesNotHaveNationalId: true,
      },
    ]

    expect(
      answerValidators['childPensionRepeater'](newAnswers, application),
    ).toStrictEqual({
      message: validatorErrorMessages.childPensionChildMustBeUnder18AtPeriod,
      path: 'childPensionRepeater[0].nationalIdOrBirthDate',
      values: undefined,
    })
  })

  it('should return an error if missing ratioYearly', () => {
    const newAnswers = [
      {
        name: 'Nafn Nafnsson',
        // eslint-disable-next-line local-rules/disallow-kennitalas
        nationalIdOrBirthDate: '010105-1450',
        childDoesNotHaveNationalId: false,
      },
      {
        name: 'Nafn Nafnsdóttir',
        // eslint-disable-next-line local-rules/disallow-kennitalas
        nationalIdOrBirthDate: '010105-1450',
        childDoesNotHaveNationalId: false,
      },
    ]

    expect(
      answerValidators['childPensionRepeater'](newAnswers, application),
    ).toStrictEqual({
      message: validatorErrorMessages.childNationalIdDuplicate,
      path: 'childPensionRepeater[1].nationalIdOrBirthDate',
      values: undefined,
    })
  })

  it('should return an error if missing ratioYearly', () => {
    const newAnswers = [
      {
        name: 'Nafn Nafnsson',
        nationalIdOrBirthDate: '240915-1499',
        childDoesNotHaveNationalId: false,
      },
    ]

    expect(
      answerValidators['childPensionRepeater'](newAnswers, application),
    ).toStrictEqual({
      message: validatorErrorMessages.childNationalIdMustBeValid,
      path: 'childPensionRepeater[0].nationalIdOrBirthDate',
      values: undefined,
    })
  })
})
