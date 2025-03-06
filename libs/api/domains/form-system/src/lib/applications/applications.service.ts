import { Injectable, Inject } from '@nestjs/common'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { ApolloError } from '@apollo/client'
import { handle4xx } from '../../utils/errorHandler'
import {
  ApplicationsApi,
  ApplicationsControllerCreateRequest,
  ApplicationsControllerFindAllByTypeAndUserRequest,
  ApplicationsControllerGetApplicationRequest,
  ApplicationsControllerSubmitRequest,
  ApplicationsControllerSubmitScreenRequest,
  ApplicationsControllerUpdateRequest,
} from '@island.is/clients/form-system'
import {
  CreateApplicationInput,
  GetAllApplicationsInput,
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
    console.log('creating application', input)
    const response = await this.applicationsApiWithAuth(auth)
      .applicationsControllerCreate(
        input as ApplicationsControllerCreateRequest,
      )
      .catch((e) =>
        handle4xx(e, this.handleError, 'failed to create application'),
      )
    console.log('response', response)
    if (!response || response instanceof ApolloError) {
      if (!(response instanceof ApolloError)) {
        throw new ApolloError({ errorMessage: JSON.stringify(response) })
      }
      throw response
    }
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
    if (!response || response instanceof ApolloError) {
      if (!(response instanceof ApolloError)) {
        throw new ApolloError({ errorMessage: JSON.stringify(response) })
      }
      throw response
    }
    return response as Application
  }

  async updateDependencies(
    auth: User,
    input: UpdateApplicationDependenciesInput
  ): Promise<void> {
    const response = await this.applicationsApiWithAuth(auth)
      .applicationsControllerUpdate(
        input as ApplicationsControllerUpdateRequest
      )
      .catch((e) => handle4xx(e, this.handleError, 'failed to update application dependencies'))

    if (!response || response instanceof ApolloError) {
      return
    }
    return response
  }

  async submitApplication(
    auth: User,
    input: GetApplicationInput
  ): Promise<void> {
    const response = await this.applicationsApiWithAuth(auth)
      .applicationsControllerSubmit(
        input as ApplicationsControllerSubmitRequest
      )
      .catch((e) => handle4xx(e, this.handleError, 'failed to submit application'))

    if (!response || response instanceof ApolloError) {
      return
    }
    return response
  }

  async submitScreen(
    auth: User,
    input: SubmitScreenInput
  ): Promise<void> {
    // console.log('submitting screen', input)
    const response = await this.applicationsApiWithAuth(auth)
      .applicationsControllerSubmitScreen(
        input as ApplicationsControllerSubmitScreenRequest
      )
      .catch((e) => handle4xx(e, this.handleError, 'failed to submit screen'))

    if (!response || response instanceof ApolloError) {
      return
    }
  }

  async getApplications(
    auth: User,
    input: GetAllApplicationsInput
  ): Promise<ApplicationListDto> {
    const response = await this.applicationsApiWithAuth(auth)
      .applicationsControllerFindAllByTypeAndUser(
        input as ApplicationsControllerFindAllByTypeAndUserRequest
      )
      .catch((e) => handle4xx(e, this.handleError, 'failed to get applications'))

    if (!response || response instanceof ApolloError) {
      return {}
    }
    return response
  }

}

