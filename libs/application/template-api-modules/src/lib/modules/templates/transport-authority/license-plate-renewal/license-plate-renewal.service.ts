import { Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../../shared'
import { TemplateApiModuleActionProps } from '../../../../types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { ApplicationTypes } from '@island.is/application/types'
import { LicensePlateRenewalAnswers } from '@island.is/application/templates/transport-authority/license-plate-renewal'
import {
  PlateOwnership,
  PlateOwnershipValidation,
  VehiclePlateRenewalClient,
} from '@island.is/clients/transport-authority/vehicle-plate-renewal'
import { TemplateApiError } from '@island.is/nest/problem'
import { info } from 'kennitala'
import { error } from '@island.is/application/templates/transport-authority/license-plate-renewal'

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
    // Validate that user has at least 1 plate ownership
    if (!result || !result.length) {
      throw new TemplateApiError(
        {
          title: error.plateOwnershipEmptyList,
          summary: error.plateOwnershipEmptyList,
        },
        400,
      )
    }

    return await Promise.all(
      result.map(async (item: PlateOwnership) => {
        let validation: PlateOwnershipValidation | undefined

        // Only validate if fewer than 5 items
        if (result.length <= 5) {
          validation =
            await this.vehiclePlateRenewalClient.validatePlateOwnership(
              auth,
              item.regno,
            )
        }

        return {
          regno: item.regno,
          startDate: item.startDate,
          endDate: item.endDate,
          validationErrorMessages: validation?.hasError
            ? validation.errorMessages
            : null,
        }
      }),
    )
  }

  async validateApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps) {
    const answers = application.answers as LicensePlateRenewalAnswers
    const regno = answers?.pickPlate?.regno

    const result = await this.vehiclePlateRenewalClient.validatePlateOwnership(
      auth,
      regno,
    )

    // If we get any error messages, we will just throw an error with a default title
    // We will fetch these error messages again through graphql in the template, to be able
    // to translate the error message
    if (result.hasError && result.errorMessages?.length) {
      throw new TemplateApiError(
        {
          title: error.validationAlertTitle,
          summary: error.validationAlertTitle,
        },
        400,
      )
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
    await this.vehiclePlateRenewalClient.renewPlateOwnership(auth, regno)
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
        await this.sharedTemplateAPIService.getPaymentStatus(
          auth,
          application.id,
        )
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
