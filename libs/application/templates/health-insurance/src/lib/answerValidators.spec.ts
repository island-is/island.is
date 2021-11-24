import { Application, ApplicationTypes } from '@island.is/application/core'
import { NO, YES, StatusTypes } from '../shared'

import { answerValidators } from './answerValidators'

describe('answerValidators', () => {
  const baseApplication: Application = {
    answers: {
      fieldId: 'some answer',
      applicant: { citizenship: '{"code":"IS","name":"Ísland"}' },
    },
    assignees: [],
    applicant: '',
    attachments: {},
    created: new Date(),
    externalData: {
      nationalRegistry: {
        date: new Date(),
        status: 'success',
        data: {},
      },
      userProfile: {
        date: new Date(),
        status: 'success',
        data: {},
      },
    },
    id: '',
    modified: new Date(),
    state: '',
    typeId: ApplicationTypes.HEALTH_INSURANCE,
  }

  it('should return error when status type is not a defined type', () => {
    const newStatusAnswers = {
      type: 'someType',
    }

    expect(
      answerValidators['status'](newStatusAnswers, baseApplication),
    ).toStrictEqual({
      message: 'You must select one of the above',
      path: 'status.type',
      values: undefined,
    })
  })

  it('should not return any error when status type a defined type', () => {
    const newStatusAnswers = {
      type: StatusTypes.OTHER,
    }

    expect(
      answerValidators['status'](newStatusAnswers, baseApplication),
    ).toStrictEqual(undefined)
  })

  it('should return error when student has not attached a file', () => {
    const newStatusAnswers = {
      type: StatusTypes.STUDENT,
      confirmationOfStudies: [],
    }

    expect(
      answerValidators['status'](newStatusAnswers, baseApplication),
    ).toStrictEqual({
      message: 'Please attach a confirmation of studies',
      path: 'status.confirmationOfStudies',
      values: undefined,
    })
  })

  it('should not return error when student has attached a file', () => {
    const newStatusAnswers = {
      type: StatusTypes.STUDENT,
      confirmationOfStudies: [
        { name: 'some filename', key: 'uuid', url: 'url to file' },
      ],
    }

    expect(
      answerValidators['status'](newStatusAnswers, baseApplication),
    ).toStrictEqual(undefined)
  })

  it('should return error when former insurance registration is empty', () => {
    const newFormerInsuranceAnswers = {
      registration: '',
    }

    expect(
      answerValidators['formerInsurance'](
        newFormerInsuranceAnswers,
        baseApplication,
      ),
    ).toStrictEqual({
      message: 'You must select one of the above',
      path: 'formerInsurance.registration',
      values: undefined,
    })
  })

  it('should return error when former insurance country is empty', () => {
    const newFormerInsuranceAnswers = {
      registration: 'yes',
      country: '',
    }

    expect(
      answerValidators['formerInsurance'](
        newFormerInsuranceAnswers,
        baseApplication,
      ),
    ).toStrictEqual({
      message: 'Please select a country',
      path: 'formerInsurance.country',
      values: undefined,
    })
  })

  it('should return error if waiting period is required due to moving form country outside of EU', () => {
    const newFormerInsuranceAnswers = {
      registration: YES,
      country: 'Outside of EU',
    }

    expect(
      answerValidators['formerInsurance'](
        newFormerInsuranceAnswers,
        baseApplication,
      ),
    ).toStrictEqual({
      message: '',
      path: 'formerInsurance',
      values: undefined,
    })
  })

  it('should return error if waiting period is required due to citizenship outside of EU', () => {
    const newApplication = {
      ...baseApplication,
      answers: { applicant: { citizenship: 'outside EU' } },
    } as Application

    const newFormerInsuranceAnswers = {
      registration: YES,
      country: JSON.stringify({ name: 'Belgium', countryCode: 'BE' }),
    }

    expect(
      answerValidators['formerInsurance'](
        newFormerInsuranceAnswers,
        newApplication,
      ),
    ).toStrictEqual({
      message: '',
      path: 'formerInsurance',
      values: undefined,
    })
  })

  it('should return error if personal id is undefined', () => {
    const newFormerInsuranceAnswers = {
      registration: YES,
      country: JSON.stringify({ name: 'Greenland', countryCode: 'GL' }),
    }

    expect(
      answerValidators['formerInsurance'](
        newFormerInsuranceAnswers,
        baseApplication,
      ),
    ).toStrictEqual({
      message: 'Please fill in your ID number in previous country',
      path: 'formerInsurance.personalId',
      values: undefined,
    })
  })

  it('should return error if personal id is greater than 20', () => {
    const newFormerInsuranceAnswers = {
      registration: YES,
      country: JSON.stringify({ name: 'Greenland', countryCode: 'GL' }),
      personalId: '012345678901234567890',
    }

    expect(
      answerValidators['formerInsurance'](
        newFormerInsuranceAnswers,
        baseApplication,
      ),
    ).toStrictEqual({
      message: 'Should be at most 20 characters long',
      path: 'formerInsurance.personalId',
      values: undefined,
    })
  })

  it('should return error if personal id is less than 6', () => {
    const newFormerInsuranceAnswers = {
      registration: YES,
      country: JSON.stringify({ name: 'Greenland', countryCode: 'GL' }),
      personalId: '000',
    }

    expect(
      answerValidators['formerInsurance'](
        newFormerInsuranceAnswers,
        baseApplication,
      ),
    ).toStrictEqual({
      message: 'Should be at least 6 characters',
      path: 'formerInsurance.personalId',
      values: undefined,
    })
  })

  it('should return error if moving from Greenland but not attached file', () => {
    const newFormerInsuranceAnswers = {
      registration: YES,
      personalId: 'some id',
      country: JSON.stringify({ name: 'Greenland', countryCode: 'GL' }),
      confirmationOfResidencyDocument: [],
    }

    expect(
      answerValidators['formerInsurance'](
        newFormerInsuranceAnswers,
        baseApplication,
      ),
    ).toStrictEqual({
      message: 'Please attach a confirmation of residency',
      path: 'formerInsurance.confirmationOfResidencyDocument',
      values: undefined,
    })
  })

  it('should return next error if moving from Greenland and attached file', () => {
    const newFormerInsuranceAnswers = {
      registration: YES,
      personalId: 'some id',
      country: JSON.stringify({ name: 'Greenland', countryCode: 'GL' }),
      confirmationOfResidencyDocument: [
        { name: 'some filename', key: 'uuid', url: 'url to file' },
      ],
    }

    expect(
      answerValidators['formerInsurance'](
        newFormerInsuranceAnswers,
        baseApplication,
      ),
    ).toStrictEqual({
      message: 'You must select one of the above',
      path: 'formerInsurance.entitlement',
      values: undefined,
    })
  })

  it('should return error if entitelment is not a defined answer', () => {
    const newFormerInsuranceAnswers = {
      registration: YES,
      personalId: 'some id',
      country: JSON.stringify({ name: 'Greenland', countryCode: 'GL' }),
      confirmationOfResidencyDocument: [
        { name: 'some filename', key: 'uuid', url: 'url to file' },
      ],
      entitelment: 'some answer',
    }

    expect(
      answerValidators['formerInsurance'](
        newFormerInsuranceAnswers,
        baseApplication,
      ),
    ).toStrictEqual({
      message: 'You must select one of the above',
      path: 'formerInsurance.entitlement',
      values: undefined,
    })
  })

  it('should return error if user is entitled but doesnt explain why', () => {
    const newFormerInsuranceAnswers = {
      registration: YES,
      personalId: 'some id',
      country: JSON.stringify({ name: 'Belgium', countryCode: 'BE' }),
      entitlement: YES,
    }

    expect(
      answerValidators['formerInsurance'](
        newFormerInsuranceAnswers,
        baseApplication,
      ),
    ).toStrictEqual({
      message: 'Please fill in a reason',
      path: 'formerInsurance.entitlementReason',
      values: undefined,
    })
  })

  it('should not return error if all is filled and country does not require attachment nor waiting period', () => {
    const newFormerInsuranceAnswers = {
      registration: YES,
      personalId: 'some id',
      country: JSON.stringify({ name: 'Belgium', countryCode: 'BE' }),
      entitlement: NO,
    }

    expect(
      answerValidators['formerInsurance'](
        newFormerInsuranceAnswers,
        baseApplication,
      ),
    ).toStrictEqual(undefined)
  })
})
