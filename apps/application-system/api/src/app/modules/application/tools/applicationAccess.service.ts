import { Injectable, NotFoundException } from '@nestjs/common'

import {
  Application as BaseApplication,
  ApplicationService,
} from '@island.is/application/api/core'
import {
  Application,
  ApplicationTemplateHelper,
  ApplicationTypes,
} from '@island.is/application/core'
import { getApplicationTemplateByTypeId } from '@island.is/application/template-loader'
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

    return existingApplication as BaseApplication
  }

  async canDeleteApplication(
    application: Application,
    nationalId: string,
  ): Promise<boolean> {
    const templateId = application.typeId as ApplicationTypes
    const template = await getApplicationTemplateByTypeId(templateId)
    const helper = new ApplicationTemplateHelper(application, template)
    const userRole = template.mapUserToRole(nationalId, application) ?? ''
    const role = helper.getRoleInState(userRole)

    return role?.delete ?? false
  }
}
