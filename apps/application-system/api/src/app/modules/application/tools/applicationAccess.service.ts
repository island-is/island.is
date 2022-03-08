import { Injectable, NotFoundException } from '@nestjs/common'

import { Application } from '../application.model'
import { ApplicationService } from '../application.service'
import { ActorValidationFailed } from '@island.is/nest/problem'
import {
  DelegationDTO,
  ActorDelegationsControllerFindAllDirectionEnum,
  ActorDelegationsApi,
} from '@island.is/clients/auth-public-api'
import { Auth, AuthMiddleware } from '@island.is/auth-nest-tools'
interface Actor {
  name: string
  nationalId: string
}
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
    console.log('ACTOR DEL', actorDelegations)

    const nationalIds: string[] = [
      ...actorDelegations.map(
        (delegation: DelegationDTO) => delegation.fromNationalId,
      ),
      actorDelegations[0].toNationalId,
    ]
    console.log(nationalIds)

    const actorApplication = await this.applicationService.findDelegatedApplicant(
      id,
      nationalIds,
    )

    if (actorApplication) {
      if (actorApplication.applicant === auth['nationalId']) {
        return actorApplication
      }
      const isActor = actorApplication.applicant === auth.actor?.nationalId

      const actorDelegation = isActor
        ? actorDelegations.find(
            (delegation: DelegationDTO) => {
              if (delegation.toNationalId === actorApplication.applicant && delegation?.toName) {
                return {
                  name: delegation.toName,
                  nationalId: delegation.toNationalId,
                } as Actor
              }
            }
              
          )
        : undefined
      const actor = isActor && actorDelegation?.toName && actorDelegation?.toNationalId ? {name: actorDelegation?.toName, nationalId: actorDelegation?.toNationalId} : undefined

      const delegations = !isActor
        ? actorDelegations.filter(
            (delegation: DelegationDTO) =>
              delegation.fromNationalId === actorApplication.applicant, 
          )
        : []

      throw new ActorValidationFailed({
        delegatedUser: actorApplication.applicant,
        delegations: delegations,
        actor: actor,
      })
    }
    throw new NotFoundException(
      `An application with the id ${id} does not exist`,
    )
  }
}
