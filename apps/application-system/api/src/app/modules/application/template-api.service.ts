import { Injectable, NotFoundException } from '@nestjs/common'
import { ApplicationService } from './application.service'

import { BaseTemplateApiApplicationService } from '@island.is/application/template-api-modules'

@Injectable()
export class TemplateApiApplicationService extends BaseTemplateApiApplicationService {
  constructor(private readonly applicationService: ApplicationService) {
    super()
  }

  async saveAttachmentToApplicaton(
    applicationId: string,
    key: string,
    url: string,
  ): Promise<void> {
    const existingApplication = await this.applicationService.findOneById(
      applicationId,
    )

    if (!existingApplication) {
      throw new NotFoundException(
        `An application with the id ${applicationId} does not exist`,
      )
    }

    await this.applicationService.update(existingApplication.id, {
      attachments: {
        ...existingApplication.attachments,
        [key]: url,
      },
    })
  }
}
