import fetch from 'isomorphic-fetch'
import { GraphQLError } from 'graphql'
import { Locale } from '@island.is/shared/types'

import { Application } from './Application'
import {
  FailedDataProviderResult,
  SuccessfulDataProviderResult,
} from './DataProviderResult'

export type CustomTemplateFindQuery = (where: {
  [key: string]: string
}) => Promise<Application[]>

export interface DataProvider {
  readonly type: string
  provide(
    application: Application,
    customTemplateFindQuery: CustomTemplateFindQuery,
  ): Promise<unknown>
  onProvideError(_: unknown): FailedDataProviderResult
  onProvideSuccess(_: unknown): SuccessfulDataProviderResult
}

export interface DataProviderConfig {
  /** Authorization token **/
  authorization: string
  /** GraphQL api base url **/
  baseApiUrl: string
  /** Front-end language selected */
  locale: Locale
}

export interface GraphqlGatewayResponse<DataType> extends Response {
  json: () => Promise<{
    data?: DataType
    errors?: GraphQLError
  }>
}

export abstract class BasicDataProvider implements DataProvider {
  readonly type!: string
  readonly config: DataProviderConfig

  constructor(
    config: DataProviderConfig = {
      authorization: '',
      baseApiUrl: '',
      locale: 'is' as Locale,
    },
  ) {
    this.config = config
  }

  /**
   * Use this method to fetch data from external APIs
   * @param application: current application object which may or may not possess answers, and more information that
   * could be beneficial in the function body
   */
  abstract provide(
    application: Application,
    customTemplateFindQuery: CustomTemplateFindQuery,
  ): Promise<unknown>

  protected async useGraphqlGateway<DataType = any>(
    query: string,
  ): Promise<GraphqlGatewayResponse<DataType>> {
    return fetch(`${this.config.baseApiUrl}/api/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        authorization: this.config.authorization,
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
