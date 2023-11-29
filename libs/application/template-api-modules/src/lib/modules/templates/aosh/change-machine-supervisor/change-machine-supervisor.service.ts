import { Inject, Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../../shared'
import { TemplateApiModuleActionProps } from '../../../../types'
import { ApplicationTypes } from '@island.is/application/types'
import { BaseTemplateApiService } from '../../../base-template-api.service'

import { TemplateApiError } from '@island.is/nest/problem'
import { coreErrorMessages } from '@island.is/application/core'
import { EmailRecipient, EmailRole } from './types'
import { ChangeMachineSupervisorAnswers } from '@island.is/application/templates/aosh/change-machine-supervisor'
import { generateRequestReviewEmail } from './emailGenerators/requestReviewEmail'
import { getRecipients } from './change-machine-supervisor.utils'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { generateRequestReviewSms } from './smsGenerators/requestReviewSms'
import {
  ChangeMachineOwner,
  TransferOfMachineOwnershipClient,
} from '@island.is/clients/aosh/transfer-of-machine-ownership'

@Injectable()
export class ChangeMachineSupervisorTemplateService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly transferOfMachineOwnershipClient: TransferOfMachineOwnershipClient,
  ) {
    super(ApplicationTypes.TRANSFER_OF_MACHINE_OWNERSHIP)
  }

  async getMachines({ auth }: TemplateApiModuleActionProps) {
    const result = await this.transferOfMachineOwnershipClient.getMachines(auth)

    // Validate that user has at least 1 machine
    if (!result || !result.length) {
      throw new TemplateApiError(
        {
          title: coreErrorMessages.machinesEmptyListDefault,
          summary: coreErrorMessages.machinesEmptyListDefault,
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
  }
  async initReview({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<Array<EmailRecipient>> {
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
      const answers = application.answers as ChangeMachineSupervisorAnswers
      const ownerChange: ChangeMachineOwner = {
        // id: application.id,
        // machineId: answers.machine?.id,
        // buyerNationalId: answers.buyer.nationalId,
        // sellerNationalId: answers.seller.nationalId,
        // delegateNationalId: answers.seller.nationalId,
        // dateOfOwnerChange: new Date(),
        // paymentId: paymentId,
        // phoneNumber: answers.buyer.phone,
        // email: answers.buyer.email,
      }

      await this.transferOfMachineOwnershipClient.changeMachineOwner(
        auth,
        ownerChange,
      )
    }

    const answers = application.answers as ChangeMachineSupervisorAnswers
    const recipientList = getRecipients(answers, [
      EmailRole.buyer,
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
          .catch(() => {
            this.logger.error(
              `Error sending email about initReview to ${recipientList[i].email}`,
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
          .catch(() => {
            this.logger.error(
              `Error sending sms about initReview to ${recipientList[i].phone}`,
            )
          })
      }
    }

    return recipientList
  }
}
