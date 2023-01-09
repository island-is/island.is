import { Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../../shared'
import { TemplateApiModuleActionProps } from '../../../../types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { ApplicationTypes } from '@island.is/application/types'
import {
  applicationCheck,
  ChangeCoOwnerOfVehicleAnswers,
  getChargeItemCodes,
} from '@island.is/application/templates/transport-authority/change-co-owner-of-vehicle'
import { VehicleOwnerChangeClient } from '@island.is/clients/transport-authority/vehicle-owner-change'
import { VehicleOperatorsClient } from '@island.is/clients/transport-authority/vehicle-operators'
import { EmailRecipient, EmailRole } from './types'
import {
  getAllRoles,
  getRecipients,
  getRecipientBySsn,
} from './change-co-owner-of-vehicle.utils'
import {
  ChargeFjsV2ClientService,
  getChargeId,
} from '@island.is/clients/charge-fjs-v2'
import { TemplateApiError } from '@island.is/nest/problem'
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

@Injectable()
export class ChangeCoOwnerOfVehicleService extends BaseTemplateApiService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly vehicleOwnerChangeClient: VehicleOwnerChangeClient,
    private readonly vehicleOperatorsClient: VehicleOperatorsClient,
    private readonly chargeFjsV2ClientService: ChargeFjsV2ClientService,
  ) {
    super(ApplicationTypes.CHANGE_CO_OWNER_OF_VEHICLE)
  }

  async createCharge({ application, auth }: TemplateApiModuleActionProps) {
    try {
      const chargeItemCodes = getChargeItemCodes(
        application.answers as ChangeCoOwnerOfVehicleAnswers,
      )

      if (chargeItemCodes?.length <= 0) {
        throw new Error('Það var hvorki bætt við né eytt meðeiganda')
      }

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
    const answers = application.answers as ChangeCoOwnerOfVehicleAnswers
    const recipientList = getRecipients(answers, [
      EmailRole.currentCoOwner,
      EmailRole.addedCoOwner,
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
    const answers = application.answers as ChangeCoOwnerOfVehicleAnswers
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
    const isPayment:
      | { fulfilled: boolean }
      | undefined = await this.sharedTemplateAPIService.getPaymentStatus(
      auth.authorization,
      application.id,
    )

    if (!isPayment?.fulfilled) {
      throw new Error(
        'Ekki er búið að staðfesta greiðslu, hinkraðu þar til greiðslan er staðfest.',
      )
    }

    // 2. Submit the application

    const answers = application.answers as ChangeCoOwnerOfVehicleAnswers
    // Note: Need to be sure that the user that created the application is the seller when submitting application to SGS
    if (answers?.owner?.nationalId !== application.applicant) {
      throw new TemplateApiError(
        {
          title: applicationCheck.submitApplication.sellerNotValid,
          summary: applicationCheck.submitApplication.sellerNotValid,
        },
        400,
      )
    }

    const permno = answers?.pickVehicle?.plate
    const ownerSsn = answers?.owner?.nationalId
    const ownerEmail = answers?.owner?.email
    const newCoOwners = answers?.coOwners
      .filter((x) => !x.wasRemoved)
      .map((coOwner) => ({
        ssn: coOwner.nationalId,
        email: coOwner.email,
      }))

    const currentOwnerChange = await this.vehicleOwnerChangeClient.getNewestOwnerChange(
      auth,
      permno,
    )

    const currentOperators = await this.vehicleOperatorsClient.getOperators(
      auth,
      permno,
    )

    await this.vehicleOwnerChangeClient.saveOwnerChange(auth, {
      permno: permno,
      seller: {
        ssn: ownerSsn,
        email: ownerEmail,
      },
      buyer: {
        ssn: ownerSsn,
        email: ownerEmail,
      },
      dateOfPurchase: currentOwnerChange?.dateOfPurchase,
      saleAmount: currentOwnerChange?.saleAmount,
      insuranceCompanyCode: currentOwnerChange?.insuranceCompanyCode,
      operators: currentOperators?.map((operator) => ({
        ssn: operator.ssn || '',
        // Note: It should be ok that the email we send in is empty, since we dont get
        // the email when fetching current operators, and according to them (SGS), they
        // are not using the operator email in their API (not being saved in their DB)
        email: '',
        isMainOperator: operator.isMainOperator || false,
      })),
      coOwners: newCoOwners,
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
