import { Injectable } from '@nestjs/common'
import { logger } from '@island.is/logging'
import get from 'lodash/get'

import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'

import {
  generateAssignReviewerEmail,
  generateApplicationApprovedEmail,
  generateApplicationRejectedEmail,
} from './emailGenerators'
import {
  ClientsDocumentProviderService,
  CreateContactInput,
  CreateHelpdeskInput,
  CreateOrganisationInput,
} from '@island.is/clients/document-provider'

interface Applicant {
  nationalId: string
  name: string
  email: string
  phoneNumber: string
  address: string
}

@Injectable()
export class DocumentProviderOnboardingService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private service: ClientsDocumentProviderService,
  ) {}

  async assignReviewer({ application }: TemplateApiModuleActionProps) {
    await this.sharedTemplateAPIService.assignApplicationThroughEmail(
      generateAssignReviewerEmail,
      application,
    )
  }
  async applicationApproved({
    application,
    authorization,
  }: TemplateApiModuleActionProps) {
    try {
      const applicant = (get(
        application.answers,
        'applicant',
      ) as unknown) as Applicant
      const adminContact = (get(
        application.answers,
        'administrativeContact',
      ) as unknown) as CreateContactInput
      const techContact = (get(
        application.answers,
        'technicalContact',
      ) as unknown) as CreateContactInput
      const helpdesk = (get(
        application.answers,
        'helpDesk',
      ) as unknown) as CreateHelpdeskInput

      const createOrganisationDto = {
        ...applicant,
        administrativeContact: { ...adminContact },
        technicalContact: { ...techContact },
        helpdesk: { ...helpdesk },
      } as CreateOrganisationInput

      this.service.createOrganisation(createOrganisationDto, authorization)
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
