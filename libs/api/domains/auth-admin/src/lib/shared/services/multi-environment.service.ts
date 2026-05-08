import { Inject, Injectable } from '@nestjs/common'

import { Auth, AuthMiddleware } from '@island.is/auth-nest-tools'
import {
  AdminApi,
  AdminDevApi,
  AdminProdApi,
  AdminStagingApi,
} from '@island.is/clients/auth/admin-api'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { type ApiResponse, handle204 } from '@island.is/clients/middlewares'
import { Environment } from '@island.is/shared/types'
import { isDefined } from '@island.is/shared/utils'

import { environments } from '../constants/environments'
import { EnvironmentFailure } from '../models/multi-environment-result.model'

@Injectable()
export abstract class MultiEnvironmentService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    protected readonly logger: Logger,
    @Inject(AdminDevApi.key)
    private readonly adminDevApi?: AdminApi,
    @Inject(AdminStagingApi.key)
    private readonly adminStagingApi?: AdminApi,
    @Inject(AdminProdApi.key)
    private readonly adminProdApi?: AdminApi,
  ) {
    if (!this.adminDevApi && !this.adminStagingApi && !this.adminProdApi) {
      logger.error(
        'No admin api clients configured, at least one configured api is required.',
      )
    }
  }

  private adminDevApiWithAuth(auth: Auth) {
    return this.adminDevApi?.withMiddleware(new AuthMiddleware(auth))
  }
  private adminStagingApiWithAuth(auth: Auth) {
    return this.adminStagingApi?.withMiddleware(new AuthMiddleware(auth))
  }
  private adminProdApiWithAuth(auth: Auth) {
    return this.adminProdApi?.withMiddleware(new AuthMiddleware(auth))
  }

  private adminApiByEnvironmentWithAuth(environment: Environment, auth: Auth) {
    switch (environment) {
      case Environment.Development:
        return this.adminDevApiWithAuth(auth)
      case Environment.Staging:
        return this.adminStagingApiWithAuth(auth)
      case Environment.Production:
        return this.adminProdApiWithAuth(auth)
      default:
        return null
    }
  }

  /**
   * Request wrapper that handles 204 responses.
   * Needs to be passed the Raw functions from the openapi codegen
   */
  makeRequest<T>(
    user: Auth,
    environment: Environment,
    request: (api: AdminApi) => Promise<ApiResponse<T>>,
  ) {
    const api = this.adminApiByEnvironmentWithAuth(environment, user)

    if (!api) {
      this.logger.warn(`Environment configuration missing for ${environment}`)
      return Promise.resolve(null)
    }

    return handle204(request(api))
  }

  protected getConfiguredEnvironments(): Environment[] {
    return environments.filter((env) => {
      switch (env) {
        case Environment.Development:
          return !!this.adminDevApi
        case Environment.Staging:
          return !!this.adminStagingApi
        case Environment.Production:
          return !!this.adminProdApi
        default:
          return false
      }
    })
  }

  protected handleError(error: Error, environment: Environment) {
    this.logger.error(`Error from ${environment}`, error)

    // We swallow the errors
    return undefined
  }

  /**
   * Generic method for handling settled promises
   * The method will resolve the fulfilled promises and log errors for rejected promises
   * The return value of the fulfilled promises are mapped with the given mapper function
   */
  public handleSettledPromises<T, K>(
    settledPromises: PromiseSettledResult<T | undefined | null>[],
    {
      mapper,
      prefixErrorMessage,
    }: {
      mapper: (value: PromiseFulfilledResult<T>['value'], index: number) => K
      prefixErrorMessage?: string
    },
  ): K[] {
    return settledPromises
      .map((resp, index) => {
        if (resp.status === 'fulfilled' && resp.value) {
          return mapper(resp.value, index)
        } else if (resp.status === 'rejected') {
          this.logger.error(
            `${prefixErrorMessage ?? 'Error'} in environment ${
              environments[index]
            }`,
            resp.reason,
          )
        }
      })
      .filter(isDefined)
  }

  /**
   * Like {@link handleSettledPromises} but also collects per-environment
   * failures so callers can surface them to the user. Use for write paths
   * where silently dropping a failed env would mislead the caller.
   *
   * `requestedEnvs` must be the same array (or aligned) as the one used to
   * build the settled promises — index `i` of `settledPromises` corresponds to
   * `requestedEnvs[i]`.
   */
  public handleSettledPromisesWithFailures<T, K>(
    settledPromises: PromiseSettledResult<T | undefined | null>[],
    requestedEnvs: Environment[],
    {
      mapper,
      prefixErrorMessage,
    }: {
      mapper: (value: PromiseFulfilledResult<T>['value'], index: number) => K
      prefixErrorMessage?: string
    },
  ): { values: K[]; failures: EnvironmentFailure[] } {
    const values: K[] = []
    const failures: EnvironmentFailure[] = []

    settledPromises.forEach((resp, index) => {
      const environment = requestedEnvs[index]
      if (resp.status === 'fulfilled' && resp.value) {
        values.push(mapper(resp.value, index))
      } else if (resp.status === 'rejected') {
        const message =
          resp.reason instanceof Error
            ? resp.reason.message
            : String(resp.reason ?? 'Unknown error')
        this.logger.error(
          `${prefixErrorMessage ?? 'Error'} in environment ${environment}`,
          resp.reason,
        )
        failures.push({ environment, message })
      }
    })

    return { values, failures }
  }
}
