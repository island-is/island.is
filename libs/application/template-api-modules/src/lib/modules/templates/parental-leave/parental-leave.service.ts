import { Injectable } from '@nestjs/common'
import { ParentalLeaveApi } from '@island.is/clients/vmst'

import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'

import {
  generateAssignOtherParentApplicationEmail,
  generateAssignEmployerApplicationEmail,
  generateApplicationApprovedEmail,
} from './emailGenerators'

import { transformApplicationToParentalLeaveDTO } from './parental-leave.utils'

@Injectable()
export class ParentalLeaveService {
  constructor(
    private parentalLeaveApi: ParentalLeaveApi,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
  ) {}

  async assignOtherParent({ application }: TemplateApiModuleActionProps) {
    await this.sharedTemplateAPIService.assignApplicationThroughEmail(
      generateAssignOtherParentApplicationEmail,
      application,
    )
  }

  async assignEmployer({ application }: TemplateApiModuleActionProps) {
    await this.sharedTemplateAPIService.assignApplicationThroughEmail(
      generateAssignEmployerApplicationEmail,
      application,
    )
  }

  async sendApplication({ application }: TemplateApiModuleActionProps) {
    const nationalRegistryId = application.applicant

    try {
      const parentalLeaveDTO = transformApplicationToParentalLeaveDTO(
        application,
      )

      const response = await this.parentalLeaveApi.parentalLeaveSetParentalLeave(
        {
          nationalRegistryId,
          parentalLeave: parentalLeaveDTO,
        },
      )

      if (response.id !== null) {
        await this.sharedTemplateAPIService.sendEmail(
          generateApplicationApprovedEmail,
          application,
        )
      } else {
        throw new Error('Could not send application')
      }

      return response
    } catch (e) {
      console.log('Failed to send application', e)
      throw e
    }
  }
}
