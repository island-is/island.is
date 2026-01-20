import { Inject, Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../../shared'
import { TemplateApiModuleActionProps } from '../../../../types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { ApplicationTypes } from '@island.is/application/types'
import { EmailRecipient, EmailRole, RejectType } from './types'
import {
  getAllRoles,
  getRecipients,
  getRecipientBySsn,
} from './change-operator-of-vehicle.utils'
import {
  ChargeFjsV2ClientService,
  getPaymentIdFromExternalData,
} from '@island.is/clients/charge-fjs-v2'
import { ChangeOperatorOfVehicleAnswers } from '@island.is/application/templates/transport-authority/change-operator-of-vehicle'
import { VehicleOperatorsClient } from '@island.is/clients/transport-authority/vehicle-operators'
import { VehicleOwnerChangeClient } from '@island.is/clients/transport-authority/vehicle-owner-change'
import { VehicleServiceFjsV1Client } from '@island.is/clients/vehicle-service-fjs-v1'
import { VehicleSearchApi } from '@island.is/clients/vehicles'
import { MileageReadingApi } from '@island.is/clients/vehicles-mileage'
import { TemplateApiError } from '@island.is/nest/problem'
import { applicationCheck } from '@island.is/application/templates/transport-authority/change-operator-of-vehicle'
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
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { Auth, AuthMiddleware } from '@island.is/auth-nest-tools'
import { coreErrorMessages } from '@island.is/application/core'
import { mapVehicle } from '../utils'

@Injectable()
export class ChangeOperatorOfVehicleService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly vehicleOperatorsClient: VehicleOperatorsClient,
    private readonly chargeFjsV2ClientService: ChargeFjsV2ClientService,
    private readonly vehicleOwnerChangeClient: VehicleOwnerChangeClient,
    private readonly vehicleServiceFjsV1Client: VehicleServiceFjsV1Client,
    private readonly vehiclesApi: VehicleSearchApi,
    private readonly mileageReadingApi: MileageReadingApi,
  ) {
    super(ApplicationTypes.CHANGE_OPERATOR_OF_VEHICLE)
  }

  private vehiclesApiWithAuth(auth: Auth) {
    return this.vehiclesApi.withMiddleware(new AuthMiddleware(auth))
  }

  async getCurrentVehiclesWithOperatorChangeChecks({
    auth,
  }: TemplateApiModuleActionProps) {
    // Get max 20 vehicles and total count of vehicles
    // Note: Should be enough to only get 20, because if totalRecords
    // is higher than 20, then we won't return any vehicles
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
            vehicleOperatorsClient: this.vehicleOperatorsClient,
            vehicleServiceFjsV1Client: this.vehicleServiceFjsV1Client,
            mileageReadingApi: this.mileageReadingApi,
          })
        }

        // Case: count <= 5
        // Display radio buttons, validate all vehicles now
        return mapVehicle(auth, vehicle, true, {
          vehicleOperatorsClient: this.vehicleOperatorsClient,
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
    const answers = application.answers as ChangeOperatorOfVehicleAnswers

    const permno = answers?.pickVehicle?.plate

    const filteredOldOperators = answers?.oldOperators.filter(
      ({ wasRemoved }) => wasRemoved !== 'true',
    )
    const filteredNewOperators = answers?.operators.filter(
      ({ wasRemoved }) => wasRemoved !== 'true',
    )
    const filteredOperators = [
      ...(filteredOldOperators ? filteredOldOperators : []),
      ...(filteredNewOperators ? filteredNewOperators : []),
    ]

    const operators = filteredOperators.map((operator) => ({
      ssn: operator.nationalId,
      isMainOperator:
        filteredOperators.length > 1
          ? operator.nationalId === answers?.mainOperator?.nationalId
          : true,
    }))

    const mileage = answers?.vehicleMileage?.value

    const result =
      await this.vehicleOperatorsClient.validateAllForOperatorChange(
        auth,
        permno,
        operators,
        mileage ? Number(mileage) || 0 : null,
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
    const answers = application.answers as ChangeOperatorOfVehicleAnswers
    const recipientList = getRecipients(answers, [
      EmailRole.ownerCoOwner,
      EmailRole.operator,
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
    const answers = application.answers as ChangeOperatorOfVehicleAnswers
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
    const isPayment: { fulfilled: boolean } | undefined =
      await this.sharedTemplateAPIService.getPaymentStatus(application.id)

    if (!isPayment?.fulfilled) {
      throw new Error(
        'Ekki er búið að staðfesta greiðslu, hinkraðu þar til greiðslan er staðfest.',
      )
    }

    // 2. Submit the application

    const answers = application.answers as ChangeOperatorOfVehicleAnswers

    const permno = answers?.pickVehicle?.plate

    // Note: Need to be sure that the user that created the application is the seller when submitting application to SGS
    const currentOwner =
      await this.vehicleOwnerChangeClient.getNewestOwnerChange(auth, permno)
    if (currentOwner?.ownerSsn !== application.applicant) {
      throw new TemplateApiError(
        {
          title: applicationCheck.submitApplication.sellerNotValid,
          summary: applicationCheck.submitApplication.sellerNotValid,
        },
        400,
      )
    }

    const filteredOldOperators = answers?.oldOperators.filter(
      ({ wasRemoved }) => wasRemoved !== 'true',
    )
    const filteredNewOperators = answers?.operators.filter(
      ({ wasRemoved }) => wasRemoved !== 'true',
    )
    const filteredOperators = [
      ...(filteredOldOperators ? filteredOldOperators : []),
      ...(filteredNewOperators ? filteredNewOperators : []),
    ]

    const operators = filteredOperators.map((operator) => ({
      ssn: operator.nationalId,
      isMainOperator:
        filteredOperators.length > 1
          ? operator.nationalId === answers?.mainOperator?.nationalId
          : true,
    }))

    const mileage = answers?.vehicleMileage?.value

    const submitResult = await this.vehicleOperatorsClient.saveOperators(
      auth,
      permno,
      operators,
      mileage ? Number(mileage) || 0 : null,
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
