import { Injectable, NotFoundException } from '@nestjs/common'

import { BadSubject } from '@island.is/nest/problem'
import { User } from '@island.is/auth-nest-tools'

import {
  Application,
  ApplicationService,
} from '@island.is/application/api/core'
@Injectable()
export class ApplicationAccessService {
  constructor(private readonly applicationService: ApplicationService) {}

  async findOneByIdAndNationalId(id: string, user: User) {
    const existingApplication = await this.applicationService.findOneById(
      id,
      user.nationalId,
    )

    if (!existingApplication) {
      const actorApplication = await this.applicationService.findByActor(
        id,
        user.nationalId,
      )
      if (actorApplication) {
        throw new BadSubject([{ nationalId: actorApplication.applicant }])
      }
      if (user.actor?.nationalId) {
        const userActorApplication = await this.applicationService.findByActor(
          id,
          user.actor.nationalId,
        )
        if (userActorApplication) {
          throw new BadSubject([{ nationalId: userActorApplication.applicant }])
        }
      }

      throw new NotFoundException(
        `An application with the id ${id} does not exist`,
      )
    }

    return existingApplication as Application
  }
}
