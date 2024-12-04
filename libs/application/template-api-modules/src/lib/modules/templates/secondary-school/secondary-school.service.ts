import { Injectable } from '@nestjs/common'
import { TemplateApiModuleActionProps } from '../../../types'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { ApplicationTypes } from '@island.is/application/types'
import { SecondarySchoolAnswers } from '@island.is/application/templates/secondary-school'

@Injectable()
export class SecondarySchoolService extends BaseTemplateApiService {
  constructor() {
    super(ApplicationTypes.SECONDARY_SCHOOL)
  }

  async getSchools({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<
    {
      id: string
      name: string
      thirdLanguages: { code: string; name: string }[]
    }[]
  > {
    //TODOx get from MMS api when ready
    return [
      {
        id: '1',
        name: 'Verslunarmannaskólinn',
        thirdLanguages: [
          { code: 'DE', name: 'Þýska' },
          { code: 'FR', name: 'Franska' },
        ],
      },
      {
        id: '2',
        name: 'Menntaskólinn í Reykjavík',
        thirdLanguages: [
          { code: 'DE', name: 'Þýska' },
          { code: 'FR', name: 'Franska' },
        ],
      },
      {
        id: '3',
        name: 'Kvennaskólinn í Reykjavík',
        thirdLanguages: [
          { code: 'DE', name: 'Þýska' },
          { code: 'FR', name: 'Franska' },
        ],
      },
      {
        id: '4',
        name: 'Fjölbrautaskólinn við Ármúla',
        thirdLanguages: [
          { code: 'DE', name: 'Þýska' },
          { code: 'FR', name: 'Franska' },
        ],
      },
    ]
  }

  async validateApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<void> {
    //TODOx validate that you are allowed to create the application (registration is open)
  }

  async submitApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<void> {
    const answers = application.answers as SecondarySchoolAnswers

    // TODOx post to MMS api when ready
  }
}
