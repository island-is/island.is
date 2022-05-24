import https, { Agent } from 'https'

import {
  BadGatewayException,
  Inject,
  Injectable,
  NotFoundException,
  UnsupportedMediaTypeException,
} from '@nestjs/common'

import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import type { ConfigType } from '@island.is/nest/config'
import {
  createXRoadAPIPath,
  XRoadMemberClass,
} from '@island.is/shared/utils/server'

import {
  Configuration,
  FetchParams,
  RequestContext,
  AuthenticateApi,
  AuthenticateRequest,
  CreateCaseApi,
  CreateCaseData,
  CreateDocumentApi,
  CreateDocumentData,
  CreateThingbokApi,
  CreateThingbokRequest,
  CreateEmailApi,
  CreateEmailData,
} from '../../gen/fetch'
import { UploadStreamApi } from './uploadStreamApi'
import { courtClientModuleConfig } from './courtClient.config'

function injectAgentMiddleware(agent: Agent) {
  return async (context: RequestContext): Promise<FetchParams> => {
    const { url, init } = context

    return { url, init: { ...init, agent } } as FetchParams
  }
}

function stripResult(str: string): string {
  if (str[0] !== '"') {
    return str
  }

  return str.slice(1, str.length - 1)
}

type CreateCaseArgs = Omit<CreateCaseData, 'authenticationToken'>

type CreateDocumentArgs = Omit<CreateDocumentData, 'authenticationToken'>

type CreateThingbokArgs = Omit<CreateThingbokRequest, 'authenticationToken'>

type CreateEmailArgs = Omit<CreateEmailData, 'authenticationToken'>

interface CourtsCredentials {
  [key: string]: AuthenticateRequest
}

const MAX_ERRORS_BEFORE_RELOGIN = 5

@Injectable()
export class CourtClientService {
  private readonly authenticateApi: AuthenticateApi
  private readonly createCaseApi: CreateCaseApi
  private readonly createDocumentApi: CreateDocumentApi
  private readonly createThingbokApi: CreateThingbokApi
  private readonly createEmailApi: CreateEmailApi
  private readonly uploadStreamApi: UploadStreamApi
  private readonly options: CourtsCredentials
  private readonly authenticationToken: { [key: string]: string } = {}

  constructor(
    @Inject(courtClientModuleConfig.KEY)
    config: ConfigType<typeof courtClientModuleConfig>,
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

          throw await res.text()
        }),
      basePath,
      headers: defaultHeaders,
      middleware,
    })

    this.authenticateApi = new AuthenticateApi(providerConfiguration)
    this.createCaseApi = new CreateCaseApi(providerConfiguration)
    this.createDocumentApi = new CreateDocumentApi(providerConfiguration)
    this.createThingbokApi = new CreateThingbokApi(providerConfiguration)
    this.createEmailApi = new CreateEmailApi(providerConfiguration)
    this.uploadStreamApi = new UploadStreamApi(basePath, defaultHeaders, agent)
    this.options = config.courtsCredentials
  }

  // The service has a 'logged in' state and at most one in progress
  // login operation should be ongoing at any given time.
  private loginPromise?: Promise<void>

  // Detecting authentication token expiration is imperfect and brittle.
  // Therefore, relogin is forced after a certain number of consecutive unknown errors from the api.
  private errorCount = 0

  private async login(clientId: string): Promise<void> {
    // Login is already in progress
    if (this.loginPromise) {
      return this.loginPromise
    }

    this.loginPromise = this.authenticateApi
      .authenticate(this.options[clientId])
      .then((res) => {
        // Reset the error counter
        this.errorCount = 0

        // Strip the quotation marks from the result
        this.authenticationToken[clientId] = stripResult(res)
      })
      .catch((reason) => {
        if (typeof reason === 'string') {
          throw new BadGatewayException(
            `Unable to log into the court service: ${reason}`,
          )
        }

        // The error may contain username and password in plain text
        const maskedDetail = reason.message?.replace(
          /&password=.*? /,
          '&password=xxxxx ',
        )

        throw new BadGatewayException({
          ...reason,
          message: 'Unable to log into the court service',
          detail: maskedDetail,
        })
      })
      .finally(() => (this.loginPromise = undefined))

    return this.loginPromise
  }

  private handleError(reason: unknown): Error {
    // Check for known errors
    if (reason === 'FileNotSupported') {
      return new UnsupportedMediaTypeException(reason)
    }

    if (typeof reason === 'string' && reason.startsWith('Case Not Found')) {
      return new NotFoundException(reason)
    }

    // One step closer to forced relogin.
    // Relying on body above to contain the correct string is brittle.
    // Therefore, the error count is used as backup.
    this.errorCount++

    if (typeof reason === 'string') {
      return new BadGatewayException(
        `Error while calling the court service: ${reason}`,
      )
    }

    const error = reason as Error

    return new BadGatewayException({
      ...error,
      message: 'Error while calling the court service',
      detail: error.message,
    })
  }

  private async authenticatedRequest(
    clientId: string,
    request: (authenticationToken: string) => Promise<string>,
  ): Promise<string> {
    // Login if there is no authentication token
    if (!this.authenticationToken[clientId]) {
      await this.login(clientId)
    }

    // Force relogin if there are too many consecutive errors
    if (this.errorCount >= MAX_ERRORS_BEFORE_RELOGIN) {
      this.logger.error(
        `Too many consecutive errors (${this.errorCount}) from the court service, relogin forced`,
      )

      await this.login(clientId)
    }

    const currentAuthenticationToken = this.authenticationToken[clientId]

    return request(currentAuthenticationToken)
      .then((res) => {
        // Reset the error count
        this.errorCount = 0

        return stripResult(res)
      })
      .catch(async (reason) => {
        // Error responses from the court service are a bit tricky.
        // Check for authentication token expiration.
        if (
          reason ===
          `authenticationToken is expired - ${currentAuthenticationToken}`
        ) {
          this.logger.info('Authentication token expired, attempting relogin', {
            reason,
          })

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
      })
  }

  createCase(clientId: string, args: CreateCaseArgs): Promise<string> {
    return this.authenticatedRequest(clientId, (authenticationToken) =>
      this.createCaseApi.createCase({
        createCaseData: { ...args, authenticationToken },
      }),
    )
  }

  createDocument(clientId: string, args: CreateDocumentArgs): Promise<string> {
    return this.authenticatedRequest(clientId, (authenticationToken) =>
      this.createDocumentApi.createDocument({
        createDocumentData: { ...args, authenticationToken },
      }),
    )
  }

  createThingbok(clientId: string, args: CreateThingbokArgs): Promise<string> {
    return this.authenticatedRequest(clientId, (authenticationToken) =>
      this.createThingbokApi.createThingbok({ ...args, authenticationToken }),
    )
  }

  createEmail(clientId: string, args: CreateEmailArgs): Promise<string> {
    return this.authenticatedRequest(clientId, (authenticationToken) =>
      this.createEmailApi.createEmail({
        createEmailData: { ...args, authenticationToken },
      }),
    )
  }

  uploadStream(
    clientId: string,
    file: {
      value: Buffer
      options?: { filename?: string; contentType?: string }
    },
  ): Promise<string> {
    return this.authenticatedRequest(clientId, (authenticationToken) =>
      this.uploadStreamApi.uploadStream(authenticationToken, file),
    )
  }
}
