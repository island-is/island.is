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
    const delegations = await this.delegationsApiWithAuth(
      auth,
    ).actorDelegationsControllerFindAll({
      direction: ActorDelegationsControllerFindAllDirectionEnum.Incoming,
    })
    console.log("DELEGATIONS", delegations)
    const nationalIds: string[] = delegations.map(
      (delegation: DelegationDTO) => delegation.fromNationalId,
    )
    console.log("national", nationalIds)
    const actorApplication = await this.applicationService.findDelegatedApplicant(
      id,
      nationalIds,
    )
    if (actorApplication) {
      console.log("actorAPLL")
      throw new ActorValidationFailed({
        delegatedUser: actorApplication.applicant,
        actor: auth.nationalId || "",
      })
    }
    console.log("ITS THE 404 FOR ME")
    throw new NotFoundException(
      `An application with the id ${id} does not exist`,
    )
  }
}
