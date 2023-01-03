import { Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../../shared'
import { TemplateApiModuleActionProps } from '../../../../types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { ApplicationTypes } from '@island.is/application/types'
import {
  getChargeItemCodes,
  TransferOfVehicleOwnershipAnswers,
} from '@island.is/application/templates/transport-authority/transfer-of-vehicle-ownership'
import {
  generateRequestReviewEmail,
  generateApplicationSubmittedEmail,
  generateApplicationRejectedEmail,
} from './emailGenerators'
import {
  generateRequestReviewSms,
  generateApplicationSubmittedSms,
  generateApplicationRejectedSms,
} from './smsGenerators'
import { EmailRecipient, EmailRole } from './types'
import {
  getAllRoles,
  getRecipients,
  getRecipientBySsn,
} from './transfer-of-vehicle-ownership.utils'
import {
  ChargeFjsV2ClientService,
  getChargeId,
} from '@island.is/clients/charge-fjs-v2'
import { VehicleOwnerChangeClient } from '@island.is/clients/transport-authority/vehicle-owner-change'
import { VehicleCodetablesClient } from '@island.is/clients/transport-authority/vehicle-codetables'
import { TemplateApiError } from '@island.is/nest/problem'
import { applicationCheck } from '@island.is/application/templates/transport-authority/transfer-of-vehicle-ownership'

@Injectable()
export class TransferOfVehicleOwnershipService extends BaseTemplateApiService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly chargeFjsV2ClientService: ChargeFjsV2ClientService,
    private readonly vehicleOwnerChangeClient: VehicleOwnerChangeClient,
    private readonly vehicleCodetablesClient: VehicleCodetablesClient,
  ) {
    super(ApplicationTypes.TRANSFER_OF_VEHICLE_OWNERSHIP)
  }

  async getInsuranceCompanyList({ auth }: TemplateApiModuleActionProps) {
    return await this.vehicleCodetablesClient.getInsuranceCompanies()
  }

  async validateApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps) {
    const answers = application.answers as TransferOfVehicleOwnershipAnswers

    // No need to continue with this validation in user is neither seller nor buyer
    // (only time application data changes is on state change from these roles)
    const sellerSsn = answers?.seller?.nationalId
    const buyerSsn = answers?.buyer?.nationalId
    if (auth.nationalId !== sellerSsn && auth.nationalId !== buyerSsn) {
      return
    }

    const buyerCoOwners = answers?.buyerCoOwnerAndOperator?.filter(
      (x) => x.type === 'coOwner',
    )
    const buyerOperators = answers?.buyerCoOwnerAndOperator?.filter(
      (x) => x.type === 'operator',
    )

    const result = await this.vehicleOwnerChangeClient.validateAllForOwnerChange(
      auth,
      {
        permno: answers?.vehicle?.plate,
        seller: {
          ssn: sellerSsn,
          email: answers?.seller?.email,
        },
        buyer: {
          ssn: buyerSsn,
          email: answers?.buyer?.email,
        },
        dateOfPurchase: new Date(answers?.vehicle?.date),
        saleAmount: Number(answers?.vehicle?.salePrice || '0') || 0,
        insuranceCompanyCode: answers?.insurance?.value,
        coOwners: buyerCoOwners?.map((coOwner) => ({
          ssn: coOwner.nationalId,
          email: coOwner.email,
        })),
        operators: buyerOperators?.map((operator) => ({
          ssn: operator.nationalId,
          email: operator.email,
          isMainOperator:
            buyerOperators.length > 1
              ? operator.nationalId === answers?.buyerMainOperator?.nationalId
              : true,
        })),
      },
    )

    // If we get any error messages, we will just throw an error with a default title
    // We will fetch these error messages again through graphql in the template, to be able
    // to translate the error message
    if (result.hasError && result.errorMessages?.length) {
      throw new TemplateApiError(
        {
          title: applicationCheck.validation.alertTitle,
          summary: applicationCheck.validation.alertTitle,
        },
        400,
      )
    }
  }

  async createCharge({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<
    | {
        id: string
        paymentUrl: string
      }
    | undefined
  > {
    try {
      const chargeItemCodes = getChargeItemCodes()

      const result = this.sharedTemplateAPIService.createCharge(
        auth.authorization,
        application.id,
        chargeItemCodes,
      )
      return result
    } catch (exeption) {
      return { id: '', paymentUrl: '' }
    }
  }

  // Notify everyone that has been added to the application that they need to review
  async initReview({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<Array<EmailRecipient>> {
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
    const payment:
      | { fulfilled: boolean }
      | undefined = await this.sharedTemplateAPIService.getPaymentStatus(
      auth.authorization,
      application.id,
    )
    if (!payment?.fulfilled) {
      throw new Error(
        'Ekki er búið að staðfesta greiðslu, hinkraðu þar til greiðslan er staðfest.',
      )
    }

    // 2. Notify users that need to review

    // 2a. Get list of users that need to review
    const answers = application.answers as TransferOfVehicleOwnershipAnswers
    const recipientList = getRecipients(answers, [
      EmailRole.sellerCoOwner,
      EmailRole.buyer,
      EmailRole.buyerCoOwner,
      EmailRole.buyerOperator,
    ])

    // 2b. Send email/sms individually to each recipient
    for (let i = 0; i < recipientList.length; i++) {
      if (recipientList[i].email) {
        await this.sharedTemplateAPIService.sendEmail(
          (props) => generateRequestReviewEmail(props, recipientList[i]),
          application,
        )
      }

      if (recipientList[i].phone) {
        await this.sharedTemplateAPIService.sendSms(
          () => generateRequestReviewSms(application, recipientList[i]),
          application,
        )
      }
    }

    return recipientList
  }

  // Notify everyone (buyerCoOwners and buyerOperators) that has been added (or email/phone changed)
  // to the application (by the buyer) that needs to review
  async addReview({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<void> {
    const answers = application.answers as TransferOfVehicleOwnershipAnswers

    // 1. Make sure review comes from buyer, he is the only one that can add more reviewers
    // Note: This should only be called once from the same nationalId, even though user has more than 1 role
    if (
      !answers.buyer.nationalId ||
      auth.nationalId !== answers.buyer.nationalId
    ) {
      return
    }

    // 2. Notify users that were added that need to review

    // 2a. Get list of buyerCoOwners and buyerOperators that were added (or email/phone changed)

    const oldRecipientList = (application.externalData.initReview?.data ||
      []) as Array<EmailRecipient>

    const newlyAddedRecipientList: Array<EmailRecipient> = []

    // Buyer's co-owners
    const buyerCoOwners = answers.buyerCoOwnerAndOperator?.filter(
      (x) => x.type === 'coOwner',
    )
    if (buyerCoOwners) {
      for (let i = 0; i < buyerCoOwners.length; i++) {
        const oldEntry = oldRecipientList.find((x) => {
          x.role === EmailRole.buyerCoOwner &&
            x.ssn === buyerCoOwners[i].nationalId
        })
        const emailChanged = oldEntry
          ? oldEntry.email !== buyerCoOwners[i].email
          : false
        const phoneChanged = oldEntry
          ? oldEntry.phone !== buyerCoOwners[i].phone
          : false
        if (!oldEntry || emailChanged || phoneChanged) {
          newlyAddedRecipientList.push({
            ssn: buyerCoOwners[i].nationalId,
            name: buyerCoOwners[i].name,
            email: emailChanged ? buyerCoOwners[i].email : undefined,
            phone: phoneChanged ? buyerCoOwners[i].phone : undefined,
            role: EmailRole.buyerCoOwner,
          })
        }
      }
    }

    // Buyer's operators
    const buyerOperators = answers.buyerCoOwnerAndOperator?.filter(
      (x) => x.type === 'operator',
    )
    if (buyerOperators) {
      for (let i = 0; i < buyerOperators.length; i++) {
        const oldEntry = oldRecipientList.find((x) => {
          x.role === EmailRole.buyerOperator &&
            x.ssn === buyerOperators[i].nationalId
        })
        const emailChanged = oldEntry
          ? oldEntry.email !== buyerOperators[i].email
          : false
        const phoneChanged = oldEntry
          ? oldEntry.phone !== buyerOperators[i].phone
          : false
        if (!oldEntry || emailChanged || phoneChanged) {
          newlyAddedRecipientList.push({
            ssn: buyerOperators[i].nationalId,
            name: buyerOperators[i].name,
            email: emailChanged ? buyerOperators[i].email : undefined,
            phone: phoneChanged ? buyerOperators[i].phone : undefined,
            role: EmailRole.buyerOperator,
          })
        }
      }
    }

    // Send email/sms individually to each recipient
    for (let i = 0; i < newlyAddedRecipientList.length; i++) {
      if (newlyAddedRecipientList[i].email) {
        await this.sharedTemplateAPIService.sendEmail(
          (props) =>
            generateRequestReviewEmail(props, newlyAddedRecipientList[i]),
          application,
        )
      }
      if (newlyAddedRecipientList[i].phone) {
        await this.sharedTemplateAPIService.sendSms(
          () =>
            generateRequestReviewSms(application, newlyAddedRecipientList[i]),
          application,
        )
      }
    }
  }

  async rejectApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<void> {
    // 1. Delete charge so that the seller gets reimburshed
    const chargeId = getChargeId(application)
    if (chargeId) {
      const status = await this.chargeFjsV2ClientService.getChargeStatus(
        chargeId,
      )

      // Make sure charge has not been deleted yet (will otherwise end in error here and wont continue)
      if (status !== 'cancelled') {
        await this.chargeFjsV2ClientService.deleteCharge(chargeId)
      }
    }

    // 2. Notify everyone in the process that the application has been withdrawn

    // 2a. Get list of users that need to be notified
    const answers = application.answers as TransferOfVehicleOwnershipAnswers
    const recipientList = getRecipients(answers, getAllRoles())

    // 2b. Send email/sms individually to each recipient about success of withdrawing application
    const rejectedByRecipient = getRecipientBySsn(answers, auth.nationalId)
    for (let i = 0; i < recipientList.length; i++) {
      if (recipientList[i].email) {
        await this.sharedTemplateAPIService.sendEmail(
          (props) =>
            generateApplicationRejectedEmail(
              props,
              recipientList[i],
              rejectedByRecipient,
            ),
          application,
        )
      }

      if (recipientList[i].phone) {
        await this.sharedTemplateAPIService.sendSms(
          () =>
            generateApplicationRejectedSms(
              application,
              recipientList[i],
              rejectedByRecipient,
            ),
          application,
        )
      }
    }
  }

  // After everyone has reviewed (and approved), then submit the application, and notify everyone involved it was a success
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
    const payment:
      | { fulfilled: boolean }
      | undefined = await this.sharedTemplateAPIService.getPaymentStatus(
      auth.authorization,
      application.id,
    )
    if (!payment?.fulfilled) {
      throw new Error(
        'Ekki er búið að staðfesta greiðslu, hinkraðu þar til greiðslan er staðfest.',
      )
    }

    // 2. Submit the application

    const answers = application.answers as TransferOfVehicleOwnershipAnswers
    // Note: Need to be sure that the user that created the application is the seller when submitting application to SGS
    if (answers?.seller?.nationalId !== application.applicant) {
      throw new TemplateApiError(
        {
          title: applicationCheck.submitApplication.sellerNotValid,
          summary: applicationCheck.submitApplication.sellerNotValid,
        },
        400,
      )
    }

    const buyerCoOwners = answers.buyerCoOwnerAndOperator?.filter(
      (x) => x.type === 'coOwner',
    )
    const buyerOperators = answers.buyerCoOwnerAndOperator?.filter(
      (x) => x.type === 'operator',
    )

    await this.vehicleOwnerChangeClient.saveOwnerChange(auth, {
      permno: answers?.vehicle?.plate,
      seller: {
        ssn: answers?.seller?.nationalId,
        email: answers?.seller?.email,
      },
      buyer: {
        ssn: answers?.buyer?.nationalId,
        email: answers?.buyer?.email,
      },
      dateOfPurchase: new Date(answers?.vehicle?.date),
      saleAmount: Number(answers?.vehicle?.salePrice || '0') || 0,
      insuranceCompanyCode: answers?.insurance?.value,
      coOwners: buyerCoOwners?.map((coOwner) => ({
        ssn: coOwner.nationalId,
        email: coOwner.email,
      })),
      operators: buyerOperators?.map((operator) => ({
        ssn: operator.nationalId,
        email: operator.email,
        isMainOperator:
          buyerOperators.length > 1
            ? operator.nationalId === answers.buyerMainOperator?.nationalId
            : true,
      })),
    })

    // 3. Notify everyone in the process that the application has successfully been submitted

    // 3a. Get list of users that need to be notified
    const recipientList = getRecipients(answers, getAllRoles())

    // 3b. Send email/sms individually to each recipient about success of submitting application
    for (let i = 0; i < recipientList.length; i++) {
      if (recipientList[i].email) {
        await this.sharedTemplateAPIService.sendEmail(
          (props) => generateApplicationSubmittedEmail(props, recipientList[i]),
          application,
        )
      }

      if (recipientList[i].phone) {
        await this.sharedTemplateAPIService.sendSms(
          () => generateApplicationSubmittedSms(application, recipientList[i]),
          application,
        )
      }
    }
  }
}
