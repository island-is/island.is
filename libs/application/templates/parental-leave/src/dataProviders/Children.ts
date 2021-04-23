import {
  BasicDataProvider,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
  Application,
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
  async provide(
    application: Application,
    customTemplateFindQuery: any,
  ): Promise<ChildInformation[]> {
    const result = await customTemplateFindQuery({
      'answers.otherParentId': '1805922889',
    })
    console.log(result)

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
