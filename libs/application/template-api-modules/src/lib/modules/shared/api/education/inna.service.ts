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
  }: TemplateApiModuleActionProps): Promise<
    InlineResponse2001 | null | undefined
  > {
    console.log('auth', auth)
    let results
    try {
      results = await this.innaService.getPeriods(auth)
    } catch (e) {
      console.log('errrrrrror', e)
    }
    return results
  }
}
