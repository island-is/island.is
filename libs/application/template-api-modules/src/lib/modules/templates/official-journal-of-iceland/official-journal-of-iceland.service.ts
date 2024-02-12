import { Injectable } from '@nestjs/common'

import { ApplicationTypes } from '@island.is/application/types'
import { User } from '@island.is/auth-nest-tools'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { SharedTemplateApiService } from '../../shared'
import { MinistryOfJusticeService } from '@island.is/api/domains/ministry-of-justice'
import { TemplateApiModuleActionProps } from '../../../types'
import { OJOIApplication } from '@island.is/application-templates-official-journal-of-iceland'

type Props = Omit<TemplateApiModuleActionProps, 'application'> & {
  application: OJOIApplication
}

@Injectable()
export class OfficialJournalOfIcelandService extends BaseTemplateApiService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly ministryOfJusticeService: MinistryOfJusticeService,
  ) {
    super(ApplicationTypes.OFFICIAL_JOURNAL_OF_ICELAND)
  }

  async departments(user: User) {
    return this.ministryOfJusticeService.departments(user, {})
  }

  async types(user: User) {
    return this.ministryOfJusticeService.types(user, {})
  }

  async submitApplication({ application, auth }: Props) {
    const { answers } = application

    const res = await this.ministryOfJusticeService.submitApplication(auth, {
      applicationId: application.id,
      categories: answers.publishingPreferences.contentCategories.map(
        (c) => c.value,
      ),
      department: answers.advert.department,
      document: answers.advert.documentContents,
      requestedPublicationDate: answers.publishingPreferences.date,
      subject: answers.advert.title,
      type: answers.advert.type,
    })

    if (!res.advert) {
      throw new Error('Could not submit application')
    }

    return res
  }
}
