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
  ApplicationsControllerNotifyRequest,
  ApplicationsControllerSaveScreenRequest,
  ApplicationsControllerSubmitRequest,
  ApplicationsControllerUpdateRequest,
} from '@island.is/clients/form-system'
import {
  ApplicationsInput,
  CreateApplicationInput,
  GetApplicationInput,
  GetApplicationsInput,
  SubmitScreenInput,
  UpdateApplicationInput,
} from '../../dto/application.input'
import {
  ApplicationResponse,
  SubmitApplicationResponse,
} from '../../models/applications.model'
import { ValidationResponse } from '../../models/screen.model'
import { NotificationRequestInput } from '@island.is/form-system/shared'

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

  async updateSettings(
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
  ): Promise<SubmitApplicationResponse> {
    const response = await this.applicationsApiWithAuth(auth)
      .applicationsControllerSubmit(
        input as ApplicationsControllerSubmitRequest,
      )
      .catch((e) =>
        handle4xx(e, this.handleError, 'failed to submit application'),
      )
    console.log(
      `submit response from resolver: ${
        response ? JSON.stringify(response) : 'no response'
      }`,
    )
    return response as SubmitApplicationResponse
  }

  async updateApplication(
    auth: User,
    input: UpdateApplicationInput,
  ): Promise<void> {
    await this.applicationsApiWithAuth(auth).applicationsControllerUpdate(
      input as ApplicationsControllerUpdateRequest,
    )
  }

  async saveScreen(auth: User, input: SubmitScreenInput): Promise<void> {
    console.log('calling save screen from resolver service')
    await this.applicationsApiWithAuth(auth).applicationsControllerSaveScreen(
      input as ApplicationsControllerSaveScreenRequest,
    )
  }

  async notifyExternalSystem(
    auth: User,
    input: NotificationRequestInput,
  ): Promise<ValidationResponse> {
    console.log(
      `calling notify external system with input: ${JSON.stringify(input)}`,
    )
    const response = await this.applicationsApiWithAuth(auth)
      .applicationsControllerNotify({
        notificationRequestDto: input,
      } as ApplicationsControllerNotifyRequest)
      .catch((e) =>
        handle4xx(e, this.handleError, 'failed to notify external system'),
      )
    return response as ValidationResponse
  }

  async deleteApplication(auth: User, input: string): Promise<void> {
    await this.applicationsApiWithAuth(
      auth,
    ).applicationsControllerDeleteApplication({
      id: input,
    } as ApplicationsControllerDeleteApplicationRequest)
  }
}
