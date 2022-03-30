import { Injectable, NotFoundException } from '@nestjs/common'

import { ActorValidationFailed } from '@island.is/nest/problem'
import {
  ActorDelegationsControllerFindAllDirectionEnum,
  ActorDelegationsApi,
} from '@island.is/clients/auth-public-api'
import type { DelegationDTO } from '@island.is/clients/auth-public-api'
import { Auth, AuthMiddleware } from '@island.is/auth-nest-tools'
interface Actor {
  name: string
  nationalId: string
}
interface Delegation {
  name: string
  nationalId: string
  type: string
}

import {
  Application,
  ApplicationService,
} from '@island.is/application/api/core'
@Injectable()
export class ApplicationAccessService {
  constructor(
    private readonly applicationService: ApplicationService,
    private delegationsApi: ActorDelegationsApi,
  ) {}

  private delegationsApiWithAuth(auth: Auth) {
    return this.delegationsApi.withMiddleware(new AuthMiddleware(auth))
  }

  async findOneByIdAndNationalId(id: string, nationalId: string) {
    const existingApplication = await this.applicationService.findOneById(
      id,
      nationalId,
    )

    if (!existingApplication) {
      throw new NotFoundException(
        `An application with the id ${id} does not exist`,
      )
    }

    return existingApplication as Application
  }

  async findOneByIdAndDelegations(id: string, auth: Auth) {
    const actorDelegations = await this.delegationsApiWithAuth(
      auth,
    ).actorDelegationsControllerFindAll({
      direction: ActorDelegationsControllerFindAllDirectionEnum.Incoming,
    })

    // Get all national ids user has access to, could enter already delegated so add actor national id
    const nationalIds: string[] = [
      ...actorDelegations.map(
        (delegation: DelegationDTO) => delegation.fromNationalId,
      ),
      auth.actor?.nationalId || '',
    ]

    const actorApplication = await this.applicationService.findDelegatedApplicant(
      id,
      nationalIds,
    )

    if (actorApplication) {
      if (actorApplication.applicant === auth['nationalId']) {
        return actorApplication
      }

      // If applicant is actor for user
      if (actorApplication.applicant === auth.actor?.nationalId) {
        const delegation = actorDelegations.find(
          (delegation) =>
            delegation.toNationalId === actorApplication.applicant &&
            delegation.toName,
        )
        // Need to return name to frontend
        if (!delegation?.toName) {
          throw new NotFoundException(
            `An application with the id ${id} does not exist`,
          )
        }

        throw new ActorValidationFailed({
          delegatedUser: actorApplication.applicant,
          delegations: [
            {
              name: delegation.toName,
              nationalId: delegation.toNationalId,
              type: 'ACTOR',
            },
          ],
        })
      }

      // Map delegations to a simpler form
      const delegations = actorDelegations
        .filter(
          (delegation) =>
            delegation.fromNationalId === actorApplication.applicant,
        )
        .map((delegation) => ({
          name: delegation.fromName,
          nationalId: delegation.fromNationalId,
          type: delegation.type,
        }))

      throw new ActorValidationFailed({
        delegatedUser: actorApplication.applicant,
        delegations: delegations,
      })
    }
    throw new NotFoundException(
      `An application with the id ${id} does not exist`,
    )
  }
}
