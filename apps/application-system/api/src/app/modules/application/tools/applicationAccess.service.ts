import { Injectable, NotFoundException } from '@nestjs/common'

import {
  Application,
  ApplicationService,
} from '@island.is/application/api/core'
@Injectable()
export class ApplicationAccessService {
  constructor(private readonly applicationService: ApplicationService) {}

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
}
