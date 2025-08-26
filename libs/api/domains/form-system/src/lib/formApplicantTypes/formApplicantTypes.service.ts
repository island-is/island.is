import { Inject, Injectable } from '@nestjs/common'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { ApolloError } from '@apollo/client'
import {
  FormApplicantTypesApi,
  FormApplicantTypesControllerCreateRequest,
  FormApplicantTypesControllerDeleteRequest,
} from '@island.is/clients/form-system'
import {
  CreateApplicantInput,
  DeleteApplicantInput,
} from '../../dto/applicant.input'
import { Screen } from '../../models/screen.model'

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
    input: CreateApplicantInput,
  ): Promise<Screen> {
    try {
      const response = await this.formApplicantTypesApiWithAuth(
        auth,
      ).formApplicantTypesControllerCreate(
        input as FormApplicantTypesControllerCreateRequest,
      )
      return response as Screen
    } catch (error) {
      this.handleError(error, 'formApplicantTypesControllerCreate failed')
    }
  }

  async deleteFormApplicantType(
    auth: User,
    input: DeleteApplicantInput,
  ): Promise<Screen> {
    try {
      const response = await this.formApplicantTypesApiWithAuth(
        auth,
      ).formApplicantTypesControllerDelete(
        input as FormApplicantTypesControllerDeleteRequest,
      )
      return response as Screen
    } catch (error) {
      this.handleError(error, 'formApplicantTypesControllerDelete failed')
    }
  }
}
