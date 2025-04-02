import { Injectable, Inject } from '@nestjs/common'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { ApolloError } from '@apollo/client'
import {
  FormApplicantTypesApi,
  FormApplicantTypesControllerCreateRequest,
  FormApplicantTypesControllerDeleteRequest,
  FormApplicantTypesControllerUpdateRequest,
} from '@island.is/clients/form-system'
import {
  CreateApplicantInput,
  DeleteApplicantInput,
  UpdateApplicantInput,
} from '../../dto/applicant.input'
import { Applicant } from '../../models/applicant.model'

@Injectable()
export class ApplicantsService {
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
    this.logger.error(errorDetail || 'Error in applicants service', err)

    throw new ApolloError(error.message)
  }

  private applicantsApiWithAuth(auth: User) {
    return this.formApplicantTypesApi.withMiddleware(new AuthMiddleware(auth))
  }

  async createApplicant(
    auth: User,
    input: CreateApplicantInput,
  ): Promise<Applicant> {
    const response = await this.applicantsApiWithAuth(
      auth,
    ).formApplicantTypesControllerCreate(
      input as FormApplicantTypesControllerCreateRequest,
    )
    return response as Applicant
  }

  async deleteApplicant(
    auth: User,
    input: DeleteApplicantInput,
  ): Promise<void> {
    await this.applicantsApiWithAuth(auth).formApplicantTypesControllerDelete(
      input as FormApplicantTypesControllerDeleteRequest,
    )
  }

  async updateApplicant(
    auth: User,
    input: UpdateApplicantInput,
  ): Promise<void> {
    await this.applicantsApiWithAuth(auth).formApplicantTypesControllerUpdate(
      input as FormApplicantTypesControllerUpdateRequest,
    )
  }
}
