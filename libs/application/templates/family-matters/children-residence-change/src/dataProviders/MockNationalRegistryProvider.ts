import {
  Application,
  BasicDataProvider,
  FailedDataProviderResult,
  SuccessfulDataProviderResult,
} from '@island.is/application/core'

import {
  Person,
  NationalRegistry,
} from '@island.is/application/templates/family-matters'
import { DataProviderTypes, CRCApplication } from '../types'

export class MockNationalRegistryProvider extends BasicDataProvider {
  readonly type = DataProviderTypes.MockNationalRegistry

  async provide(application: Application): Promise<NationalRegistry> {
    const crcApplication = (application as unknown) as CRCApplication
    const {
      answers: {
        mockData: { parents, children, applicant },
      },
    } = crcApplication
    if (!children) {
      throw new Error('Engin börn fundust í þinni forsjá')
    }
    const childrenArray = children.map((child) => ({
      ...child,
      livesWithApplicant: child?.livesWithApplicant?.includes('yes') || false,
      otherParent: parents[child.otherParent],
    }))

    const returnObject: NationalRegistry = {
      fullName: applicant.fullName,
      nationalId: applicant.nationalId,
      address: {
        city: applicant.address.city,
        postalCode: applicant.address.postalCode,
        streetName: applicant.address.streetName,
      },
      children: childrenArray,
    }

    return Promise.resolve(returnObject)
  }
  onProvideError(result: { message: string }): FailedDataProviderResult {
    return {
      date: new Date(),
      reason: result.message,
      status: 'failure',
    }
  }
  onProvideSuccess(result: Person): SuccessfulDataProviderResult {
    return { date: new Date(), status: 'success', data: result }
  }
}
