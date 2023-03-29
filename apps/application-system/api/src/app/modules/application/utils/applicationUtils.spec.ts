import {
  getApplicantName,
  getApplicationNameTranslationString,
  getPaymentStatusForAdmin,
} from './application'
import {
  Application,
  ApplicationStatus,
  ApplicationTypes,
  ExternalData,
  FormValue,
} from '@island.is/application/types'
import {
  createApplication,
  createApplicationTemplate,
} from '@island.is/application/testing'

describe('Testing utility functions for applicatios', () => {
  it('Should return unpaid when not fulfilled and payment created date defined', () => {
    expect(
      getPaymentStatusForAdmin({ fulfilled: false, created: new Date() }),
    ).toEqual('unpaid')
  })
  it('Should return paid when fulfilled and payment created date defined', () => {
    expect(
      getPaymentStatusForAdmin({ fulfilled: true, created: new Date() }),
    ).toEqual('paid')
  })
  it('Should return null when payment object is not defined', () => {
    expect(getPaymentStatusForAdmin(null)).toEqual(null)
  })

  it('Should return null when payment object is not defined', () => {
    expect(
      getApplicantName(
        createApplication({
          externalData: {
            nationalRegistry: {
              data: {
                fullName: 'Test User',
              },
              date: new Date(),
              status: 'success',
            },
          },
        }),
      ),
    ).toEqual('Test User')
  })

  it('Should return name of the applicantt when identity external data is defined', () => {
    expect(
      getApplicantName(
        createApplication({
          externalData: {
            identity: {
              data: {
                fullName: 'Test User',
              },
              date: new Date(),
              status: 'success',
            },
          },
        }),
      ),
    ).toEqual('Test User')
  })
})

it('Should return name of the application when a function isnt defined just a string', () => {
  expect(
    getApplicationNameTranslationString(
      createApplicationTemplate(),
      createApplication({
        externalData: {
          identity: {
            data: {
              fullName: 'Test User',
            },
            date: new Date(),
            status: 'success',
          },
        },
      }),
      (message) => message as any,
    ),
  ).toEqual('Test application')
})

it('Should return name of the application according to applicant age', () => {
  expect(
    getApplicationNameTranslationString(
      createApplicationTemplate({
        name: (application) =>
          application.answers.age >= 20
            ? 'Adult Application'
            : 'Child Application',
      }),
      createApplication({
        answers: {
          age: 20,
        },
      }),
      (message) => message as any,
    ),
  ).toEqual('Adult Application')
})

it('Should return name of the application according to applicant age', () => {
  expect(
    getApplicationNameTranslationString(
      createApplicationTemplate({
        name: 'Normal Application',
      }),
      createApplication(),
      (message) => message as any,
    ),
  ).toEqual('Normal Application')
})
