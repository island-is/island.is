import { Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../../shared'
import { TemplateApiModuleActionProps } from '../../../../types'
import { ApplicationTypes } from '@island.is/application/types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import {
  ChangeMachineOwner,
  TransferOfMachineOwnershipClient,
} from '@island.is/clients/aosah/transfer-of-machine-ownership'
import { TemplateApiError } from '@island.is/nest/problem'
import { coreErrorMessages, getValueViaPath } from '@island.is/application/core'

@Injectable()
export class TransferOfMachineOwnershipTemplateService extends BaseTemplateApiService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly transferOfMachineOwnershipClient: TransferOfMachineOwnershipClient,
  ) {
    super(ApplicationTypes.ADMINISTRATION_OF_OCCUPATIONAL_SAFETY_AND_HEALTH) // Maybe change
  }

  async getMachines({ auth }: TemplateApiModuleActionProps) {
    const result = await this.transferOfMachineOwnershipClient.getMachines(auth)

    // Validate that user has at least 1 machine
    if (!result || !result.length) {
      throw new TemplateApiError(
        {
          title: coreErrorMessages.vehiclesEmptyListDefault,
          summary: coreErrorMessages.vehiclesEmptyListDefault,
        },
        400,
      )
    }

    return result
  }

  async getMachineDetail({ auth }: TemplateApiModuleActionProps, id: string) {
    const result = await this.transferOfMachineOwnershipClient.getMachineDetail(
      auth,
      id,
    )

    if (!result) {
      throw new TemplateApiError(
        {
          title: coreErrorMessages.vehiclesEmptyListDefault,
          summary: coreErrorMessages.vehiclesEmptyListDefault,
        },
        400,
      )
    }

    return result
  }

  async submitApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<void> {
    // Validate payment
    console.log('WE HERERERERE')
    // Make sure a paymentUrl was created
    const { paymentUrl } = application.externalData.createCharge.data as {
      paymentUrl: string
    }
    if (!paymentUrl) {
      throw new Error(
        'Ekki er búið að staðfesta greiðslu, hinkraðu þar til greiðslan er staðfest.',
      )
    }

    // Make sure payment is fulfilled (has been paid)
    const payment: { fulfilled: boolean } | undefined =
      await this.sharedTemplateAPIService.getPaymentStatus(auth, application.id)
    if (!payment?.fulfilled) {
      throw new Error(
        'Ekki er búið að staðfesta greiðslu, hinkraðu þar til greiðslan er staðfest.',
      )
    }

    // TODO continue...
  }
  async initReview({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<string> {
    //Promise<Array<EmailRecipient>> {
    // 1. Validate payment

    // 1a. Make sure a paymentUrl was created
    const { paymentUrl, id: paymentId } = application.externalData.createCharge
      .data as {
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
      await this.sharedTemplateAPIService.getPaymentStatus(auth, application.id)
    if (!payment?.fulfilled) {
      throw new Error(
        'Ekki er búið að staðfesta greiðslu, hinkraðu þar til greiðslan er staðfest.',
      )
    } else if (payment?.fulfilled) {
      console.log('Payment fulfilled')

      const ownerChange: ChangeMachineOwner = {
        id: application.id,
        machineId: getValueViaPath(application.answers, 'machine.id'),
        buyerNationalId: getValueViaPath(
          application.answers,
          'buyer.nationalId',
        ),
        sellerNationalId: getValueViaPath(
          application.answers,
          'seller.nationalId',
        ),
        delegateNationalId: getValueViaPath(
          application.answers,
          'seller.nationalId',
        ),
        dateOfOwnerChange: new Date(),
        paymentId: paymentId,
        phoneNumber: getValueViaPath(application.answers, 'buyer.phone'),
        email: getValueViaPath(application.answers, 'buyer.email'),
      }
      console.log('ownerChange', ownerChange)
      await this.transferOfMachineOwnershipClient.changeMachineOwner(
        auth,
        ownerChange,
      )
    }
    return ''
    // 2. Notify users that need to review

    // 2a. Get list of users that need to review
    // const answers = application.answers as TransferOfVehicleOwnershipAnswers
    // const recipientList = getRecipients(answers, [
    //   EmailRole.sellerCoOwner,
    //   EmailRole.buyer,
    //   EmailRole.buyerCoOwner,
    //   EmailRole.buyerOperator,
    // ])

    // // 2b. Send email/sms individually to each recipient
    // for (let i = 0; i < recipientList.length; i++) {
    //   if (recipientList[i].email) {
    //     await this.sharedTemplateAPIService
    //       .sendEmail(
    //         (props) => generateRequestReviewEmail(props, recipientList[i]),
    //         application,
    //       )
    //       .catch(() => {
    //         this.logger.error(
    //           `Error sending email about initReview to ${recipientList[i].email}`,
    //         )
    //       })
    //   }

    //   if (recipientList[i].phone) {
    //     await this.sharedTemplateAPIService
    //       .sendSms(
    //         (_, options) =>
    //           generateRequestReviewSms(application, options, recipientList[i]),
    //         application,
    //       )
    //       .catch(() => {
    //         this.logger.error(
    //           `Error sending sms about initReview to ${recipientList[i].phone}`,
    //         )
    //       })
    //   }
    // }

    // return recipientList
  }
}
