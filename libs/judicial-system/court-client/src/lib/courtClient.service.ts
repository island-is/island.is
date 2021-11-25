import {
  BadGatewayException,
  Inject,
  Injectable,
  UnsupportedMediaTypeException,
} from '@nestjs/common'

import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'

import {
  AuthenticateApi,
  AuthenticateRequest,
  CreateCaseApi,
  CreateCaseData,
  CreateDocumentApi,
  CreateDocumentData,
  CreateThingbokApi,
  CreateThingbokRequest,
} from '../../gen/fetch'
import { UploadStreamApi } from './uploadStreamApi'

function stripResult(str: string): string {
  if (str[0] !== '"') {
    return str
  }

  return str.slice(1, str.length - 1)
}

type CreateCaseArgs = Omit<CreateCaseData, 'authenticationToken'>

type CreateDocumentArgs = Omit<CreateDocumentData, 'authenticationToken'>

type CreateThingbokArgs = Omit<CreateThingbokRequest, 'authenticationToken'>

export const COURT_CLIENT_SERVICE_OPTIONS = 'COURT_CLIENT_SERVICE_OPTIONS'

export interface CourtClientServiceOptions {
  [key: string]: AuthenticateRequest
}

const MAX_ERRORS_BEFORE_RELOGIN = 5

@Injectable()
export class CourtClientService {
  private readonly authenticationToken: { [key: string]: string } = {}

  constructor(
    private readonly authenticateApi: AuthenticateApi,
    private readonly createCaseApi: CreateCaseApi,
    private readonly createDocumentApi: CreateDocumentApi,
    private readonly createThingbokApi: CreateThingbokApi,
    private readonly uploadStreamApi: UploadStreamApi,
    @Inject(COURT_CLIENT_SERVICE_OPTIONS)
    private readonly options: CourtClientServiceOptions,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  // The service has a 'logged in' state and at most one in progress
  // login operation should be ongoing at any given time.
  private loginPromise?: Promise<void>

  // Detecting authentication token expiration is imperfect and brittle.
  // Therefore, relogin is forced after a certain number of consecutive unknown errors from the api.
  private errorCount = 3

  private async login(clientId: string) {
    // Login is already in progress
    if (this.loginPromise) {
      return this.loginPromise
    }

    // Reset the error counter
    this.errorCount = 0

    this.loginPromise = this.authenticateApi
      .authenticate(this.options[clientId])
      .then((res) => {
        // Strip the quotation marks from the result
        this.authenticationToken[clientId] = stripResult(res)
      })
      .catch(() => {
        // Cannot log the error as it contains username and password in plain text
        this.logger.error('Unable to log into the court service')

        throw new BadGatewayException('Unable to log into the court service')
      })
      .finally(() => (this.loginPromise = undefined))

    return this.loginPromise
  }

  private handleError(reason: { status?: number; statusText?: string }): Error {
    // Now check for other known errors
    if (reason.status === 400 && reason.statusText === 'FileNotSupported') {
      this.logger.warn('Media type not supported', { reason })

      return new UnsupportedMediaTypeException(
        reason,
        'Media type not supported',
      )
    }

    this.logger.error('Error while calling the court service', { reason })

    // One step closer to forced relogin.
    // Relying on body above to contain the correct string is brittle.
    // Therefore, the error count is used as backup.
    this.errorCount++

    return new BadGatewayException(
      reason,
      'Error while calling the court service',
    )
  }

  private async authenticatedRequest(
    clientId: string,
    request: (authenticationToken: string) => Promise<string>,
  ): Promise<string> {
    // Login if there is no authentication token or too many errors since last login
    if (
      !this.authenticationToken[clientId] ||
      this.errorCount > MAX_ERRORS_BEFORE_RELOGIN
    ) {
      await this.login(clientId)
    }

    const currentAuthenticationToken = this.authenticationToken[clientId]

    return request(currentAuthenticationToken)
      .then((res) => stripResult(res))
      .catch(
        async (reason: {
          statusCode?: number
          body?: string
          status?: number
          statusText?: string
        }) => {
          // Error responses from the court system are a bit tricky.
          // There are at least two types of possible error objects
          // that are used for different types of errors.

          // Start by checking for authentication token expiration.
          if (
            reason.statusCode === 400 &&
            reason.body ===
              `authenticationToken is expired - ${currentAuthenticationToken}`
          ) {
            this.logger.warn(
              'Error while calling the court service - attempting relogin',
              { reason },
            )

            return this.login(clientId).then(() =>
              request(this.authenticationToken[clientId])
                .then((res) => stripResult(res))
                .catch((reason) => {
                  // Throw an appropriate eception
                  throw this.handleError(reason)
                }),
            )
          }

          // Throw an appropriate eception
          throw this.handleError(reason)
        },
      )
  }

  createCase(clientId: string, args: CreateCaseArgs): Promise<string> {
    return this.authenticatedRequest(clientId, (authenticationToken) =>
      this.createCaseApi.createCase({
        createCaseData: {
          ...args,
          authenticationToken,
        },
      }),
    )
  }

  createDocument(clientId: string, args: CreateDocumentArgs): Promise<string> {
    return this.authenticatedRequest(clientId, (authenticationToken) =>
      this.createDocumentApi.createDocument({
        createDocumentData: {
          ...args,
          authenticationToken,
        },
      }),
    )
  }

  createThingbok(clientId: string, args: CreateThingbokArgs): Promise<string> {
    return this.authenticatedRequest(clientId, (authenticationToken) =>
      this.createThingbokApi.createThingbok({
        ...args,
        authenticationToken,
      }),
    )
  }

  uploadStream(
    clientId: string,
    file: {
      value: Buffer
      options?: {
        filename?: string
        contentType?: string
      }
    },
  ): Promise<string> {
    return this.authenticatedRequest(clientId, (authenticationToken) =>
      this.uploadStreamApi.uploadStream(authenticationToken, file),
    )
  }
}
