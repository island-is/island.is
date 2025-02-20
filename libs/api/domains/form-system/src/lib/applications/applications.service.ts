import { Injectable, Inject } from '@nestjs/common'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { ApolloError } from '@apollo/client'
import { handle4xx } from '../../utils/errorHandler'
import {
  ApplicationsApi,
  ApplicationsControllerCreateRequest,
  ApplicationsControllerGetApplicationRequest,
} from '@island.is/clients/form-system'
import {
  ApplicationDto,
  CreateApplicationInput,
  GetApplicationInput,
} from '@island.is/form-system-dto'

@Injectable()
export class ApplicationsService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private applicationsApi: ApplicationsApi,
  ) {}

  // eslint-disable-next-line
  handleError(error: any, errorDetail?: string): ApolloError | null {
    const err = {
      error: JSON.stringify(error),
      category: 'forms-service',
    }
    this.logger.error(errorDetail || 'Error in applications service', err)

    throw new ApolloError(error.message)
  }

  private applicationsApiWithAuth(auth: User) {
    return this.applicationsApi.withMiddleware(new AuthMiddleware(auth))
  }

  async createApplication(
    auth: User,
    input: CreateApplicationInput,
  ): Promise<ApplicationDto> {
    const response = await this.applicationsApiWithAuth(auth)
      .applicationsControllerCreate(
        input as ApplicationsControllerCreateRequest,
      )
      .catch((e) =>
        handle4xx(e, this.handleError, 'failed to create application'),
      )

    if (!response || response instanceof ApolloError) {
      return {}
    }
    return response as ApplicationDto
  }

  async getApplication(
    auth: User,
    input: GetApplicationInput,
  ): Promise<ApplicationDto> {
    const response = await this.applicationsApiWithAuth(auth)
      .applicationsControllerGetApplication(
        input as ApplicationsControllerGetApplicationRequest,
      )
      .catch((e) => handle4xx(e, this.handleError, 'failed to get application'))

    if (!response || response instanceof ApolloError) {
      return {}
    }

    return response as ApplicationDto
  }
}
