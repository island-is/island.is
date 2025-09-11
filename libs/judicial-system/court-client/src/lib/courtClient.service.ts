import https, { Agent } from 'https'

import {
  BadGatewayException,
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  NotImplementedException,
  ServiceUnavailableException,
  UnprocessableEntityException,
  UnsupportedMediaTypeException,
} from '@nestjs/common'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { ConfigType } from '@island.is/nest/config'
import {
  createXRoadAPIPath,
  XRoadMemberClass,
} from '@island.is/shared/utils/server'

import {
  AuthenticateUserApi,
  Configuration,
  CreateCaseApi,
  CreateCaseData,
  CreateDocumentApi,
  CreateDocumentData,
  CreateEmailApi,
  CreateEmailData,
  CreateThingbokApi,
  CreateThingbokRequest,
  CredentialsData,
  FetchParams,
  RequestContext,
  UpdateCaseWithDefendantApi,
  UpdateCaseWithDefendantData,
  UpdateCaseWithProsecutorApi,
  UpdateCaseWithProsecutorData,
} from '../../gen/fetch'
import { courtClientModuleConfig } from './courtClient.config'
import { UploadFile, UploadStreamApi } from './uploadStreamApi'

export type CreateCaseArgs = Omit<CreateCaseData, 'authenticationToken'>
export type CreateDocumentArgs = Omit<CreateDocumentData, 'authenticationToken'>
export type CreateThingbokArgs = Omit<
  CreateThingbokRequest,
  'authenticationToken'
>
export type CreateEmailArgs = Omit<CreateEmailData, 'authenticationToken'>
export type UploadStreamArgs = UploadFile
export type UpdateCaseWithProsecutorArgs = Omit<
  UpdateCaseWithProsecutorData,
  'authenticationToken'
>
export type UpdateCaseWithDefendantArgs = Omit<
  UpdateCaseWithDefendantData,
  'authenticationToken'
>

const injectAgentMiddleware = (agent: Agent) => {
  return async (context: RequestContext): Promise<FetchParams> => {
    const { url, init } = context

    return { url, init: { ...init, agent } } as FetchParams
  }
}

const stripResult = (str: string): string => {
  if (str[0] !== '"') {
    return str
  }

  return str.slice(1, str.length - 1)
}

interface CourtsCredentials {
  [key: string]: CredentialsData
}

interface ConnectionState {
  credentials: CredentialsData
  authenticationToken: string

  // The service has a 'logged in' state per court id and at most one in-progress
  // login operation should be ongoing per court at any given time.
  loginPromise?: Promise<void>

  // Detecting authentication token expiration is imperfect and brittle.
  // Therefore, relogin is forced after a certain number of consecutive unknown errors from the api.
  errorCount: number
}

const MAX_ERRORS_BEFORE_RELOGIN = 5

export abstract class CourtClientService {
  abstract createCase(courtId: string, args: CreateCaseArgs): Promise<string>
  abstract createDocument(
    courtId: string,
    args: CreateDocumentArgs,
  ): Promise<string>
  abstract createThingbok(
    courtId: string,
    args: CreateThingbokArgs,
  ): Promise<string>
  abstract createEmail(courtId: string, args: CreateEmailArgs): Promise<string>
  abstract updateCaseWithProsecutor(
    courtId: string,
    args: UpdateCaseWithProsecutorArgs,
  ): Promise<string>
  abstract updateCaseWithDefendant(
    courtId: string,
    args: UpdateCaseWithDefendantArgs,
  ): Promise<string>
  abstract uploadStream(
    courtId: string,
    args: UploadStreamArgs,
  ): Promise<string>
}

@Injectable()
export class CourtClientServiceImplementation implements CourtClientService {
  private readonly authenticateUserApi: AuthenticateUserApi
  private readonly createCaseApi: CreateCaseApi
  private readonly createDocumentApi: CreateDocumentApi
  private readonly createThingbokApi: CreateThingbokApi
  private readonly createEmailApi: CreateEmailApi
  private readonly updateCaseWithProsecutorApi: UpdateCaseWithProsecutorApi
  private readonly updateCaseWithDefendantApi: UpdateCaseWithDefendantApi
  private readonly uploadStreamApi: UploadStreamApi
  private readonly courtsCredentials: CourtsCredentials
  private readonly connectionState: { [key: string]: ConnectionState } = {}

  constructor(
    @Inject(courtClientModuleConfig.KEY)
    private readonly config: ConfigType<typeof courtClientModuleConfig>,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {
    // Some packages are not available in unit tests
    const agent = new https.Agent({
      cert: config.clientCert,
      key: config.clientKey,
      ca: config.clientPem,
      rejectUnauthorized: false,
    })
    const middleware = agent ? [{ pre: injectAgentMiddleware(agent) }] : []
    const defaultHeaders = { 'X-Road-Client': config.clientId }
    const basePath = createXRoadAPIPath(
      config.tlsBasePathWithEnv,
      XRoadMemberClass.GovernmentInstitution,
      config.courtMemberCode,
      config.courtApiPath,
    )
    const providerConfiguration = new Configuration({
      fetchApi: (input, init) =>
        fetch(input, init).then(async (res) => {
          if (res.ok) {
            return res
          }

          throw {
            status: res.status,
            message: await res.text(),
          }
        }),
      basePath,
      headers: defaultHeaders,
      middleware,
    })

    this.authenticateUserApi = new AuthenticateUserApi(providerConfiguration)
    this.createCaseApi = new CreateCaseApi(providerConfiguration)
    this.createDocumentApi = new CreateDocumentApi(providerConfiguration)
    this.createThingbokApi = new CreateThingbokApi(providerConfiguration)
    this.createEmailApi = new CreateEmailApi(providerConfiguration)
    this.updateCaseWithProsecutorApi = new UpdateCaseWithProsecutorApi(
      providerConfiguration,
    )
    this.updateCaseWithDefendantApi = new UpdateCaseWithDefendantApi(
      providerConfiguration,
    )
    this.uploadStreamApi = new UploadStreamApi(basePath, defaultHeaders, agent)
    this.courtsCredentials = config.courtsCredentials
  }

  private getConnectionState(courtId: string): ConnectionState {
    if (!courtId) {
      throw new BadRequestException('Missing court id')
    }

    if (!this.connectionState[courtId]) {
      const credentials = this.courtsCredentials[courtId]

      if (!credentials) {
        throw new NotImplementedException(
          `Integration with court ${courtId} not implemented`,
        )
      }

      this.connectionState[courtId] = {
        credentials,
        authenticationToken: '',
        errorCount: 0,
      }
    }

    return this.connectionState[courtId]
  }

  private async login(connectionState: ConnectionState): Promise<void> {
    // Login is already in progress
    if (connectionState.loginPromise) {
      return connectionState.loginPromise
    }

    connectionState.loginPromise = this.authenticateUserApi
      .authenticateUser({ credentials: connectionState.credentials })
      .then((res) => {
        // Reset the error counter
        connectionState.errorCount = 0

        // Strip the quotation marks from the result
        connectionState.authenticationToken = stripResult(res)
      })
      .catch((reason) => {
        throw new BadGatewayException({
          ...reason,
          message: 'Unable to log into the court service',
          detail: reason.message,
        })
      })
      .finally(() => (connectionState.loginPromise = undefined))

    return connectionState.loginPromise
  }

  private async authenticatedRequest(
    courtId: string,
    request: (authenticationToken: string) => Promise<string>,
  ): Promise<string> {
    // Get the connection state
    const connectionState = this.getConnectionState(courtId)

    // Login if there is no authentication token for the court id
    if (!connectionState.authenticationToken) {
      await this.login(connectionState)
    }

    // Force relogin if there are too many consecutive errors
    if (connectionState.errorCount >= MAX_ERRORS_BEFORE_RELOGIN) {
      this.logger.warn(
        `Too many consecutive errors (${connectionState.errorCount}) from the court service, relogin forced`,
      )

      await this.login(connectionState)
    }

    const currentAuthenticationToken = connectionState.authenticationToken

    try {
      const res = await request(currentAuthenticationToken).then((res) => {
        // Reset the error count
        connectionState.errorCount = 0

        return stripResult(res)
      })

      return res
    } catch (reason) {
      // Check for authentication token expiration.
      // Error responses from the court service are a bit tricky.
      // When a token expires, the court service responds with 400 bad request
      // and a specific error message. The 400 response is too generic
      // to be useful, so we need to check the error message for more details.
      if (
        reason.message &&
        reason.message.includes(
          `authenticationToken is expired - ${currentAuthenticationToken}`,
        )
      ) {
        this.logger.info('Authentication token expired, attempting relogin', {
          reason,
        })

        return this.login(connectionState).then(() =>
          request(connectionState.authenticationToken).then((res) =>
            stripResult(res),
          ),
        )
      }

      throw reason
    }
  }

  private handleUnknownError(
    courtId: string,
    reason: { status: string; message: unknown },
  ) {
    // Get the connection state
    const connectionState = this.getConnectionState(courtId)

    // One step closer to forced relogin because of unknown errors.
    connectionState.errorCount++

    return new BadGatewayException({
      ...reason,
      message: 'Error while calling the court service',
      detail: reason.message,
    })
  }

  private handleCaseError(
    courtId: string,
    reason: { status: string; message: unknown },
  ): Error {
    // Check for known errors
    if (
      typeof reason.message === 'string' &&
      reason.message.startsWith('Case Not Found')
    ) {
      return new NotFoundException(reason)
    }

    return this.handleUnknownError(courtId, reason)
  }

  private handleParticipantError(
    courtId: string,
    reason: { status: string; message: unknown },
  ): Error {
    // Check for known errors
    if (
      typeof reason.message === 'string' &&
      reason.message.startsWith("Incorrect 'CaseId/Number'")
    ) {
      return new NotFoundException({
        ...reason,
        message: 'Case not found',
        detail: reason.message,
      })
    }

    if (reason.message === 'The userIdNumber is not correct') {
      throw new NotFoundException({
        ...reason,
        message: 'User not found',
        detail: reason.message,
      })
    }

    return this.handleUnknownError(courtId, reason)
  }

  async createCase(courtId: string, args: CreateCaseArgs): Promise<string> {
    return this.authenticatedRequest(courtId, (authenticationToken) =>
      this.createCaseApi.createCase({
        createCaseData: { ...args, authenticationToken },
      }),
    ).catch((reason) => {
      this.logger.warn('Court client error - createCase', { courtId, reason })

      throw this.handleUnknownError(courtId, reason)
    })
  }

  async createDocument(
    courtId: string,
    args: CreateDocumentArgs,
  ): Promise<string> {
    return this.authenticatedRequest(courtId, (authenticationToken) =>
      this.createDocumentApi.createDocument({
        createDocumentData: { ...args, authenticationToken },
      }),
    ).catch((reason: { status: string; message: unknown }) => {
      this.logger.warn('Court client error - createDocument', {
        courtId,
        reason,
      })

      if (reason.message === 'FileNotSupported') {
        throw new UnsupportedMediaTypeException(reason)
      }

      throw this.handleCaseError(courtId, reason)
    })
  }

  async createThingbok(
    courtId: string,
    args: CreateThingbokArgs,
  ): Promise<string> {
    return this.authenticatedRequest(courtId, (authenticationToken) =>
      this.createThingbokApi.createThingbok({ ...args, authenticationToken }),
    ).catch((reason) => {
      this.logger.warn('Court client error - createThingbok', {
        courtId,
        reason,
      })

      throw this.handleCaseError(courtId, reason)
    })
  }

  async createEmail(courtId: string, args: CreateEmailArgs): Promise<string> {
    return this.authenticatedRequest(courtId, (authenticationToken) =>
      this.createEmailApi.createEmail({
        createEmailData: { ...args, authenticationToken },
      }),
    ).catch((reason) => {
      this.logger.warn('Court client error - createEmail', { courtId, reason })

      throw this.handleCaseError(courtId, reason)
    })
  }

  async updateCaseWithProsecutor(
    courtId: string,
    args: UpdateCaseWithProsecutorArgs,
  ): Promise<string> {
    const result = await this.authenticatedRequest(
      courtId,
      (authenticationToken) =>
        this.updateCaseWithProsecutorApi.updateCaseWithProsecutor({
          updateCaseWithProsecutorData: { ...args, authenticationToken },
        }),
    ).catch((reason) => {
      this.logger.warn('Court client error - updateCaseWithProsecutor', {
        courtId,
        reason,
      })

      throw this.handleParticipantError(courtId, reason)
    })

    if (
      result.startsWith('Participant with id') &&
      result.includes('and company id') &&
      result.includes('is added or updated successfully as prosecutor to case')
    ) {
      return result
    }

    // Handle errors reported in 200 OK responses
    if (result === 'The userIdNumber is not correct') {
      throw new NotFoundException({
        status: 200,
        message: 'User not found',
        detail: result,
      })
    }

    if (
      result.startsWith('ClientContact with idNumber') &&
      result.endsWith('could not be found')
    ) {
      throw new NotFoundException({
        status: 200,
        message: 'Prosecutor not found',
        detail: result,
      })
    }

    if (
      result.startsWith('Prosecutor with IdNumber') &&
      result.includes('and companyIdNumber') &&
      result.endsWith('was not found')
    ) {
      throw new NotFoundException({
        status: 200,
        message: 'Prosecutor not found in prosecutors office',
        detail: result,
      })
    }

    throw new UnprocessableEntityException({
      status: 200,
      message: 'Unexpected result',
      detail: result,
    })
  }

  async updateCaseWithDefendant(
    courtId: string,
    args: UpdateCaseWithDefendantArgs,
  ): Promise<string> {
    return this.authenticatedRequest(courtId, (authenticationToken) =>
      this.updateCaseWithDefendantApi.updateCaseWithDefendant({
        updateCaseWithDefendantData: { ...args, authenticationToken },
      }),
    ).catch((reason: { status: string; message: unknown }) => {
      this.logger.warn('Court client error - updateCaseWithDefendant', {
        courtId,
        reason,
      })

      if (
        typeof reason.message === 'string' &&
        reason.message.startsWith("Can't find defendant with IdNumber")
      ) {
        throw new NotFoundException(reason)
      }

      if (
        reason.message ===
        "UpdateCaseWithDefendant: 'Defendant.IdNumber' parameter is required and should be valid and provided"
      ) {
        throw new BadRequestException({
          ...reason,
          message: 'Defendant national id is missing',
          detail: reason.message,
        })
      }

      if (
        reason.message ===
        "UpdateCaseWithDefendant: 'Defendant.IdNumber' parameter is NOT valid."
      ) {
        throw new BadRequestException(
          reason,
          'Defendant national id is not valid',
        )
      }

      throw this.handleParticipantError(courtId, reason)
    })
  }

  async uploadStream(courtId: string, args: UploadStreamArgs): Promise<string> {
    return this.authenticatedRequest(courtId, (authenticationToken) =>
      this.uploadStreamApi.uploadStream(authenticationToken, args),
    ).catch((reason) => {
      this.logger.warn('Court client error - uploadStream', {
        courtId,
        reason,
      })

      throw this.handleCaseError(courtId, reason)
    })
  }
}

@Injectable()
export class CourtClientServiceUnavailableImplementation
  implements CourtClientService
{
  async createCase(_courtId: string, _args: CreateCaseArgs): Promise<string> {
    throw new ServiceUnavailableException('Court API is not available')
  }

  async createDocument(
    _courtId: string,
    _args: CreateDocumentArgs,
  ): Promise<string> {
    throw new ServiceUnavailableException('Court API is not available')
  }

  async createThingbok(
    _courtId: string,
    _args: CreateThingbokArgs,
  ): Promise<string> {
    throw new ServiceUnavailableException('Court API is not available')
  }

  async createEmail(_courtId: string, _args: CreateEmailArgs): Promise<string> {
    throw new ServiceUnavailableException('Court API is not available')
  }

  async updateCaseWithProsecutor(
    _courtId: string,
    _args: UpdateCaseWithProsecutorArgs,
  ): Promise<string> {
    throw new ServiceUnavailableException('Court API is not available')
  }

  async updateCaseWithDefendant(
    _courtId: string,
    _args: UpdateCaseWithDefendantArgs,
  ): Promise<string> {
    throw new ServiceUnavailableException('Court API is not available')
  }

  async uploadStream(
    _courtId: string,
    _args: UploadStreamArgs,
  ): Promise<string> {
    throw new ServiceUnavailableException('Court API is not available')
  }
}
