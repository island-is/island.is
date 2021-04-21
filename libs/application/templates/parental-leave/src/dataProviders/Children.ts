import {
  BasicDataProvider,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
} from '@island.is/application/core'

interface ChildInformation {
  id: string
  dateOfBirth?: string
  expectedDateOfBirth: string
  parentalRelation: 'primary' | 'secondary'
}

const createChildrenResponse = (): ChildInformation[] => {
  return [
    {
      id: '0',
      dateOfBirth: '2020-08-01',
      expectedDateOfBirth: '2020-07-28',
      parentalRelation: 'secondary',
    },
    {
      id: '1',
      expectedDateOfBirth: '2021-07-25',
      parentalRelation: 'primary',
    },
  ]
}

// TODO: will finish this data provider in another PR
export class Children extends BasicDataProvider {
  type = 'Children'
  provide(): Promise<ChildInformation[]> {
    return Promise.resolve(createChildrenResponse())
  }

  onProvideSuccess(children: ChildInformation[]): SuccessfulDataProviderResult {
    return {
      date: new Date(),
      data: children,
      status: 'success',
    }
  }

  onProvideError(): FailedDataProviderResult {
    return {
      date: new Date(),
      data: {},
      reason: 'Failed',
      status: 'failure',
    }
  }
}
