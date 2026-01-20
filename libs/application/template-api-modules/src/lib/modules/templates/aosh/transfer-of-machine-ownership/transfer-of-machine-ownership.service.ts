import { Inject, Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../../shared'
import { TemplateApiModuleActionProps } from '../../../../types'
import { ApplicationTypes } from '@island.is/application/types'
import { BaseTemplateApiService } from '../../../base-template-api.service'

import { TemplateApiError } from '@island.is/nest/problem'
import { coreErrorMessages } from '@island.is/application/core'
import { EmailRecipient, EmailRole } from './types'
import { TransferOfMachineOwnershipAnswers } from '@island.is/application/templates/aosh/transfer-of-machine-ownership'
import { generateRequestReviewEmail } from './emailGenerators/requestReviewEmail'
import {
  getRecipientBySsn,
  getRecipients,
} from './transfer-of-machine-ownership.utils'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { generateRequestReviewSms } from './smsGenerators/requestReviewSms'
import { generateApplicationSubmittedEmail } from './emailGenerators/applicationSubmittedEmail'
import { generateApplicationSubmittedSms } from './smsGenerators/applicationSubmittedSms'
import { applicationCheck } from '@island.is/application/templates/aosh/transfer-of-machine-ownership'
import {
  ChargeFjsV2ClientService,
  getPaymentIdFromExternalData,
} from '@island.is/clients/charge-fjs-v2'
import { generateApplicationRejectedEmail } from './emailGenerators/applicationRejectedEmail'
import { generateApplicationRejectedSms } from './smsGenerators/applicationRejectedSms'
import {
  ChangeMachineOwner,
  MachinesWithTotalCount,
  WorkMachinesClientService,
} from '@island.is/clients/work-machines'
import { User } from '@island.is/auth-nest-tools'
@Injectable()
export class TransferOfMachineOwnershipTemplateService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly chargeFjsV2ClientService: ChargeFjsV2ClientService,
    private readonly workMachineClientService: WorkMachinesClientService,
  ) {
    super(ApplicationTypes.TRANSFER_OF_MACHINE_OWNERSHIP)
  }

  async getMachines({
    auth,
  }: TemplateApiModuleActionProps): Promise<MachinesWithTotalCount> {
    const result = await this.workMachineClientService.getMachines(auth, {
      showDeregisteredMachines: true,
    })
    if (!result || !result.totalCount) {
      throw new TemplateApiError(
        {
          title: coreErrorMessages.machinesEmptyListDefault,
          summary: coreErrorMessages.machinesEmptyListDefault,
        },
        400,
      )
    }
    if (result.totalCount <= 5) {
      return {
        machines: await Promise.all(
          result.machines.map(async (machine) => {
            if (machine.id) {
              return await this.workMachineClientService.getMachineDetail(
                auth,
                machine.id,
                'ownerChange',
              )
            }
            return machine
          }),
        ),
        totalCount: result.totalCount,
      }
    }
    return result
  }

  async submitApplication({
    application,
    auth,
    currentUserLocale,
  }: TemplateApiModuleActionProps): Promise<void> {
    await this.handlePayment({ application, auth, currentUserLocale })

    // Confirm owner change in AOSH
    const answers = application.answers as TransferOfMachineOwnershipAnswers
    if (answers?.seller?.nationalId !== application.applicant) {
      throw new TemplateApiError(
        {
          title: applicationCheck.submitApplication.sellerNotValid,
          summary: applicationCheck.submitApplication.sellerNotValid,
        },
        400,
      )
    }
    const machineId = answers.machine?.id
    if (!machineId) {
      throw new Error('Machine has not been selected')
    }
    await this.workMachineClientService.confirmOwnerChange(auth, {
      applicationId: application.id,
      machineId: machineId,
      machineMoreInfo: answers?.location?.moreInfo,
      machinePostalCode: answers?.location?.postCode,
      buyerNationalId: answers.buyer.nationalId,
      delegateNationalId: auth.nationalId || answers.buyer.nationalId,
      supervisorNationalId: answers.buyerOperator?.nationalId,
      supervisorEmail: answers.buyerOperator?.email,
      supervisorPhoneNumber: answers.buyerOperator?.phone?.replace(/-/g, ''),
      machineAddress: answers?.location?.address,
    })

    // send email/sms to all recipients
    const recipientList = getRecipients(answers, [
      EmailRole.buyer,
      EmailRole.seller,
      EmailRole.buyerOperator,
    ])
    // 2b. Send email/sms individually to each recipient
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
              `Error sending email about submit application in application: ID: ${application.id}, 
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
              `Error sending sms about submit application to 
              a phonenumber in application: ID: ${application.id}, 
              role: ${recipientList[i].role}`,
              e,
            )
          })
      }
    }
  }
  async initReview({
    application,
    auth,
    currentUserLocale,
  }: TemplateApiModuleActionProps): Promise<Array<EmailRecipient>> {
    const answers = application.answers as TransferOfMachineOwnershipAnswers

    if (
      answers.machine.paymentRequiredForOwnerChange &&
      application.state === 'draft'
    ) {
      return []
    }
    const paymentId = await this.handlePayment({
      application,
      auth,
      currentUserLocale,
    })

    const machineId = answers.machine?.id
    if (!machineId) {
      throw new Error('Ekki er búið að velja vél')
    }
    const ownerChange: ChangeMachineOwner = {
      applicationId: application.id,
      machineId: machineId,
      buyerNationalId: answers.buyer.nationalId,
      sellerNationalId: answers.seller.nationalId,
      delegateNationalId: auth.nationalId || answers.seller.nationalId,
      dateOfOwnerChange: new Date(),
      paymentId: paymentId,
      phoneNumber: answers.buyer.phone?.replace(/\+\d{3}/, ''),
      email: answers.buyer.email,
    }
    await this.workMachineClientService.initiateOwnerChangeProcess(
      auth,
      ownerChange,
    )

    const recipientList = getRecipients(answers, [EmailRole.buyer])
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

  private async handlePayment({
    application,
  }: TemplateApiModuleActionProps): Promise<string | null> {
    const answers = application.answers as TransferOfMachineOwnershipAnswers

    if (answers.machine.paymentRequiredForOwnerChange) {
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

  private async deleteOwnerChange(
    auth: User,
    applicationId: string,
  ): Promise<void> {
    try {
      const deleteChange = {
        ownerchangeId: applicationId,
        xCorrelationID: applicationId,
      }
      await this.workMachineClientService.deleteOwnerChange(auth, deleteChange)
    } catch (error) {
      this.logger.error(
        `Failed to delete owner change for application ${applicationId}`,
        error,
      )
      throw error
    }
  }

  async deleteApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<void> {
    // 1. Delete charge so that the seller gets reimburshed
    const chargeId = getPaymentIdFromExternalData(application)
    try {
      if (chargeId) {
        await this.chargeFjsV2ClientService.deleteCharge(chargeId)
      }
    } catch (error) {
      this.logger.error(
        `Failed to delete charge ${chargeId} for application ${application.id}`,
        error,
      )
      throw error
    }

    // 2. Delete owner change in work machines
    await this.deleteOwnerChange(auth, application.id)

    // 3. Notify everyone in the process that the application has been withdrawn

    // 3a. Get list of users that need to be notified
    const answers = application.answers as TransferOfMachineOwnershipAnswers
    const recipientList = getRecipients(answers, [
      EmailRole.seller,
      EmailRole.buyer,
    ])

    // 3b. Send email/sms individually to each recipient about success of withdrawing application
    const deletedByRecipient = getRecipientBySsn(answers, auth.nationalId)
    for (let i = 0; i < recipientList.length; i++) {
      if (recipientList[i].email) {
        await this.sharedTemplateAPIService
          .sendEmail(
            (props) =>
              generateApplicationRejectedEmail(
                props,
                recipientList[i],
                deletedByRecipient,
              ),
            application,
          )
          .catch((e) => {
            this.logger.error(
              `Error sending email about deleteApplication in application: ID: ${application.id}, 
            role: ${recipientList[i].role}`,
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
                deletedByRecipient,
              ),
            application,
          )
          .catch((e) => {
            this.logger.error(
              `Error sending sms about deleteApplication to 
              a phonenumber in application: ID: ${application.id}, 
              role: ${recipientList[i].role}`,
              e,
            )
          })
      }
    }
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

    // 2. Delete owner change in work machines
    await this.deleteOwnerChange(auth, application.id)

    // 3. Notify everyone in the process that the application has been withdrawn

    // 3a. Get list of users that need to be notified
    const answers = application.answers as TransferOfMachineOwnershipAnswers
    const recipientList = getRecipients(answers, [
      EmailRole.seller,
      EmailRole.buyer,
    ])

    // 3b. Send email/sms individually to each recipient about success of withdrawing application
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
              ),
            application,
          )
          .catch((e) => {
            this.logger.error(
              `Error sending email about rejectApplication in application: ID: ${application.id}, 
            role: ${recipientList[i].role}`,
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
              ),
            application,
          )
          .catch((e) => {
            this.logger.error(
              `Error sending sms about rejectApplication to 
              a phonenumber in application: ID: ${application.id}, 
              role: ${recipientList[i].role}`,
              e,
            )
          })
      }
    }
  }
}
