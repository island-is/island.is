import { Application } from './Application'
import {
  FailedDataProviderResult,
  SuccessfulDataProviderResult,
} from './DataProviderResult'
import fetch from 'isomorphic-fetch'

export interface DataProvider {
  readonly type: string
  provide(application: Application): Promise<unknown>
  onProvideError(_: unknown): FailedDataProviderResult
  onProvideSuccess(_: unknown): SuccessfulDataProviderResult
}

export abstract class BasicDataProvider implements DataProvider {
  readonly type!: string
  readonly accessToken: string

  constructor(accessToken = '') {
    this.accessToken = accessToken
  }

  /**
   * Use this method to fetch data from external APIs
   * @param application: current application object which may or may not possess answers, and more information that
   * could be beneficial in the function body
   */
  abstract async provide(application: Application): Promise<unknown>

  protected async useGraphqlGateway(query: string): Promise<Response> {
    return fetch(`http://localhost:4444/api/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        authorization: `Bearer ${this.accessToken}`,
      },
      body: JSON.stringify({
        query,
      }),
    })
  }

  // extend this method to transform a rejected response from the provide function to the proper type
  onProvideError(_: unknown): FailedDataProviderResult {
    return {
      date: new Date(),
      reason: 'error',
      status: 'failure',
    }
  }
  // extend this method to transform a successful response from the provide function to the proper type
  onProvideSuccess(_: unknown): SuccessfulDataProviderResult {
    return {
      data: true,
      date: new Date(),
      status: 'success',
    }
  }
}
