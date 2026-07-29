import { Injectable, Inject } from '@nestjs/common'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { ApolloError } from '@apollo/client'
import { OrganizationsApi } from '@island.is/clients/form-system'
import { OrganizationDelegationUpdateInput } from '../../dto/organizationDelegation.input'

@Injectable()
export class OrganizationDelegationsService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private organizationsApi: OrganizationsApi,
  ) {}

  // eslint-disable-next-line
  handleError(error: any, errorDetail?: string): ApolloError | null {
    const err = {
      error: JSON.stringify(error),
      category: 'forms-service',
    }
    this.logger.error(
      errorDetail || 'Error in organization delegations service',
      err,
    )

    throw new ApolloError(error.message)
  }

  private organizationsApiWithAuth(auth: User) {
    return this.organizationsApi.withMiddleware(new AuthMiddleware(auth))
  }

  async createOrganizationDelegation(
    auth: User,
    input: OrganizationDelegationUpdateInput,
  ): Promise<void> {
    const delegationDto = input.updateOrganizationDelegationDto

    if (!delegationDto?.organizationNationalId || !delegationDto.delegation) {
      throw new Error('Missing organization delegation input')
    }

    await this.organizationsApiWithAuth(
      auth,
    ).organizationsControllerAddDelegation({
      organizationDelegationDto: {
        organizationNationalId: delegationDto.organizationNationalId,
        delegation: delegationDto.delegation,
      },
    })
  }

  async deleteOrganizationDelegation(
    auth: User,
    input: OrganizationDelegationUpdateInput,
  ): Promise<void> {
    const delegationDto = input.updateOrganizationDelegationDto

    if (!delegationDto?.organizationNationalId || !delegationDto.delegation) {
      throw new Error('Missing organization delegation input')
    }

    await this.organizationsApiWithAuth(
      auth,
    ).organizationsControllerDeleteDelegation({
      organizationDelegationDto: {
        organizationNationalId: delegationDto.organizationNationalId,
        delegation: delegationDto.delegation,
      },
    })
  }
}
