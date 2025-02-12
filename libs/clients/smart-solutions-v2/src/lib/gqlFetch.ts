import { GraphQLClient } from 'graphql-request'
import { DocumentNode } from 'graphql'
import { Logger } from 'winston'
import { Inject, Injectable } from '@nestjs/common'
import { LOGGER_PROVIDER } from '@island.is/logging'
import {
  GraphqlErrorResponse,
  GraphqlFetchResponse,
} from './types/graphqlFetchResponses.type'
import { GRAPHQL_CLIENT_FACTORY } from './types/config.type'
import { mapErrorToActionStatusCode, Result } from './types/result.type'

@Injectable()
export class GQLFetcher {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    @Inject(GRAPHQL_CLIENT_FACTORY)
    private readonly client: GraphQLClient,
  ) {}

  async fetch<T>(
    node: DocumentNode,
    variables?: { [key: string]: unknown },
  ): Promise<Result<T>> {
    const res: GraphqlFetchResponse<T> = await this.client
      .request(node, variables)
      .then((res) => {
        return {
          data: res as T,
        }
      })
      .catch((e) => {
        const errors: GraphqlErrorResponse = e
        return {
          error: errors.response.errors?.[0],
        }
      })

    if (res.data) {
      return {
        ok: true,
        data: res.data,
      }
    }

    if (res.error) {
      const errorCode = mapErrorToActionStatusCode(
        res.error?.extensions?.type ?? undefined,
      )
      return {
        ok: false,
        error: {
          code: errorCode,
          message: res.error?.message,
          data: JSON.stringify(res.error),
        },
      }
    }

    return {
      ok: false,
      error: {
        code: 99,
        message: 'Unknown error',
      },
    }
  }
}
