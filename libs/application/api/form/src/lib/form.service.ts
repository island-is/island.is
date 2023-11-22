import { Injectable } from '@nestjs/common'
import { TemplateService } from '@island.is/application/api/core'
import { FormDto } from './dto/form.dto'
import {
  ApplicationTypes,
  Application as BaseApplication,
} from '@island.is/application/types'
import { ApplicationTemplateHelper } from '@island.is/application/core'

@Injectable()
export class FormService {
  constructor(private readonly templateService: TemplateService) {}

  async getFormByApplicationId(
    nationalId: string,
    application: BaseApplication,
  ): Promise<FormDto> {
    const template = await this.templateService.getApplicationTemplate(
      application.typeId,
    )

    //TODO: Refactor template functions
    const templateHelper = new ApplicationTemplateHelper(application, template)
    const userRole = template.mapUserToRole(nationalId, application) ?? ''
    const form = templateHelper.getRoleInState(userRole)?.form
  }
}
