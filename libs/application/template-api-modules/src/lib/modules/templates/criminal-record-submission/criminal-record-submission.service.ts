import { Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'
import { CriminalRecordService } from '@island.is/api/domains/criminal-record'
import { SyslumennService, PersonType } from '@island.is/clients/syslumenn'
import {
  ApplicationTypes,
  ApplicationWithAttachments as Application,
} from '@island.is/application/types'
import { UserProfile } from './types'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { info } from 'kennitala'
import { TemplateApiError } from '@island.is/nest/problem'
import { coreErrorMessages } from '@island.is/application/core/messages'
import { generateSyslumennNotifyErrorEmail } from './emailGenerators/syslumennNotifyError'

@Injectable()
export class CriminalRecordSubmissionService extends BaseTemplateApiService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly criminalRecordService: CriminalRecordService,
    private readonly syslumennService: SyslumennService,
  ) {
    super(ApplicationTypes.CRIMINAL_RECORD)
  }

  async submitApplication({ application, auth }: TemplateApiModuleActionProps) {
    const { paymentUrl } = application.externalData.createCharge.data as {
      paymentUrl: string
    }
    if (!paymentUrl) {
      return {
        success: false,
      }
    }

    console.log('============================================')
    console.log(
      'criminalRecord submitApplication',
      JSON.stringify(application, null, 2),
    )
    console.log('============================================')

    const isPayment: { fulfilled: boolean } | undefined =
      await this.sharedTemplateAPIService.getPaymentStatus(auth, application.id)

    if (!isPayment?.fulfilled) {
      throw new Error(
        'Ekki er búið að staðfesta greiðslu, hinkraðu þar til greiðslan er staðfest.',
      )
    }

    console.log('============================================')
    console.log(
      'criminalRecord submitApplication isPayment',
      JSON.stringify(isPayment, null, 2),
    )
    console.log('============================================')

    const userProfileData = application.externalData.userProfile
      ?.data as UserProfile

    const person = {
      ssn: application.applicant,
      phoneNumber: userProfileData?.mobilePhoneNumber,
      email: userProfileData?.email,
      signed: false,
      type: PersonType.CriminalRecordApplicant,
    }
    const persons = [person]

    const uploadDataName = 'Umsókn um sakavottorð frá Ísland.is'
    const uploadDataId = 'Sakavottord2.1'

    const result = await this.syslumennService
      .uploadData(persons, undefined, {}, uploadDataName, uploadDataId)
      .catch(async () => {
        await this.sharedTemplateAPIService.sendEmail(
          generateSyslumennNotifyErrorEmail,
          application as unknown as Application,
        )
        return undefined
      })

    console.log('============================================')
    console.log(
      'criminalRecord submitApplication result',
      JSON.stringify(result, null, 2),
    )
    console.log('============================================')
    return result
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
    return await this.syslumennService.checkCriminalRecord(auth.nationalId)
  }
}
