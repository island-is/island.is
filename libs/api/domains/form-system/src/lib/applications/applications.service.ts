import { Injectable, Inject } from '@nestjs/common'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { ApolloError } from '@apollo/client'
import { handle4xx } from '../../utils/errorHandler'
import {
  ApplicationsApi,
  ApplicationsControllerCreateRequest,
  ApplicationsControllerDeleteApplicationRequest,
  ApplicationsControllerFindAllByOrganizationRequest,
  ApplicationsControllerFindAllBySlugAndUserRequest,
  ApplicationsControllerGetApplicationRequest,
  ApplicationsControllerSaveScreenRequest,
  ApplicationsControllerSubmitRequest,
  ApplicationsControllerSubmitSectionRequest,
  ApplicationsControllerUpdateRequest,
} from '@island.is/clients/form-system'
import {
  ApplicationsInput,
  CreateApplicationInput,
  GetApplicationInput,
  GetApplicationsInput,
  SubmitScreenInput,
  SubmitSectionInput,
  UpdateApplicationInput,
} from '../../dto/application.input'
import { ApplicationResponse } from '../../models/applications.model'
import { Screen } from '../../models/screen.model'

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
  ): Promise<ApplicationResponse> {
    const response = await this.applicationsApiWithAuth(
      auth,
    ).applicationsControllerCreate(input as ApplicationsControllerCreateRequest)
    return response as ApplicationResponse
  }

  async getApplication(
    auth: User,
    input: GetApplicationInput,
  ): Promise<ApplicationResponse> {
    const response = await this.applicationsApiWithAuth(auth)
      .applicationsControllerGetApplication(
        input as ApplicationsControllerGetApplicationRequest,
      )
      .catch((e) => handle4xx(e, this.handleError, 'failed to get application'))

    return response as ApplicationResponse
  }

  async getApplications(
    auth: User,
    input: ApplicationsInput,
  ): Promise<ApplicationResponse> {
    const response = await this.applicationsApiWithAuth(auth)
      .applicationsControllerFindAllByOrganization(
        input as ApplicationsControllerFindAllByOrganizationRequest,
      )
      .catch((e) =>
        handle4xx(e, this.handleError, 'failed to get applications'),
      )
    return response as ApplicationResponse
  }

  async getAllApplications(
    auth: User,
    input: GetApplicationsInput,
  ): Promise<ApplicationResponse> {
    const response = await this.applicationsApiWithAuth(auth)
      .applicationsControllerFindAllBySlugAndUser(
        input as ApplicationsControllerFindAllBySlugAndUserRequest,
      )
      .catch((e) =>
        handle4xx(e, this.handleError, 'failed to get applications'),
      )
    return response as ApplicationResponse
  }

  async updateDependencies(
    auth: User,
    input: UpdateApplicationInput,
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

  async updateApplication(
    auth: User,
    input: UpdateApplicationInput,
  ): Promise<void> {
    await this.applicationsApiWithAuth(auth).applicationsControllerUpdate(
      input as ApplicationsControllerUpdateRequest,
    )
  }

  async saveScreen(auth: User, input: SubmitScreenInput): Promise<Screen> {
    const response = await this.applicationsApiWithAuth(
      auth,
    ).applicationsControllerSaveScreen(
      input as ApplicationsControllerSaveScreenRequest,
    )
    return response
  }

  async submitSection(auth: User, input: SubmitSectionInput): Promise<void> {
    await this.applicationsApiWithAuth(
      auth,
    ).applicationsControllerSubmitSection(
      input as ApplicationsControllerSubmitSectionRequest,
    )
  }

  async deleteApplication(auth: User, input: string): Promise<void> {
    await this.applicationsApiWithAuth(
      auth,
    ).applicationsControllerDeleteApplication({
      id: input,
    } as ApplicationsControllerDeleteApplicationRequest)
  }
}
