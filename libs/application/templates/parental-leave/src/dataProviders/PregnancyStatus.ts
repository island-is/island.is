import {
  BasicDataProvider,
  Application,
  SuccessfulDataProviderResult,
} from '@island.is/application/core'

export class PregnancyStatus extends BasicDataProvider {
  type = 'PregnancyStatus'
  provide(application: Application): Promise<unknown> {
    // TODO this will be the url used for this
    // const {applicant} = application
    // return fetch(`users/${applicant}/pregnancyStatus`)
    return Promise.resolve({})
  }
  onProvideSuccess(): SuccessfulDataProviderResult {
    return {
      date: new Date(),
      data: {
        hasActivePregnancy: true,
        pregnancyDueDate: '2021-01-15',
      },
      status: 'success',
    }
  }
}
