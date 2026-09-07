import { Injectable, Inject } from '@nestjs/common'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { ApolloError } from '@apollo/client'
import { FormsApi } from '@island.is/clients/form-system'
import { FormDelegationUpdateInput } from '../../dto/formDelegation.input'

@Injectable()
export class FormDelegationsService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private formsApi: FormsApi,
  ) {}

  // eslint-disable-next-line
  handleError(error: any, errorDetail?: string): ApolloError | null {
    const err = {
      error: JSON.stringify(error),
      category: 'forms-service',
    }
    this.logger.error(errorDetail || 'Error in form delegations service', err)

    throw new ApolloError(error.message)
  }

  private formsApiWithAuth(auth: User) {
    return this.formsApi.withMiddleware(new AuthMiddleware(auth))
  }

  async createFormDelegation(
    auth: User,
    input: FormDelegationUpdateInput,
  ): Promise<void> {
    const delegationDto = input.updateFormDelegationDto

    if (!delegationDto?.formId || !delegationDto.delegation) {
      throw new Error('Missing form delegation input')
    }

    try {
      await this.formsApiWithAuth(auth).formsControllerAddDelegation({
        formDelegationDto: {
          formId: delegationDto.formId,
          delegation: delegationDto.delegation,
        },
      })
    } catch (error) {
      const normalizedError =
        error instanceof Error ? error : new Error(String(error))
      this.handleError(normalizedError, 'Error creating form delegation')
    }
  }

  async deleteFormDelegation(
    auth: User,
    input: FormDelegationUpdateInput,
  ): Promise<void> {
    const delegationDto = input.updateFormDelegationDto

    if (!delegationDto?.formId || !delegationDto.delegation) {
      throw new Error('Missing form delegation input')
    }

    try {
      await this.formsApiWithAuth(auth).formsControllerDeleteDelegation({
        formDelegationDto: {
          formId: delegationDto.formId,
          delegation: delegationDto.delegation,
        },
      })
    } catch (error) {
      const normalizedError =
        error instanceof Error ? error : new Error(String(error))
      this.handleError(normalizedError, 'Error deleting form delegation')
    }
  }
}
