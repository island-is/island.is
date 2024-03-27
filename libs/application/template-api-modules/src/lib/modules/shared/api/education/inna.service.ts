import { Injectable } from '@nestjs/common'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { TemplateApiModuleActionProps } from '../../../../types'
import {
  InlineResponse2001Items,
  InlineResponse200Items,
  InnaClientService,
} from '@island.is/clients/inna'
import { TemplateApiError } from '@island.is/nest/problem'
import { coreErrorMessages } from '@island.is/application/core'
import { InnaParameters } from '@island.is/application/types'

@Injectable()
export class InnaService extends BaseTemplateApiService {
  constructor(private readonly innaService: InnaClientService) {
    super('EducationShared')
  }

  async getInnaDiplomas({
    auth,
    params,
  }: TemplateApiModuleActionProps<InnaParameters>): Promise<
    Array<InlineResponse200Items> | null | undefined
  > {
    let res

    try {
      res = await this.innaService.getDiplomas(auth)
    } catch (e) {
      if (!params?.allowEmpty) {
        throw new TemplateApiError(
          {
            title: coreErrorMessages.errorDataProvider,
            summary: coreErrorMessages.errorDataProvider,
          },
          400,
        )
      }
    }

    if (!res && !params?.allowEmpty) {
      throw new TemplateApiError(
        {
          title: coreErrorMessages.errorDataProvider,
          summary: coreErrorMessages.errorDataProvider,
        },
        400,
      )
    }

    return res?.items || []
  }

  async getInnaPeriods({
    auth,
  }: TemplateApiModuleActionProps): Promise<
    Array<InlineResponse2001Items> | null | undefined
  > {
    let res
    try {
      res = await this.innaService.getPeriods(auth)
    } catch (e) {
      throw new TemplateApiError(
        {
          title: coreErrorMessages.errorDataProvider,
          summary: coreErrorMessages.errorDataProvider,
        },
        400,
      )
    }

    if (!res) {
      throw new TemplateApiError(
        {
          title: coreErrorMessages.errorDataProvider,
          summary: coreErrorMessages.errorDataProvider,
        },
        400,
      )
    }

    return res?.items
  }
}
