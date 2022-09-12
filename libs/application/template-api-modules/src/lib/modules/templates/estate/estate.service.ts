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
        assets: [
          {
            assetNumber: 'F2318696',
            description: 'Íbúð í Reykjavík',
          },
          {
            assetNumber: 'F2262202',
            description: 'Raðhús á Akureyri',
          },
        ],
        vehicles: [
          {
            assetNumber: 'VA334',
            description: 'Nissan Terrano II',
          },
          {
            assetNumber: 'YZ927',
            description: 'Subaru Forester',
          },
        ],
        ships: [],
        cash: [],
        flyers: [],
        estateMembers: [
          {
            name: 'Stúfur Mack',
            relation: 'Sonur',
            nationalId: '2222222229',
          },
          {
            name: 'Gervimaður Færeyja',
            relation: 'Maki',
            nationalId: '0101302399',
          },
          {
            name: 'Gervimaður Bretland',
            relation: 'Faðir',
            nationalId: '0101304929',
          },
        ],
        caseNumber: '011515',
        dateOfDeath: new Date(Date.now() - 1000 * 3600 * 24 * 100),
        nameOfDeceased: 'Lizzy B. Gone',
        nationalIdOfDeceased: '0101301234',
        districtCommissionerHasWill: true,
      },
    }
  }
}
