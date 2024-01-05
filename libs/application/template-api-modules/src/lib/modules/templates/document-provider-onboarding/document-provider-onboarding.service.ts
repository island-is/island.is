import { Injectable } from '@nestjs/common'
import get from 'lodash/get'

import { logger } from '@island.is/logging'
import { OrganisationsApi } from '@island.is/clients/document-provider'

import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'
import {
  generateAssignReviewerEmail,
  generateApplicationApprovedEmail,
  generateApplicationRejectedEmail,
} from './emailGenerators'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { ApplicationTypes } from '@island.is/application/types'

interface Contact {
  name: string
  email: string
  phoneNumber: string
}

interface Applicant extends Contact {
  nationalId: string
  address: string
}

interface Helpdesk {
  email: string
  phoneNumber: string
}

const ONE_DAY_IN_SECONDS_EXPIRES = 24 * 60 * 60

@Injectable()
export class DocumentProviderOnboardingService extends BaseTemplateApiService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private organisationsApi: OrganisationsApi,
  ) {
    super(ApplicationTypes.DOCUMENT_PROVIDER_ONBOARDING)
  }

  async assignReviewer({ application }: TemplateApiModuleActionProps) {
    const token = await this.sharedTemplateAPIService.createAssignToken(
      application,
      ONE_DAY_IN_SECONDS_EXPIRES,
    )

    await this.sharedTemplateAPIService.assignApplicationThroughEmail(
      generateAssignReviewerEmail,
      application,
      token,
    )
  }

  async applicationApproved({
    application,
    auth,
  }: TemplateApiModuleActionProps) {
    try {
      const applicant = get(
        application.answers,
        'applicant',
      ) as unknown as Applicant
      const adminContact = get(
        application.answers,
        'administrativeContact',
      ) as unknown as Contact
      const techContact = get(
        application.answers,
        'technicalContact',
      ) as unknown as Contact
      const helpdesk = get(
        application.answers,
        'helpDesk',
      ) as unknown as Helpdesk

      const dto = {
        createOrganisationDto: {
          ...applicant,
          administrativeContact: { ...adminContact },
          technicalContact: { ...techContact },
          helpdesk: { ...helpdesk },
        },
        authorization: auth.authorization,
      }

      await this.organisationsApi.organisationControllerCreateOrganisation(dto)
    } catch (error) {
      logger.error('Failed to create organisation', error)
      throw error
    }

    await this.sharedTemplateAPIService.sendEmail(
      generateApplicationApprovedEmail,
      application,
    )
  }

  async applicationRejected({ application }: TemplateApiModuleActionProps) {
    await this.sharedTemplateAPIService.sendEmail(
      generateApplicationRejectedEmail,
      application,
    )
  }
}
