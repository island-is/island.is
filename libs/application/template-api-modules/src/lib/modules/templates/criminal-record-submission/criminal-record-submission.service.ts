import { Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'
import { SyslumennService, PersonType } from '@island.is/clients/syslumenn'
import {
  ApplicationTypes,
  ApplicationWithAttachments as Application,
} from '@island.is/application/types'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { info } from 'kennitala'
import { TemplateApiError } from '@island.is/nest/problem'
import { coreErrorMessages } from '@island.is/application/core/messages'
import { generateSyslumennNotifyErrorEmail } from './emailGenerators/syslumennNotifyError'
import { logger } from '@island.is/logging'

@Injectable()
export class CriminalRecordSubmissionService extends BaseTemplateApiService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly syslumennService: SyslumennService,
  ) {
    super(ApplicationTypes.CRIMINAL_RECORD)
  }

  async submitApplication({ application, auth }: TemplateApiModuleActionProps) {
    logger.info('AfgreidaSakavottord Starting Submit Application Process')
    const { paymentUrl } = application.externalData.createCharge.data as {
      paymentUrl: string
    }
    if (!paymentUrl) {
      return {
        success: false,
      }
    }

    const isPayment: { fulfilled: boolean } | undefined =
      await this.sharedTemplateAPIService.getPaymentStatus(application.id)

    if (!isPayment?.fulfilled) {
      throw new Error(
        'Ekki er búið að staðfesta greiðslu, hinkraðu þar til greiðslan er staðfest.',
      )
    }

    const person = {
      ssn: application.applicant,
      signed: false,
      type: PersonType.CriminalRecordApplicant,
    }
    const persons = [person]

    const uploadDataName = 'Umsókn um sakavottorð frá Ísland.is'
    const uploadDataId = 'Sakavottord2.1'

    return await this.syslumennService
      .uploadDataCriminalRecord(
        auth,
        persons,
        undefined,
        {},
        uploadDataName,
        uploadDataId,
      )
      .catch(async (e) => {
        logger.error(e)
        await this.sharedTemplateAPIService.sendEmail(
          generateSyslumennNotifyErrorEmail,
          application as unknown as Application,
        )
        return undefined
      })
  }

  async validateCriminalRecord({ auth }: TemplateApiModuleActionProps) {
    // Validate applicants age
    const minAge = 15
    const { age } = info(auth.nationalId)
    if (age < minAge) {
      throw new TemplateApiError(
        {
          title: coreErrorMessages.nationalRegistryAgeLimitNotMetTitle,
          summary: coreErrorMessages.couldNotAssignApplicationErrorDescription,
        },
        400,
      )
    }
    return await this.syslumennService.checkCriminalRecord(auth)
  }
}
