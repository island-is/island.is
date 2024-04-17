import { Injectable } from '@nestjs/common'

import { ApplicationTypes } from '@island.is/application/types'
import { User } from '@island.is/auth-nest-tools'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { OfficialJournalOfIcelandService } from '@island.is/api/domains/official-journal-of-iceland'
import { TemplateApiModuleActionProps } from '../../../types'
import { OJOIApplication } from '@island.is/application-templates-official-journal-of-iceland'

type Props = Omit<TemplateApiModuleActionProps, 'application'> & {
  application: OJOIApplication
}

@Injectable()
export class OfficialJournalOfIcelandService extends BaseTemplateApiService {
  constructor(private readonly ojService: OfficialJournalOfIcelandService) {
    super(ApplicationTypes.OFFICIAL_JOURNAL_OF_ICELAND)
  }

  async departments(user: User) {
    return this.ojService.departments({})
  }

  async types(user: User) {
    return this.ojService.types({})
  }

  async submitApplication({ application, auth }: Props) {
    const { answers } = application

    // const res = await this.ojService.submitApplication(auth, {
    //   applicationId: application.id,
    //   categories: answers.publishingPreferences.contentCategories.map(
    //     (c) => c.value,
    //   ),
    //   department: answers.advert.department,
    //   document: answers.advert.documentContents,
    //   requestedPublicationDate: answers.publishingPreferences.date,
    //   subject: answers.advert.title,
    //   type: answers.advert.type,
    // })

    // if (!res.advert) {
    //   throw new Error('Could not submit application')
    // }

    // return res
  }
}
