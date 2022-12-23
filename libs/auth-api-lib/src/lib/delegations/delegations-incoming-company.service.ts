import { User } from '@island.is/auth-nest-tools'
import { RskProcuringClient } from '@island.is/clients/rsk/procuring'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Op } from 'sequelize'
import { ApiScopeUserAccess } from '../resources/models/api-scope-user-access.model'
import { ApiScope } from '../resources/models/api-scope.model'
import { DelegationDTO, DelegationProvider } from './dto/delegation.dto'
import { DelegationType } from './types/delegationType'

@Injectable()
export class IncomingDelegationsCompanyService {
  constructor(
    private rskProcuringClient: RskProcuringClient,
    @InjectModel(ApiScopeUserAccess)
    private apiScopeUserAccessModel: typeof ApiScopeUserAccess,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  async findAllIncoming(
    user: User,
    clientAllowedApiScopes?: ApiScope[],
    requireApiScopes?: boolean,
  ): Promise<DelegationDTO[]> {
    const procuringHolderApiScopes = clientAllowedApiScopes?.filter(
      (s) => s.grantToProcuringHolders,
    )
    if (
      requireApiScopes &&
      procuringHolderApiScopes &&
      !(procuringHolderApiScopes && procuringHolderApiScopes.length > 0)
    ) {
      return []
    }

    try {
      const person = await this.rskProcuringClient.getSimple(user)

      if (person && person.companies) {
        const delegations = person.companies.map(
          (company) =>
            <DelegationDTO>{
              toNationalId: user.nationalId,
              fromNationalId: company.nationalId,
              fromName: company.name,
              type: DelegationType.ProcurationHolder,
              provider: DelegationProvider.CompanyRegistry,
            },
        )

        if (
          requireApiScopes &&
          procuringHolderApiScopes &&
          procuringHolderApiScopes.every((s) => s.isAccessControlled)
        ) {
          const fromNationalIdsWithSomeAccess = await this.findNationalIdsWithSomeAccess(
            delegations.map((d) => d.fromNationalId),
            procuringHolderApiScopes
              .filter((s) => s.isAccessControlled)
              .map((s) => s.name),
          )

          return delegations.filter((d) =>
            fromNationalIdsWithSomeAccess.includes(d.fromNationalId),
          )
        } else {
          return delegations
        }
      }
    } catch (error) {
      this.logger.error('Error in findAllCompanies', error)
    }

    return []
  }

  private async findNationalIdsWithSomeAccess(
    nationalIds: string[],
    protectedScopes: string[],
  ): Promise<string[]> {
    return await this.apiScopeUserAccessModel
      .findAll({
        attributes: ['nationalId'],
        ['distinct' as string]: true, // TODO: does this work?
        where: {
          nationalId: nationalIds,
          scope: protectedScopes,
        },
      })
      .then((result) => result.map((access) => access.nationalId))
  }
}
