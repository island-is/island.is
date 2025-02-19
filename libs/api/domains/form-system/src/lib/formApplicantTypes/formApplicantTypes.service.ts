import { Injectable, Inject } from '@nestjs/common'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { ApolloError } from '@apollo/client'
import { handle4xx } from '../../utils/errorHandler'
import {
  FormApplicantTypesApi,
  FormApplicantTypesControllerCreateRequest,
  FormApplicantTypesControllerDeleteRequest,
  FormApplicantTypesControllerUpdateRequest,
} from '@island.is/clients/form-system'
import {
  CreateFormApplicantTypeInput,
  DeleteFormApplicantTypeInput,
  FormApplicantTypeDto,
  UpdateFormApplicantTypeInput,
} from '@island.is/form-system-dto'

@Injectable()
export class FormApplicantTypesService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private formApplicantTypesApi: FormApplicantTypesApi,
  ) {}

  // eslint-disable-next-line
  handleError(error: any, errorDetail?: string): ApolloError | null {
    const err = {
      error: JSON.stringify(error),
      category: 'forms-service',
    }
    this.logger.error(
      errorDetail || 'Error in form applicant types service',
      err,
    )

    throw new ApolloError(error.message)
  }

  private formApplicantTypesApiWithAuth(auth: User) {
    return this.formApplicantTypesApi.withMiddleware(new AuthMiddleware(auth))
  }

  async createFormApplicantType(
    auth: User,
    input: CreateFormApplicantTypeInput,
  ): Promise<FormApplicantTypeDto> {
    const response = await this.formApplicantTypesApiWithAuth(auth)
      .formApplicantTypesControllerCreate(
        input as FormApplicantTypesControllerCreateRequest,
      )
      .catch((e) =>
        handle4xx(e, this.handleError, 'failed to create form applicant type'),
      )

    if (!response || response instanceof ApolloError) {
      throw new Error('Failed to create form applicant type')
    }
    return response as FormApplicantTypeDto
  }

  async deleteFormApplicantType(
    auth: User,
    input: DeleteFormApplicantTypeInput,
  ): Promise<void> {
    const response = await this.formApplicantTypesApiWithAuth(auth)
      .formApplicantTypesControllerDelete(
        input as FormApplicantTypesControllerDeleteRequest,
      )
      .catch((e) =>
        handle4xx(e, this.handleError, 'failed to delete form applicant type'),
      )

    if (!response || response instanceof ApolloError) {
      return
    }
  }

  async updateFormApplicantType(
    auth: User,
    input: UpdateFormApplicantTypeInput,
  ): Promise<void> {
    const response = await this.formApplicantTypesApiWithAuth(auth)
      .formApplicantTypesControllerUpdate(
        input as FormApplicantTypesControllerUpdateRequest,
      )
      .catch((e) =>
        handle4xx(e, this.handleError, 'failed to update form applicant type'),
      )

    if (!response || response instanceof ApolloError) {
      return
    }
  }
}
