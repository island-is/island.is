import { Injectable, NotFoundException } from '@nestjs/common'

import { Application } from '../application.model'
import { ApplicationService } from '../application.service'
import { ValidationFailed } from '@island.is/nest/problem'

@Injectable()
export class ApplicationAccessService {
  constructor(private readonly applicationService: ApplicationService) {}

  async findOneByIdAndNationalId(id: string, nationalId: string) {
    const existingApplication = await this.applicationService.findOneById(
      id,
      nationalId,
    )

    if (!existingApplication) {
      const actorApplication = await this.applicationService.findOneByActorId(
        id,
        nationalId,
      )
      if (actorApplication) {
        throw new ValidationFailed({
          applicant: actorApplication.applicant,
          actor: nationalId,
          delegationType: actorApplication.typeId,
        })
      }
      console.log('ACTOR APPLICATION', actorApplication)
      throw new NotFoundException(
        `An application with the id ${id} does not exist`,
      )
    }

    return existingApplication as Application
  }
}
