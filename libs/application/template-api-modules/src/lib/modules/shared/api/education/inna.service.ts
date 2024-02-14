import { Injectable } from '@nestjs/common'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { TemplateApiModuleActionProps } from '../../../../types'
import { InlineResponse2001, InnaClientService } from '@island.is/clients/inna'

@Injectable()
export class InnaService extends BaseTemplateApiService {
  constructor(private readonly innaService: InnaClientService) {
    super('EducationShared')
  }

  async getInnaPeriods({
    auth,
  }: TemplateApiModuleActionProps): Promise<InlineResponse2001 | null> {
    return await this.innaService.getPeriods(auth)
  }
}
