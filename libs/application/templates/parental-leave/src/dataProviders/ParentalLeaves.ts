import {
  BasicDataProvider,
  Application,
  SuccessfulDataProviderResult,
} from '@island.is/application/core'
import { ParentalLeave } from './APIDataTypes'

function buildOldParentalLeave(applicant: string): ParentalLeave {
  return {
    applicationId: '1234uuid1234',
    applicant,
    otherParentId: '123456-7789',
    expectedDateOfBirth: '2018-05-26',
    dateOfBirth: '2018-05-26',
    email: 'asdf@asdf.is',
    phoneNumber: '555-1234',
    periods: [],
    employers: [{ nationalRegistryId: '654321-2245', email: 'asdf@boss.is' }],
    status: 'finished?',
    paymentInfo: {
      bankAccount: '444-26-123456',
      personalAllowance: 100,
      personalAllowanceFromSpouse: 0,
      union: { id: 1, name: 'VR' },
      pensionFund: { id: 'freedom', name: 'Frjálsi' },
    },
  }
}

export class ParentalLeaves extends BasicDataProvider {
  type = 'ParentalLeaves'
  provide(application: Application): Promise<unknown> {
    const { applicant } = application
    // TODO this will be the url used for this
    // return fetch(`users/${applicant}/parentalLeaves`)
    return Promise.resolve({ applicant })
  }
  onProvideSuccess(applicant: string): SuccessfulDataProviderResult {
    return {
      date: new Date(),
      data: [buildOldParentalLeave(applicant)],
      status: 'success',
    }
  }
}
