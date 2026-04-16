import { Injectable } from '@nestjs/common'
import { ApplicationTypes } from '@island.is/application/types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { TemplateApiModuleActionProps } from '../../../../types'

@Injectable()
export class ExampleSdfService extends BaseTemplateApiService {
  constructor() {
    super(ApplicationTypes.EXAMPLE_SDF)
  }

  async getMyPlots({ application }: TemplateApiModuleActionProps) {
    return {
      plots: [
        {
          id: 'plot-001',
          name: 'Sólgarður A12',
          address: 'Laugavegur 15, 101 Reykjavík',
          sizeSqm: 45,
        },
        {
          id: 'plot-002',
          name: 'Blómabeð B7',
          address: 'Hverfisgata 22, 101 Reykjavík',
          sizeSqm: 30,
        },
        {
          id: 'plot-003',
          name: 'Gróðurhús C3',
          address: 'Skólavörðustígur 8, 101 Reykjavík',
          sizeSqm: 60,
        },
      ],
    }
  }
}
