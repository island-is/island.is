import { Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../../shared'
import { TemplateApiModuleActionProps } from '../../../../types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { ApplicationTypes } from '@island.is/application/types'
import {
  applicationCheck,
  LicensePlateRenewalAnswers,
} from '@island.is/application/templates/transport-authority/license-plate-renewal'
import {
  PlateOwnership,
  PlateOwnershipValidation,
  VehiclePlateRenewalClient,
} from '@island.is/clients/transport-authority/vehicle-plate-renewal'
import { TemplateApiError } from '@island.is/nest/problem'
import { info } from 'kennitala'
import { error } from '@island.is/application/templates/transport-authority/license-plate-renewal'
import { User } from '@island.is/auth-nest-tools'

@Injectable()
export class LicensePlateRenewalService extends BaseTemplateApiService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly vehiclePlateRenewalClient: VehiclePlateRenewalClient,
  ) {
    super(ApplicationTypes.LICENSE_PLATE_RENEWAL)
  }

  async getMyPlateOwnershipList({ auth }: TemplateApiModuleActionProps) {
    const result = await this.vehiclePlateRenewalClient.getMyPlateOwnerships(
      auth,
    )
    const totalRecords = (result && result.length) || 0

    // Validate that user has at least 1 plate ownership
    if (!totalRecords) {
      throw new TemplateApiError(
        {
          title: error.plateOwnershipEmptyList,
          summary: error.plateOwnershipEmptyList,
        },
        400,
      )
    }

    const plateOwnerships = await Promise.all(
      result.map(async (plateOwnership) => {
        // Case: count > 5
        // Display dropdown, validate plate ownership when selected in dropdown
        if (totalRecords > 5) {
          return this.mapPlateOwnership(auth, plateOwnership, false)
        }

        // Case: count <= 5
        // Display radio buttons, validate all plate ownerships now
        return this.mapPlateOwnership(auth, plateOwnership, true)
      }),
    )

    return plateOwnerships
  }

  private async mapPlateOwnership(
    auth: User,
    plateOwnership: PlateOwnership,
    fetchExtraData: boolean,
  ) {
    let validation: PlateOwnershipValidation | undefined

    if (fetchExtraData) {
      // Get plate renewal validation
      validation = await this.vehiclePlateRenewalClient.validatePlateOwnership(
        auth,
        plateOwnership.regno,
      )
    }

    return {
      regno: plateOwnership.regno,
      startDate: plateOwnership.startDate,
      endDate: plateOwnership.endDate,
      validationErrorMessages: validation?.hasError
        ? validation.errorMessages
        : null,
    }
  }

  async submitApplication({
    application,
    auth,
    currentUserLocale,
  }: TemplateApiModuleActionProps): Promise<void> {
    const age = info(auth.nationalId).age
    if (age < 65 && application.state === 'draft') {
      return
    }

    await this.handlePayment({
      application,
      auth,
      currentUserLocale,
    })

    const answers = application.answers as LicensePlateRenewalAnswers
    const regno = answers?.pickPlate?.regno

    // Submit the application
    const submitResult =
      await this.vehiclePlateRenewalClient.renewPlateOwnership(auth, regno)

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
  }

  private async handlePayment({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<string | null> {
    const age = info(auth.nationalId).age

    if (age < 65) {
      // 1. Validate payment

      // 1a. Make sure a paymentUrl was created

      const { paymentUrl = '', id: paymentId = '' } = (application.externalData
        ?.createCharge?.data ?? {}) as {
        paymentUrl: string
        id: string
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
      return paymentId
    }
    return null
  }
}
