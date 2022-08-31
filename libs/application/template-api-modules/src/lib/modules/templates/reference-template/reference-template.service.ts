import { Injectable } from '@nestjs/common'

import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'
import { getValueViaPath } from '@island.is/application/core'
import { ProblemType } from '@island.is/shared/problem'
import { ProblemError } from '@island.is/nest/problem'
import {
  generateApplicationApprovedEmail,
  generateAssignApplicationEmail,
} from './emailGenerators'

export interface ReferenceParams {
  id: number
}

const TWO_HOURS_IN_SECONDS = 2 * 60 * 60
@Injectable()
export class ReferenceTemplateService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
  ) {}

  async getReferenceData({
    application,
    params,
  }: TemplateApiModuleActionProps) {
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const name = getValueViaPath(
      application.externalData,
      'nationalRegistry.data.name',
    ) as string

    const id = params as ReferenceParams
    console.log('------------------------')
    console.log('id is ', id.id)
    console.log('------------------------')
    /*
    throw new ProblemError({
      type: ProblemType.HTTP_NOT_FOUND,
      title: 'Bad Request',
    })
    */
    return {
      referenceData: {
        name,
        some: 'data',
        numbers: 123,
      },
    }
  }

  async getAnotherReferenceData({ application }: TemplateApiModuleActionProps) {
    await new Promise((resolve) => setTimeout(resolve, 2000))

    return {
      anotherData: {
        stuff: 'same',
        notAString: 666,
      },
    }
  }

  // A test action that can be used in the ReferenceApplicationTemplate to see
  // what happens when an api action fails
  async doStuffThatFails() {
    await new Promise((resolve) => setTimeout(resolve, 2000))

    throw new Error('This is the message that caused the failure')
  }

  async createApplication({ application }: TemplateApiModuleActionProps) {
    // Pretend to be doing stuff for a short while
    await new Promise((resolve) => setTimeout(resolve, 2000))

    await this.sharedTemplateAPIService.assignApplicationThroughEmail(
      generateAssignApplicationEmail,
      application,
      TWO_HOURS_IN_SECONDS,
    )

    return {
      id: 1337,
    }
  }

  async completeApplication({ application }: TemplateApiModuleActionProps) {
    // Pretend to be doing stuff for a short while
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Use the shared service to send an email using a custom email generator
    await this.sharedTemplateAPIService.sendEmail(
      generateApplicationApprovedEmail,
      application,
    )

    return {
      id: 1337,
    }
  }
}
