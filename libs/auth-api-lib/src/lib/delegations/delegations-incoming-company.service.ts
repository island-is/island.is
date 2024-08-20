import { Inject, Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { User } from '@island.is/auth-nest-tools'
import { RskRelationshipsClient } from '@island.is/clients-rsk-relationships'
import { LOGGER_PROVIDER } from '@island.is/logging'
import {
  AuthDelegationProvider,
  AuthDelegationType,
} from '@island.is/shared/types'

import { ApiScopeUserAccess } from '../resources/models/api-scope-user-access.model'
import { ApiScopeInfo } from './delegations-incoming.service'
import { DelegationDTO } from './dto/delegation.dto'

@Injectable()
export class IncomingDelegationsCompanyService {
  constructor(
    private rskProcuringClient: RskRelationshipsClient,
    @InjectModel(ApiScopeUserAccess)
    private apiScopeUserAccessModel: typeof ApiScopeUserAccess,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  async findAllIncoming(
    user: User,
    clientAllowedApiScopes?: ApiScopeInfo[],
    requireApiScopes?: boolean,
  ): Promise<DelegationDTO[]> {
    const procuringHolderApiScopes = clientAllowedApiScopes?.filter((s) =>
      s.supportedDelegationTypes?.some(
        (dt) => dt.delegationType == AuthDelegationType.ProcurationHolder,
      ),
    )
    if (
      requireApiScopes &&
      procuringHolderApiScopes &&
      !(procuringHolderApiScopes && procuringHolderApiScopes.length > 0)
    ) {
      return []
    }

    try {
      const person = await this.rskProcuringClient.getIndividualRelationships(
        user,
      )

      if (person && person.relationships) {
        const delegations = person.relationships.map(
          (relationship) =>
            <DelegationDTO>{
              toNationalId: user.nationalId,
              fromNationalId: relationship.nationalId,
              fromName: relationship.name,
              type: AuthDelegationType.ProcurationHolder,
              provider: AuthDelegationProvider.CompanyRegistry,
            },
        )

        if (
          requireApiScopes &&
          procuringHolderApiScopes &&
          procuringHolderApiScopes.every((s) => s.isAccessControlled)
        ) {
          const fromNationalIdsWithSomeAccess =
            await this.findNationalIdsWithSomeAccess(
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
