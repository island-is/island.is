import { Inject, Injectable } from '@nestjs/common'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'
import { coreErrorMessages, getValueViaPath } from '@island.is/application/core'
import { DistrictCommissionerAgencies } from './constants'
import {
  ChargeFjsV2ClientService,
  getPaymentIdFromExternalData,
} from '@island.is/clients/charge-fjs-v2'
import { generateAssignParentBApplicationEmail } from './emailGenerators/assignParentBEmail'
import {
  IdentityDocumentChild,
  PassportsService,
} from '@island.is/clients/passports'
import { BaseTemplateApiService } from '../../base-template-api.service'
import {
  ApplicationTypes,
  PassportsParameters,
} from '@island.is/application/types'
import { TemplateApiError } from '@island.is/nest/problem'
import {
  IdCardAnswers,
  Services,
  isAvailableForApplication,
} from '@island.is/application/templates/id-card'
import { generateApplicationRejectEmail } from './emailGenerators/rejectApplicationEmail'
import { generateApplicationSubmittedEmail } from './emailGenerators/applicationSubmittedEmail'
import { info } from 'kennitala'
@Injectable()
export class IdCardService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly chargeFjsV2ClientService: ChargeFjsV2ClientService,
    private passportApi: PassportsService,
  ) {
    super(ApplicationTypes.ID_CARD)
  }

  async getIdentityDocument({
    auth,
    params,
  }: TemplateApiModuleActionProps<PassportsParameters>) {
    const identityDocument = await this.passportApi.getCurrentPassport(
      auth,
      params?.type,
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

    // if applicant has valid id that is not withinExpirationDate, then not available for application,
    // otherwise available, either with no id or id within expiration limit
    // applicant can have a valid ID and apply for II
    const applicantAge = info(auth.nationalId).age
    const applicantInformation = {
      age: applicantAge,
      nationalId: auth.nationalId,
      passport: identityDocument.userPassport,
      children: identityDocument.childPassports,
    }
    const applicantIDWithinLimits = isAvailableForApplication(
      'ID',
      applicantInformation,
    )
    const applicantIIWithinLimits = isAvailableForApplication(
      'II',
      applicantInformation,
    )

    let childIdentityWithinLimits = false
    identityDocument.childPassports?.map((child) => {
      if (child.passports && child.passports.length > 0) {
        child.passports.map((id) => {
          if (child.childNationalId) {
            const childInformation = {
              age: info(child.childNationalId).age,
              nationalId: child.childNationalId,
              passport: child.passports?.[0],
            }
            const withinLimits = isAvailableForApplication(
              'ID',
              childInformation,
            )

            if (withinLimits) {
              // if there is any id for any child that is within limits then user should be let through dataProvider
              childIdentityWithinLimits = true
            }
          }
        })
      } else {
        childIdentityWithinLimits = true // if child has no id, then let through for application of new id
      }
    })

    if (
      !applicantIDWithinLimits &&
      !applicantIIWithinLimits &&
      !childIdentityWithinLimits
    ) {
      throw new TemplateApiError(
        {
          title: coreErrorMessages.idCardApplicationRequirementsNotMet,
          summary: coreErrorMessages.idCardApplicationRequirementsNotMet,
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

  async assignParentB({ application }: TemplateApiModuleActionProps) {
    // 1. Validate payment

    // 1a. Make sure a paymentUrl was created
    const { paymentUrl } = application.externalData.createCharge.data as {
      paymentUrl: string
    }
    if (!paymentUrl) {
      throw new Error(
        'Ekki er búið að staðfesta greiðslu, hinkraðu þar til greiðslan er staðfest.',
      )
    }

    // 1b. Make sure payment is fulfilled (has been paid)
    const payment: { fulfilled: boolean } | undefined =
      await this.sharedTemplateAPIService.getPaymentStatus(application.id)
    if (!payment?.fulfilled) {
      throw new Error(
        'Ekki er búið að staðfesta greiðslu, hinkraðu þar til greiðslan er staðfest.',
      )
    }

    // 2. Notify parent B that they need to review
    await this.sharedTemplateAPIService
      .sendEmail(generateAssignParentBApplicationEmail, application)
      .catch((e) => {
        this.logger.error(
          `Error sending email about initReview for parentB, applicationID: ${application.id}`,
          e,
        )
      })
  }

  async rejectApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<void> {
    // 1. Delete charge so that the seller gets reimburshed
    const chargeId = getPaymentIdFromExternalData(application)
    if (chargeId) {
      await this.chargeFjsV2ClientService.deleteCharge(chargeId)
    }
    // 2. Notify everyone in the process that the application has been withdrawn
    const answers = application.answers as IdCardAnswers
    const parentA = {
      ssn: answers.firstGuardianInformation?.nationalId || '',
      name: answers.firstGuardianInformation?.name || '',
      email: answers.firstGuardianInformation?.email,
      phone: answers.firstGuardianInformation?.phoneNumber,
    }
    const parentB = answers.secondGuardianInformation?.nationalId
      ? {
          ssn: answers.secondGuardianInformation?.nationalId || '',
          name: answers.secondGuardianInformation?.name || '',
          email: answers.secondGuardianInformation?.email,
          phone: answers.secondGuardianInformation?.phoneNumber,
        }
      : undefined
    // Email to parent A
    await this.sharedTemplateAPIService
      .sendEmail(
        (props) => generateApplicationRejectEmail(props, parentA),
        application,
      )
      .catch((e) => {
        this.logger.error(
          `Error sending email about rejection for parentA, applicationID: ${application.id}`,
          e,
        )
      })
    if (parentB) {
      // Email to parent B
      await this.sharedTemplateAPIService
        .sendEmail(
          (props) => generateApplicationRejectEmail(props, parentB),
          application,
        )
        .catch((e) => {
          this.logger.error(
            `Error sending email about rejection for parentB, applicationID: ${application.id}`,
            e,
          )
        })
    }
  }

  async submitApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<void> {
    // 1. Validate payment

    // 1a. Make sure a paymentUrl was created
    const { paymentUrl } = application.externalData.createCharge.data as {
      paymentUrl: string
    }
    if (!paymentUrl) {
      throw new Error(
        'Ekki er búið að staðfesta greiðslu, hinkraðu þar til greiðslan er staðfest.',
      )
    }

    // 1b. Make sure payment is fulfilled (has been paid)
    const payment: { fulfilled: boolean } | undefined =
      await this.sharedTemplateAPIService.getPaymentStatus(application.id)
    if (!payment?.fulfilled) {
      throw new Error(
        'Ekki er búið að staðfesta greiðslu, hinkraðu þar til greiðslan er staðfest.',
      )
    }

    // 2. Submit the application
    const answers = application.answers as IdCardAnswers

    const combinedType = {
      type: 'I',
      subType: answers.typeOfId === 'II' ? 'I' : 'D',
    }

    const userIsApplicant =
      answers.applicantInformation.nationalId === auth.nationalId
    const applicantInformation = answers.applicantInformation
    const firstGuardianInformation = answers.firstGuardianInformation
    const secondGuardianInformation = answers.secondGuardianInformation
    const applicantChild = (
      getValueViaPath(
        application.externalData,
        'identityDocument.data.childPassports',
        [],
      ) as Array<IdentityDocumentChild>
    )?.find((child) => {
      return child.childNationalId === applicantInformation.nationalId
    })

    if (userIsApplicant) {
      await this.passportApi.preregisterIdentityDocument(auth, {
        guid: application.id,
        appliedForPersonId: auth.nationalId,
        priority: answers.priceList.priceChoice === Services.EXPRESS ? 1 : 0,
        contactInfo: {
          phoneAtHome: applicantInformation.phoneNumber,
          phoneAtWork: applicantInformation.phoneNumber,
          phoneMobile: applicantInformation.phoneNumber,
          email: applicantInformation.email,
        },
        type: combinedType.type,
        subType: combinedType.subType,
      })
    } else {
      const approvalB = {
        personId: secondGuardianInformation?.nationalId?.replace('-', '') || '',
        name: secondGuardianInformation?.name || '',
        approved: new Date(),
      }
      await this.passportApi.preregisterChildIdentityDocument(auth, {
        guid: application.id,
        appliedForPersonId: applicantInformation.nationalId,
        priority: answers.priceList.priceChoice === Services.EXPRESS ? 1 : 0,
        approvalA: {
          personId:
            firstGuardianInformation?.nationalId?.replace('-', '') || '',
          name: firstGuardianInformation?.name || '',
          approved: application.created,
        },
        approvalB: applicantChild?.secondParent ? approvalB : undefined, // TODO make this better
        contactInfo: {
          phoneAtHome: firstGuardianInformation?.phoneNumber || '',
          phoneAtWork: firstGuardianInformation?.phoneNumber || '',
          phoneMobile: firstGuardianInformation?.phoneNumber || '',
          email: firstGuardianInformation?.email || '',
        },
        type: combinedType.type,
        subType: combinedType.subType,
      })
    }

    // 3. Notify everyone in the process that the application has successfully been submitted
    const parentA = {
      ssn: firstGuardianInformation?.nationalId || '',
      name: firstGuardianInformation?.name || '',
      email: firstGuardianInformation?.email,
      phone: firstGuardianInformation?.phoneNumber,
    }
    const parentB = applicantChild?.secondParent
      ? {
          ssn: secondGuardianInformation?.nationalId || '',
          name: secondGuardianInformation?.name || '',
          email: secondGuardianInformation?.email,
          phone: secondGuardianInformation?.phoneNumber,
        }
      : undefined
    // Email to parent A
    if (parentA?.email) {
      await this.sharedTemplateAPIService
        .sendEmail(
          (props) => generateApplicationSubmittedEmail(props, parentA),
          application,
        )
        .catch((e) => {
          this.logger.error(
            `Error sending email about submission for parentA, applicationID: ${application.id}`,
            e,
          )
        })
    }
    if (parentB?.email) {
      // Email to parent B
      await this.sharedTemplateAPIService
        .sendEmail(
          (props) => generateApplicationSubmittedEmail(props, parentB),
          application,
        )
        .catch((e) => {
          this.logger.error(
            `Error sending email about submission for parentB, applicationID: ${application.id}`,
            e,
          )
        })
    }
  }
}
