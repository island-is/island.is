import { Injectable, Inject } from '@nestjs/common'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { ApolloError } from '@apollo/client'
import { handle4xx } from '../../utils/errorHandler'
import {
  ApplicationsApi,
  ApplicationsControllerCreateRequest,
  ApplicationsControllerGetApplicationRequest,
  ApplicationsControllerSubmitRequest,
  ApplicationsControllerSubmitScreenRequest,
  ApplicationsControllerUpdateRequest,
} from '@island.is/clients/form-system'
import {
  CreateApplicationInput,
  GetApplicationInput,
  SubmitScreenInput,
} from '../../dto/application.input'
import { Application } from '../../models/applications.model'
import { UpdateApplicationDependenciesInput } from '../../dto/application.input'

@Injectable()
export class ApplicationsService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private applicationsApi: ApplicationsApi,
  ) { }

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
  ): Promise<Application> {
    const response = await this.applicationsApiWithAuth(
      auth,
    ).applicationsControllerCreate(input as ApplicationsControllerCreateRequest)
    return response as Application
  }

  async getApplication(
    auth: User,
    input: GetApplicationInput,
  ): Promise<Application> {
    const response = await this.applicationsApiWithAuth(auth)
      .applicationsControllerGetApplication(
        input as ApplicationsControllerGetApplicationRequest,
      )
      .catch((e) => handle4xx(e, this.handleError, 'failed to get application'))

    return response as Application
  }

  async updateDependencies(
    auth: User,
    input: UpdateApplicationDependenciesInput,
  ): Promise<void> {
    await this.applicationsApiWithAuth(auth).applicationsControllerUpdate(
      input as ApplicationsControllerUpdateRequest,
    )
  }

  async submitApplication(
    auth: User,
    input: GetApplicationInput,
  ): Promise<void> {
    await this.applicationsApiWithAuth(auth).applicationsControllerSubmit(
      input as ApplicationsControllerSubmitRequest,
    )
  }

  async submitScreen(auth: User, input: SubmitScreenInput): Promise<void> {
    await this.applicationsApiWithAuth(auth).applicationsControllerSubmitScreen(
      input as ApplicationsControllerSubmitScreenRequest,
    )
  }
}
