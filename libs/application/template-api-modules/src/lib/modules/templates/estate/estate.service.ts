import { Injectable } from '@nestjs/common'

import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'
@Injectable()
export class EstateTemplateService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
  ) {}

  async syslumennOnEntry({ application, auth }: TemplateApiModuleActionProps) {
    //TODO: hook up to client once API endpoint is available
    return {
      sucess: true,
      estate: {
        knowledgeOfOtherWills: 'yes',
        assets: [],
        vehicles: [],
        ships: [],
        cash: [],
        flyers: [],
        estateMembers: [],
        caseNumber: '011515',
        dateOfDeath: new Date(Date.now() - 1000 * 3600 * 24 * 15),
        nameOfDeceased: 'Lizzy B. Gone',
        nationalIdOfDeceased: '0101301234',
        districtCommissionerHasWill: true,
      },
    }
  }
}
