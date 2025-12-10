import { Inject, Injectable } from '@nestjs/common'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'
import {
  coreErrorMessages,
  getValueViaPath,
  YES,
  YesOrNo,
} from '@island.is/application/core'
import { DiscountCheck, DistrictCommissionerAgencies } from './constants'
import { info } from 'kennitala'
import { generateAssignParentBApplicationEmail } from './emailGenerators/assignParentBEmail'
import {
  PassportSchema,
  m as messages,
} from '@island.is/application/templates/passport'
import { PassportsService } from '@island.is/clients/passports'
import { BaseTemplateApiService } from '../../base-template-api.service'
import {
  ApplicationTypes,
  InstitutionNationalIds,
} from '@island.is/application/types'
import { TemplateApiError } from '@island.is/nest/problem'

@Injectable()
export class PassportService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private passportApi: PassportsService,
  ) {
    super(ApplicationTypes.PASSPORT)
  }

  async identityDocument({ auth, application }: TemplateApiModuleActionProps) {
    const identityDocument = await this.passportApi.getCurrentPassport(auth)
    this.logger.warn(
      'No passport found for user for application: ',
      application.id,
    )
    if (!identityDocument) {
      throw new TemplateApiError(
        {
          title: coreErrorMessages.failedDataProvider,
          summary: coreErrorMessages.errorDataProvider,
        },
        400,
      )
    }
    return identityDocument
  }

  async deliveryAddress({ auth, application }: TemplateApiModuleActionProps) {
    const res = await this.passportApi.getDeliveryAddress(auth)
    if (!res) {
      this.logger.warn(
        'No delivery address for passport found for user for application: ',
        application.id,
      )
      throw new TemplateApiError(
        {
          title: coreErrorMessages.failedDataProvider,
          summary: coreErrorMessages.errorDataProvider,
        },
        400,
      )
    }

    // We want to make sure that Þjóðskrá locations are the first to appear, their key starts with a number
    const deliveryAddresses = (res as DistrictCommissionerAgencies[]).sort(
      (a, b) => {
        const keyA = a.key.toUpperCase() // ignore upper and lowercase
        const keyB = b.key.toUpperCase() // ignore upper and lowercase
        if (keyA < keyB) {
          return -1
        }
        if (keyA > keyB) {
          return 1
        }

        // keys must be equal
        return 0
      },
    )

    return deliveryAddresses
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
      auth,
      id,
      InstitutionNationalIds.SYSLUMENN,
      [{ code: chargeItemCode }],
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
    const applicationId = {
      guid: application.id,
    }
    this.logger.info('submitPassportApplication', applicationId)
    const isPayment = await this.sharedTemplateAPIService.getPaymentStatus(
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

      const fetchedPassport = await this.passportApi.getCurrentPassport(auth)

      const forUser = !!passport.userPassport
      let result
      const PASSPORT_TYPE = 'P'
      const PASSPORT_SUBTYPE = 'A'

      if (forUser) {
        if (
          fetchedPassport?.userPassport &&
          !fetchedPassport?.userPassport?.expiresWithinNoticeTime
        ) {
          throw new TemplateApiError(
            {
              title: messages.errorExpirationValidationTitle,
              summary: messages.errorExpirationValidationSummary,
            },
            400,
          )
        }
        result = await this.passportApi.preregisterIdentityDocument(auth, {
          guid: application.id,
          appliedForPersonId: auth.nationalId,
          priority: service.type === 'regular' ? 0 : 1,
          deliveryName: undefined, // intentionally undefined deprecated
          contactInfo: {
            phoneAtHome: personalInfo.phoneNumber,
            phoneAtWork: personalInfo.phoneNumber,
            phoneMobile: personalInfo.phoneNumber,
            email: personalInfo.email,
          },
          type: PASSPORT_TYPE,
          subType: PASSPORT_SUBTYPE,
        })
      } else {
        const childPassport = fetchedPassport?.childPassports?.find(
          (child) => child.childNationalId === childsPersonalInfo.nationalId,
        )
        const expiresWithinNoticeTime = childPassport?.passports?.some(
          (passport) => passport.expiresWithinNoticeTime,
        )

        if (childPassport?.passports?.length && !expiresWithinNoticeTime) {
          throw new TemplateApiError(
            {
              title: messages.errorExpirationValidationTitle,
              summary: messages.errorExpirationValidationSummary,
            },
            400,
          )
        }
        result = await this.passportApi.preregisterChildIdentityDocument(auth, {
          guid: application.id,
          appliedForPersonId: childsPersonalInfo.nationalId,
          priority: service.type === 'regular' ? 0 : 1,
          deliveryName: undefined, // intentionally undefined deprecated
          approvalA: {
            personId: childsPersonalInfo.guardian1.nationalId.replace('-', ''),
            name: childsPersonalInfo.guardian1.name,
            approved: application.created,
          },
          approvalB: childsPersonalInfo.guardian2 && {
            personId: childsPersonalInfo.guardian2.nationalId.replace('-', ''),
            name: childsPersonalInfo.guardian2.name,
            approved: new Date(),
          },
          contactInfo: {
            phoneAtHome: childsPersonalInfo.guardian1.phoneNumber,
            phoneAtWork: childsPersonalInfo.guardian1.phoneNumber,
            phoneMobile: childsPersonalInfo.guardian1.phoneNumber,
            email: childsPersonalInfo.guardian1.email,
          },
          type: PASSPORT_TYPE,
          subType: PASSPORT_SUBTYPE,
        })
      }

      if (!result || !result.success) {
        throw new Error(`Application submission failed (${result})`)
      }

      return result
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
