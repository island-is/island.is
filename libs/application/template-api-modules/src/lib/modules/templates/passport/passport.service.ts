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
  ageCanHaveDiscount,
  getChargeCode,
  isChild,
  isElder,
  PassportSchema,
} from '@island.is/application/templates/passport'
import { PassportsService } from '@island.is/clients/passports'
import { BaseTemplateApiService } from '../../base-template-api.service'
import {
  ApplicationTypes,
  InstitutionNationalIds,
} from '@island.is/application/types'
import { TemplateApiError } from '@island.is/nest/problem'
import { User } from '@island.is/auth-nest-tools'

interface HasDisabilityLicenseData {
  hasDisabilityLicense: boolean
}

const HAS_DISABILITY_LICENSE_QUERY = `
  query hasDisabilityLicense {
    hasDisabilityLicense
  }
`

@Injectable()
export class PassportService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private passportApi: PassportsService,
  ) {
    super(ApplicationTypes.PASSPORT)
  }

  async checkHasDisabilityLicense({ auth }: { auth: User }) {
    try {
      const response = await this.sharedTemplateAPIService
        .makeGraphqlQuery<HasDisabilityLicenseData>(
          auth.authorization,
          HAS_DISABILITY_LICENSE_QUERY,
        )
        .then((response) => response.json())

      if ('errors' in response) {
        this.logger.error(
          'GraphQL error when checking disability license status',
          {
            errors: response.errors,
          },
        )
        throw new Error('Failed to check disability license status')
      }

      return response.data?.hasDisabilityLicense || false
    } catch (error) {
      this.logger.error('Failed to check disability license status', error)
      throw new Error('Failed to check disability license status')
    }
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

  async verifyCode({
    application: { answers, externalData },
    auth,
  }: TemplateApiModuleActionProps) {
    const chargeItemCode = getValueViaPath<string>(answers, 'chargeItemCode')

    if (!chargeItemCode) {
      this.logger.error('chargeItemCode missing in request')

      throw new Error('chargeItemCode missing in request')
    }

    const hasDisabilityLicense = await this.checkHasDisabilityLicense({ auth })
    const child = isChild(answers)
    const elder = isElder(externalData)

    const expectedChargeItemCode = getChargeCode(answers, externalData, {
      withDiscount: hasDisabilityLicense || child || elder,
    })

    if (expectedChargeItemCode !== chargeItemCode) {
      this.logger.error(
        `Client chargeItemCode "${chargeItemCode}" does not match expected chargeItemCode "${expectedChargeItemCode}"`,
      )

      throw new Error(
        `Client chargeItemCode "${chargeItemCode}" does not match expected chargeItemCode "${expectedChargeItemCode}"`,
      )
    }

    this.logger.info(
      'verifyCode completed successfully - should transition to PAYMENT state',
    )

    return true
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

      if (ageCanHaveDiscount(age)) {
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
      auth,
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
      let result
      const PASSPORT_TYPE = 'P'
      const PASSPORT_SUBTYPE = 'A'
      if (forUser) {
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
