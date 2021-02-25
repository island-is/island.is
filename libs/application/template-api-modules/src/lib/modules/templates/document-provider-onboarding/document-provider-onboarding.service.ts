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

@Injectable()
export class DocumentProviderOnboardingService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
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
      ) as unknown) as Contact
      const techContact = (get(
        application.answers,
        'technicalContact',
      ) as unknown) as Contact
      const helpdesk = (get(
        application.answers,
        'helpDesk',
      ) as unknown) as Helpdesk

      const query = `mutation {
      createOrganisation(
        input: {
          nationalId: "${applicant.nationalId}"
          name: "${applicant.name}"
          address: "${applicant.address}"
          email: "${applicant.email}"
          phoneNumber: "${applicant.phoneNumber}"
          administrativeContact: {name:"${adminContact.name}", email:"${adminContact.email}", phoneNumber:"${adminContact.phoneNumber}"}
          technicalContact:{name:"${techContact.name}", email:"${techContact.email}", phoneNumber:"${techContact.phoneNumber}"}
          helpdesk:{email:"${helpdesk.email}", phoneNumber:"${helpdesk.phoneNumber}"}
        }
      ) {
        id
      }
    }`

      await this.sharedTemplateAPIService.makeGraphqlQuery(authorization, query)
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

  async organisationExists({
    application,
    authorization,
  }: TemplateApiModuleActionProps) {
    try {
      const nationalId = get(application.answers, 'applicant.nationalId')
      const query = `query {organisationExists(nationalId: "${nationalId}")}`
      await this.sharedTemplateAPIService.makeGraphqlQuery(authorization, query)
    } catch (error) {
      logger.error('Failed to check if organisation exists', error)
      throw error
    }
  }
}
