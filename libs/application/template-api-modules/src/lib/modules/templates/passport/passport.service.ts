import { Inject, Injectable } from '@nestjs/common'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'
import { coreErrorMessages, getValueViaPath } from '@island.is/application/core'
import { YES, YesOrNo, DiscountCheck } from './constants'
import { info } from 'kennitala'
import { generateAssignParentBApplicationEmail } from './emailGenerators/assignParentBEmail'
import { PassportSchema } from '@island.is/application/templates/passport'
import { PassportsService } from '@island.is/clients/passports'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { ApplicationTypes } from '@island.is/application/types'
import { TemplateApiError } from '@island.is/nest/problem'

@Injectable()
export class PassportService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private passportApi: PassportsService,
  ) {   super(ApplicationTypes.PASSPORT)}

  async identityDocument({application, auth }: TemplateApiModuleActionProps) {
    const identityDocument = await this.passportApi.getCurrentPassport(auth)
    if(!identityDocument) {
      throw new TemplateApiError(
        {
          title: coreErrorMessages.failedDataProvider,
          summary: coreErrorMessages.errorDataProvider,
        },
        400,
      )
    } else {
      return identityDocument
    }
  }


  async createCharge({
    application: { id, answers },
    auth,
  }: TemplateApiModuleActionProps) {
    const chargeItemCode = getValueViaPath<string>(answers, 'chargeItemCode')
    if (!chargeItemCode) {
      throw new Error('chargeItemCode missing in request')
    }
    const response = await this.sharedTemplateAPIService.createCharge(
      auth.authorization,
      id,
      [chargeItemCode],
    )
    // last chance to validate before the user receives a dummy
    if (!response?.paymentUrl) {
      throw new Error('paymentUrl missing in response')
    }

    return response
  }

  async checkForDiscount({ application, auth }: TemplateApiModuleActionProps) {
    const { answers, externalData } = application

    if (!(externalData.checkForDiscount?.data as DiscountCheck)?.hasDiscount) {
      const { age } = info(auth.nationalId)

      if (age < 18 || age >= 60) {
        return {
          hasDiscount: true,
        }
      }
      const disabilityCheck = getValueViaPath<YesOrNo>(
        answers,
        'personalInfo.hasDisabilityDiscount',
      )

      //TODO: implement check with Tryggingastofnun
      if (disabilityCheck?.includes(YES)) {
        return {
          hasDiscount: true,
        }
      }
    }
  }

  async assignParentB({ application }: TemplateApiModuleActionProps) {
    await this.sharedTemplateAPIService.sendEmail(
      generateAssignParentBApplicationEmail,
      application,
    )
  }

  async submitPassportApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<{
    success: boolean
    orderId?: string[]
  }> {
    const isPayment = await this.sharedTemplateAPIService.getPaymentStatus(
      auth.authorization,
      application.id,
    )

    if (!isPayment?.fulfilled) {
      this.logger.error(
        'Trying to submit Passportapplication that has not been paid.',
      )
      throw new Error(
        'Ekki er hægt að skila inn umsókn af því að ekki hefur tekist að taka við greiðslu.',
      )
    }
    try {
      const {
        passport,
        personalInfo,
        childsPersonalInfo,
        service,
      }: PassportSchema = application.answers as PassportSchema

      const forUser = !!passport.userPassport
      const result = forUser
        ? await this.passportApi.preregisterIdentityDocument(auth, {
            appliedForPersonId: auth.nationalId,
            priority: service.type === 'regular' ? 0 : 1,
            deliveryName: service.dropLocation,
            contactInfo: {
              phoneAtHome: personalInfo.phoneNumber,
              phoneAtWork: personalInfo.phoneNumber,
              phoneMobile: personalInfo.phoneNumber,
              email: personalInfo.email,
            },
          })
        : await this.passportApi.preregisterChildIdentityDocument(auth, {
            appliedForPersonId: childsPersonalInfo.nationalId,
            priority: service.type === 'regular' ? 0 : 1,
            deliveryName: service.dropLocation,
            approvalA: {
              personId: childsPersonalInfo.guardian1.nationalId.replace(
                '-',
                '',
              ),
              approved: application.created,
            },
            approvalB: {
              personId: childsPersonalInfo.guardian2.nationalId.replace(
                '-',
                '',
              ),
              approved: new Date(),
            },
            contactInfo: {
              phoneAtHome: childsPersonalInfo.guardian1.phoneNumber,
              phoneAtWork: childsPersonalInfo.guardian1.phoneNumber,
              phoneMobile: childsPersonalInfo.guardian1.phoneNumber,
              email: childsPersonalInfo.guardian1.email,
            },
          })

      if (result.length < 1) {
        throw new Error(`Application submission failed (${result})`)
      }

      return {
        success: true,
        // orderId: result,
      }
    } catch (e) {
      this.log('error', 'Submitting passport failed', {
        e,
      })

      throw e
    }
  }

  private log(lvl: 'error' | 'info', message: string, meta: unknown) {
    this.logger.log(lvl, `[passport] ${message}`, meta)
  }
}
