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
      dateOfBirth: '2021-01-15',
      expectedDateOfBirth: '2021-01-12',
      parentalRelation: 'primary',
    },
    {
      id: '1',
      expectedDateOfBirth: '2021-07-25',
      parentalRelation: 'secondary',
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
