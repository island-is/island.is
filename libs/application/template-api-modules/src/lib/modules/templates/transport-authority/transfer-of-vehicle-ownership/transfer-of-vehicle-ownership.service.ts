import { Inject, Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../../shared'
import { TemplateApiModuleActionProps } from '../../../../types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { ApplicationTypes } from '@island.is/application/types'
import { TransferOfVehicleOwnershipAnswers } from '@island.is/application/templates/transport-authority/transfer-of-vehicle-ownership'
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
import { EmailRecipient, EmailRole, RejectType } from './types'
import {
  getAllRoles,
  getRecipients,
  getRecipientBySsn,
} from './transfer-of-vehicle-ownership.utils'
import { mapVehicle } from '../utils'
import {
  ChargeFjsV2ClientService,
  getPaymentIdFromExternalData,
} from '@island.is/clients/charge-fjs-v2'
import { VehicleOwnerChangeClient } from '@island.is/clients/transport-authority/vehicle-owner-change'
import { VehicleCodetablesClient } from '@island.is/clients/transport-authority/vehicle-codetables'
import { VehicleServiceFjsV1Client } from '@island.is/clients/vehicle-service-fjs-v1'
import { VehicleSearchApi } from '@island.is/clients/vehicles'
import { MileageReadingApi } from '@island.is/clients/vehicles-mileage'
import { TemplateApiError } from '@island.is/nest/problem'
import { applicationCheck } from '@island.is/application/templates/transport-authority/transfer-of-vehicle-ownership'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { Auth, AuthMiddleware } from '@island.is/auth-nest-tools'
import { coreErrorMessages } from '@island.is/application/core'

@Injectable()
export class TransferOfVehicleOwnershipService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly chargeFjsV2ClientService: ChargeFjsV2ClientService,
    private readonly vehicleOwnerChangeClient: VehicleOwnerChangeClient,
    private readonly vehicleCodetablesClient: VehicleCodetablesClient,
    private readonly vehicleServiceFjsV1Client: VehicleServiceFjsV1Client,
    private readonly vehiclesApi: VehicleSearchApi,
    private readonly mileageReadingApi: MileageReadingApi,
  ) {
    super(ApplicationTypes.TRANSFER_OF_VEHICLE_OWNERSHIP)
  }

  private vehiclesApiWithAuth(auth: Auth) {
    return this.vehiclesApi.withMiddleware(new AuthMiddleware(auth))
  }

  async getInsuranceCompanyList() {
    return await this.vehicleCodetablesClient.getInsuranceCompanies()
  }

  async getCurrentVehiclesWithOwnerchangeChecks({
    auth,
  }: TemplateApiModuleActionProps) {
    // Get max 20 vehicles and total count of vehicles
    // Note: Should be enough to only get 20, because if totalRecords
    // is higher than 20, then we won't return any vehicles
    console.log('----------- HERE ------------')
    const result = await this.vehiclesApiWithAuth(
      auth,
    ).currentvehicleswithmileageandinspGet({
      showOwned: true,
      showCoowned: false,
      showOperated: false,
      page: 1,
      pageSize: 20,
    })
    const totalRecords = result.totalRecords || 0

    console.log('result', result)

    // Validate that user has at least 1 vehicle
    if (!totalRecords) {
      throw new TemplateApiError(
        {
          title: coreErrorMessages.vehiclesEmptyListOwner,
          summary: coreErrorMessages.vehiclesEmptyListOwner,
        },
        400,
      )
    }

    // Case: count > 20
    // Display search box, validate vehicle when permno is entered
    if (totalRecords > 20) {
      return {
        totalRecords: totalRecords,
        vehicles: [],
      }
    }

    const resultData = result.data || []

    const vehicles = await Promise.all(
      resultData.map(async (vehicle) => {
        // Case: 20 >= count > 5
        // Display dropdown, validate vehicle when selected in dropdown
        if (totalRecords > 5) {
          return mapVehicle(auth, vehicle, false, {
            vehicleOwnerChangeClient: this.vehicleOwnerChangeClient,
            vehicleServiceFjsV1Client: this.vehicleServiceFjsV1Client,
            mileageReadingApi: this.mileageReadingApi,
          })
        }

        // Case: count <= 5
        // Display radio buttons, validate all vehicles now
        return mapVehicle(auth, vehicle, true, {
          vehicleOwnerChangeClient: this.vehicleOwnerChangeClient,
          vehicleServiceFjsV1Client: this.vehicleServiceFjsV1Client,
          mileageReadingApi: this.mileageReadingApi,
        })
      }),
    )

    return {
      totalRecords: totalRecords,
      vehicles: vehicles,
    }
  }

  async validateApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps) {
    const answers = application.answers as TransferOfVehicleOwnershipAnswers

    const sellerSsn = answers?.seller?.nationalId
    const sellerEmail = answers?.seller?.email
    const buyerSsn = answers?.buyer?.nationalId
    const buyerEmail = answers?.buyer?.email

    const createdStr = application.created.toISOString()

    // No need to continue with this validation in user is neither seller nor buyer
    // (only time application data changes is on state change from these roles)
    if (auth.nationalId !== sellerSsn && auth.nationalId !== buyerSsn) {
      return
    }

    const filteredBuyerCoOwnerAndOperator =
      answers?.buyerCoOwnerAndOperator?.filter(
        ({ wasRemoved }) => wasRemoved !== 'true',
      )
    const buyerCoOwners = filteredBuyerCoOwnerAndOperator?.filter(
      (x) => x.type === 'coOwner',
    )
    const buyerOperators = filteredBuyerCoOwnerAndOperator?.filter(
      (x) => x.type === 'operator',
    )

    const mileage = answers?.vehicleMileage?.value

    const result =
      await this.vehicleOwnerChangeClient.validateAllForOwnerChange(auth, {
        permno: answers?.pickVehicle?.plate,
        seller: {
          ssn: sellerSsn,
          email: sellerEmail,
        },
        buyer: {
          ssn: buyerSsn,
          email: buyerEmail,
        },
        dateOfPurchase: new Date(answers?.vehicle?.date),
        dateOfPurchaseTimestamp: createdStr.substring(11, createdStr.length),
        saleAmount: Number(answers?.vehicle?.salePrice || '0') || 0,
        mileage: mileage ? Number(mileage) || 0 : null,
        insuranceCompanyCode: answers?.insurance?.value,
        coOwners: buyerCoOwners?.map((coOwner) => ({
          ssn: coOwner.nationalId || '',
          email: coOwner.email || '',
        })),
        operators: buyerOperators?.map((operator) => ({
          ssn: operator.nationalId || '',
          email: operator.email || '',
          isMainOperator:
            buyerOperators.length > 1
              ? operator.nationalId === answers?.buyerMainOperator?.nationalId
              : true,
        })),
      })

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

  // Notify everyone that has been added to the application that they need to review
  async initReview({
    application,
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
    const payment: { fulfilled: boolean } | undefined =
      await this.sharedTemplateAPIService.getPaymentStatus(application.id)
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
        await this.sharedTemplateAPIService
          .sendEmail(
            (props) => generateRequestReviewEmail(props, recipientList[i]),
            application,
          )
          .catch((e) => {
            this.logger.error(
              `Error sending email about initReview in application: ID: ${application.id}, 
            role: ${recipientList[i].role}`,
              e,
            )
          })
      }

      if (recipientList[i].phone) {
        await this.sharedTemplateAPIService
          .sendSms(
            (_, options) =>
              generateRequestReviewSms(application, options, recipientList[i]),
            application,
          )
          .catch((e) => {
            this.logger.error(
              `Error sending sms about initReview to 
              a phonenumber in application: ID: ${application.id}, 
              role: ${recipientList[i].role}`,
              e,
            )
          })
      }
    }

    return recipientList
  }

  // Notify everyone (buyerCoOwners and buyerOperators) that has been added (or email/phone changed)
  // to the application (by the buyer) that needs to review
  async addReview({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<Array<EmailRecipient>> {
    const answers = application.answers as TransferOfVehicleOwnershipAnswers

    // 1. Make sure review comes from buyer, he is the only one that can add more reviewers
    // Note: This should only be called once from the same nationalId, even though user has more than 1 role
    if (
      !answers.buyer.nationalId ||
      auth.nationalId !== answers.buyer.nationalId
    ) {
      return []
    }

    // 2. Notify users that were added that need to review

    // 2a. Get list of buyerCoOwners and buyerOperators that were added (or email/phone changed)

    const oldRecipientList = (application.externalData.initReview?.data ||
      []) as Array<EmailRecipient>

    const newlyAddedRecipientList: Array<EmailRecipient> = []

    const filteredBuyerCoOwnerAndOperator =
      answers?.buyerCoOwnerAndOperator?.filter(
        ({ wasRemoved }) => wasRemoved !== 'true',
      )

    // Buyer's co-owners
    const buyerCoOwners = filteredBuyerCoOwnerAndOperator?.filter(
      (x) => x.type === 'coOwner',
    )
    if (buyerCoOwners) {
      for (let i = 0; i < buyerCoOwners.length; i++) {
        const oldEntry = oldRecipientList.find(
          (x) =>
            x.role === EmailRole.buyerCoOwner &&
            x.ssn === buyerCoOwners[i].nationalId,
        )
        const emailChanged = oldEntry
          ? oldEntry.email !== buyerCoOwners[i].email
          : true
        const phoneChanged = oldEntry
          ? oldEntry.phone !== buyerCoOwners[i].phone
          : true
        if (!oldEntry || emailChanged || phoneChanged) {
          newlyAddedRecipientList.push({
            ssn: buyerCoOwners[i].nationalId || '',
            name: buyerCoOwners[i].name || '',
            email: emailChanged ? buyerCoOwners[i].email : undefined,
            phone: phoneChanged ? buyerCoOwners[i].phone : undefined,
            role: EmailRole.buyerCoOwner,
          })
        }
      }
    }

    // Buyer's operators
    const buyerOperators = filteredBuyerCoOwnerAndOperator?.filter(
      (x) => x.type === 'operator',
    )
    if (buyerOperators) {
      for (let i = 0; i < buyerOperators.length; i++) {
        const oldEntry = oldRecipientList.find(
          (x) =>
            x.role === EmailRole.buyerOperator &&
            x.ssn === buyerOperators[i].nationalId,
        )
        const emailChanged = oldEntry
          ? oldEntry.email !== buyerOperators[i].email
          : true
        const phoneChanged = oldEntry
          ? oldEntry.phone !== buyerOperators[i].phone
          : true
        if (!oldEntry || emailChanged || phoneChanged) {
          newlyAddedRecipientList.push({
            ssn: buyerOperators[i].nationalId || '',
            name: buyerOperators[i].name || '',
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
        await this.sharedTemplateAPIService
          .sendEmail(
            (props) =>
              generateRequestReviewEmail(props, newlyAddedRecipientList[i]),
            application,
          )
          .catch((e) => {
            this.logger.error(
              `Error sending email about addReview in application: ID: ${application.id}, 
            role: ${newlyAddedRecipientList[i].role}`,
              e,
            )
          })
      }
      if (newlyAddedRecipientList[i].phone) {
        await this.sharedTemplateAPIService
          .sendSms(
            (_, options) =>
              generateRequestReviewSms(
                application,
                options,
                newlyAddedRecipientList[i],
              ),
            application,
          )
          .catch((e) => {
            this.logger.error(
              `Error sending sms about addReview to 
              a phonenumber in application: ID: ${application.id}, 
              role: ${newlyAddedRecipientList[i].role}`,
              e,
            )
          })
      }
    }

    return newlyAddedRecipientList
  }

  async rejectApplication(props: TemplateApiModuleActionProps): Promise<void> {
    return this.doRejectApplication(props, RejectType.REJECT)
  }

  async deleteApplication(props: TemplateApiModuleActionProps): Promise<void> {
    return this.doRejectApplication(props, RejectType.DELETE)
  }

  private async doRejectApplication(
    { application, auth }: TemplateApiModuleActionProps,
    rejectType: RejectType,
  ): Promise<void> {
    // 1. Delete charge so that the seller gets reimburshed
    // Note: not necessary on delete, since that is done in the shared delete function
    if (rejectType !== RejectType.DELETE) {
      const chargeId = getPaymentIdFromExternalData(application)
      if (chargeId) {
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
        await this.sharedTemplateAPIService
          .sendEmail(
            (props) =>
              generateApplicationRejectedEmail(
                props,
                recipientList[i],
                rejectedByRecipient,
                rejectType,
              ),
            application,
          )
          .catch((e) => {
            this.logger.error(
              `Error sending email about rejectApplication in application: ID: ${application.id}, 
            role: ${recipientList[i].role} (${rejectType})`,
              e,
            )
          })
      }

      if (recipientList[i].phone) {
        await this.sharedTemplateAPIService
          .sendSms(
            () =>
              generateApplicationRejectedSms(
                application,
                recipientList[i],
                rejectedByRecipient,
                rejectType,
              ),
            application,
          )
          .catch((e) => {
            this.logger.error(
              `Error sending sms about rejectApplication to 
              a phonenumber in application: ID: ${application.id}, 
              role: ${recipientList[i].role} (${rejectType})`,
              e,
            )
          })
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
    const payment: { fulfilled: boolean } | undefined =
      await this.sharedTemplateAPIService.getPaymentStatus(application.id)
    if (!payment?.fulfilled) {
      throw new Error(
        'Ekki er búið að staðfesta greiðslu, hinkraðu þar til greiðslan er staðfest.',
      )
    }

    // 2. Submit the application

    const answers = application.answers as TransferOfVehicleOwnershipAnswers
    const createdStr = application.created.toISOString()

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
    const filteredBuyerCoOwnerAndOperator =
      answers?.buyerCoOwnerAndOperator?.filter(
        ({ wasRemoved }) => wasRemoved !== 'true',
      )
    const buyerCoOwners = filteredBuyerCoOwnerAndOperator?.filter(
      (x) => x.type === 'coOwner',
    )
    const buyerOperators = filteredBuyerCoOwnerAndOperator?.filter(
      (x) => x.type === 'operator',
    )

    const mileage = answers?.vehicleMileage?.value

    const submitResult = await this.vehicleOwnerChangeClient.saveOwnerChange(
      auth,
      {
        permno: answers?.pickVehicle?.plate,
        seller: {
          ssn: answers?.seller?.nationalId,
          email: answers?.seller?.email,
        },
        buyer: {
          ssn: answers?.buyer?.nationalId,
          email: answers?.buyer?.email,
        },
        dateOfPurchase: new Date(answers?.vehicle?.date),
        dateOfPurchaseTimestamp: createdStr.substring(11, createdStr.length),
        saleAmount: Number(answers?.vehicle?.salePrice || '0') || 0,
        mileage: mileage ? Number(mileage) || 0 : null,
        insuranceCompanyCode: answers?.insurance?.value,
        coOwners: buyerCoOwners?.map((coOwner) => ({
          ssn: coOwner.nationalId || '',
          email: coOwner.email || '',
        })),
        operators: buyerOperators?.map((operator) => ({
          ssn: operator.nationalId || '',
          email: operator.email || '',
          isMainOperator:
            buyerOperators.length > 1
              ? operator.nationalId === answers.buyerMainOperator?.nationalId
              : true,
        })),
      },
    )

    if (
      submitResult.hasError &&
      submitResult.errorMessages &&
      submitResult.errorMessages.length > 0
    ) {
      throw new TemplateApiError(
        {
          title: applicationCheck.validation.alertTitle,
          summary: submitResult.errorMessages,
        },
        400,
      )
    }

    // 3. Notify everyone in the process that the application has successfully been submitted

    // 3a. Get list of users that need to be notified
    const recipientList = getRecipients(answers, getAllRoles())

    // 3b. Send email/sms individually to each recipient about success of submitting application
    for (let i = 0; i < recipientList.length; i++) {
      if (recipientList[i].email) {
        await this.sharedTemplateAPIService
          .sendEmail(
            (props) =>
              generateApplicationSubmittedEmail(props, recipientList[i]),
            application,
          )
          .catch((e) => {
            this.logger.error(
              `Error sending email about submitApplication in application: ID: ${application.id}, 
            role: ${recipientList[i].role}`,
              e,
            )
          })
      }

      if (recipientList[i].phone) {
        await this.sharedTemplateAPIService
          .sendSms(
            () =>
              generateApplicationSubmittedSms(application, recipientList[i]),
            application,
          )
          .catch((e) => {
            this.logger.error(
              `Error sending sms about submitApplication to 
              a phonenumber in application: ID: ${application.id}, 
              role: ${recipientList[i].role}`,
              e,
            )
          })
      }
    }
  }
}
