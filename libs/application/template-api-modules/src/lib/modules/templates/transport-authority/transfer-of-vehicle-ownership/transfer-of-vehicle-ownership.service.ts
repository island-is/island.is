import { Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../../shared'
import { TemplateApiModuleActionProps } from '../../../../types'
import { ChargeItemCode } from '@island.is/shared/constants'
import { TransferOfVehicleOwnershipApi } from '@island.is/api/domains/transport-authority/transfer-of-vehicle-ownership'
import { TransferOfVehicleOwnershipAnswers } from '@island.is/application/templates/transport-authority/transfer-of-vehicle-ownership'
import {
  generateAssignReviewerEmail,
  generateConfirmationEmail,
} from './emailGenerators'
import {
  generateAssignReviewerSms,
  generateConfirmationSms,
} from './smsGenerators'

interface EmailRecipient {
  name: string
  email: string
  phone?: string
}

@Injectable()
export class TransferOfVehicleOwnershipService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly transferOfVehicleOwnershipApi: TransferOfVehicleOwnershipApi,
  ) {}

  async createCharge({
    application: { id },
    auth,
  }: TemplateApiModuleActionProps): Promise<
    | {
        id: string
        paymentUrl: string
      }
    | undefined
  > {
    try {
      const result = this.sharedTemplateAPIService.createCharge(
        auth.authorization,
        id,
        ChargeItemCode.TRANSPORT_AUTHORITY_XXX,
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
  }: TemplateApiModuleActionProps): Promise<void> {
    // Validate payment:

    const { paymentUrl } = application.externalData.createCharge.data as {
      paymentUrl: string
    }
    if (!paymentUrl) {
      throw new Error(
        'Ekki er búið að staðfesta greiðslu, hinkraðu þar til greiðslan er staðfest.',
      )
    }

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

    // Notify users that need to review
    const recipientList: Array<EmailRecipient> = []
    const answers = application.answers as TransferOfVehicleOwnershipAnswers

    // Seller's co-owners
    const sellerCoOwners = answers.sellerCoOwner
    if (sellerCoOwners) {
      for (var i = 0; i < sellerCoOwners.length; i++) {
        recipientList.push({
          name: sellerCoOwners[i].name,
          email: sellerCoOwners[i].email,
          phone: sellerCoOwners[i].phone,
        })
      }
    }

    // Buyer
    if (answers.buyer) {
      recipientList.push({
        name: answers.buyer.name,
        email: answers.buyer.email,
        phone: answers.buyer.phone,
      })
    }

    // Buyer's co-owners
    const buyerCoOwners = answers.buyerCoOwnerAndOperator?.filter(
      (x) => x.type === 'coOwner',
    )
    if (buyerCoOwners) {
      for (var i = 0; i < buyerCoOwners.length; i++) {
        recipientList.push({
          name: buyerCoOwners[i].name,
          email: buyerCoOwners[i].email,
          phone: buyerCoOwners[i].phone,
        })
      }
    }

    // Buyer's operators
    const buyerOperators = answers.buyerCoOwnerAndOperator?.filter(
      (x) => x.type === 'operator',
    )
    if (buyerOperators) {
      for (var i = 0; i < buyerOperators.length; i++) {
        recipientList.push({
          name: buyerOperators[i].name,
          email: buyerOperators[i].email,
          phone: buyerOperators[i].phone,
        })
      }
    }

    // Send email/sms individually to each recipient
    for (var i = 0; i < recipientList.length; i++) {
      if (recipientList[i].email) {
        await this.sharedTemplateAPIService.sendEmail(
          (props) =>
            generateAssignReviewerEmail(
              props,
              recipientList[i].name,
              recipientList[i].email,
            ),
          application,
        )
      }

      if (recipientList[i].phone) {
        await this.sharedTemplateAPIService.sendSms(
          () =>
            generateAssignReviewerSms(
              recipientList[i].name,
              recipientList[i].phone || '',
            ),
          application,
        )
      }
    }
  }

  // Notify everyone that has been added to the application (by the buyer) that needs to review
  async addReview({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<void> {
    const answers = application.answers as TransferOfVehicleOwnershipAnswers

    if (
      !answers.buyer.nationalId ||
      auth.nationalId !== answers.buyer.nationalId
    ) {
      return
    }

    //TODOx refactor addReview

    // const oldInitReviewRecipientList = (application.externalData.initReview
    //   ?.data || []) as Array<EmailRecipient>
    // const oldAddReviewRecipientList = (application.externalData.addReview
    //   ?.data || []) as Array<EmailRecipient>
    // const oldRecipientList = [
    //   ...oldInitReviewRecipientList,
    //   ...oldAddReviewRecipientList,
    // ]
    // // Notify users that need to review, that were recently added by buyer (buyer coOwners and buyerOperators)
    // const newRecipientList: Array<EmailRecipient> = []
    // // Buyer's co-owners
    // const buyerCoOwners = answers.buyerCoOwnerAndOperator?.filter(
    //   (x) => x.type === 'coOwner',
    // )
    // if (buyerCoOwners) {
    //   for (var i = 0; i < buyerCoOwners.length; i++) {
    //     if (
    //       !oldRecipientList.find((x) => {
    //         x.email === buyerCoOwners[i].email
    //       })
    //     ) {
    //       newRecipientList.push({
    //         name: buyerCoOwners[i].name,
    //         email: buyerCoOwners[i].email,
    //         phone: buyerCoOwners[i].phone,
    //       })
    //     }
    //   }
    // }
    // // Buyer's operators
    // const buyerOperators = answers.buyerCoOwnerAndOperator?.filter(
    //   (x) => x.type === 'operator',
    // )
    // if (buyerOperators) {
    //   for (var i = 0; i < buyerOperators.length; i++) {
    //     if (
    //       !oldRecipientList.find((x) => {
    //         x.email === buyerOperators[i].email
    //       })
    //     ) {
    //       newRecipientList.push({
    //         name: buyerOperators[i].name,
    //         email: buyerOperators[i].email,
    //         phone: buyerOperators[i].phone,
    //       })
    //     }
    //   }
    // }
    // // Send email/sms individually to each recipient
    // for (var i = 0; i < newRecipientList.length; i++) {
    //   if (newRecipientList[i].email) {
    //     await this.sharedTemplateAPIService.sendEmail(
    //       (props) =>
    //         generateAssignReviewerEmail(
    //           props,
    //           newRecipientList[i].name,
    //           newRecipientList[i].email,
    //         ),
    //       application,
    //     )
    //   }
    //   if (newRecipientList[i].phone) {
    //     await this.sharedTemplateAPIService.sendSms(
    //       () =>
    //         generateAssignReviewerSms(
    //           newRecipientList[i].name,
    //           newRecipientList[i].phone || '',
    //         ),
    //       application,
    //     )
    //   }
    // }
    // return [...oldRecipientList, ...newRecipientList]
  }

  async rejectApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<void> {
    // TODOx implement rejectApplication
    // send email to everyone involved about this
    // cancel charge so that seller gets reimburshed
  }

  // After everyone has reviewed (and approved), then submit the application, and notify everyone involved it was a success
  async submitApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<void> {
    const answers = application.answers as TransferOfVehicleOwnershipAnswers

    const buyerCoOwners = answers.buyerCoOwnerAndOperator?.filter(
      (x) => x.type === 'coOwner',
    )

    const buyerOperators = answers.buyerCoOwnerAndOperator?.filter(
      (x) => x.type === 'operator',
    )

    // Submit the application
    await this.transferOfVehicleOwnershipApi.saveOwnerChange(auth, {
      permno: answers?.vehicle?.plate,
      seller: {
        ssn: answers?.seller?.nationalId,
        email: answers?.seller?.email,
      },
      buyer: {
        ssn: answers?.buyer?.nationalId,
        email: answers?.buyer?.email,
      },
      // Note: API throws error if timestamp is 00:00:00, so we will use noon
      dateOfPurchase: this.getDateAtNoonFromString(answers?.vehicle?.date),
      saleAmount: Number(answers?.vehicle?.salePrice) || 0,
      // Note: Insurance code 000 is when car is out of commission and is not going to be insured
      insuranceCompanyCode:
        answers?.insurance?.value !== '000'
          ? answers?.insurance?.value
          : undefined,
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

    // Notify everyone in the process that the application have successfully been submitted
    const recipientList: Array<EmailRecipient> = []

    // Seller
    if (answers.seller) {
      recipientList.push({
        name: answers.seller.name,
        email: answers.seller.email,
        phone: answers.seller.phone,
      })
    }

    // Seller's co-owners
    const sellerCoOwners = answers.sellerCoOwner
    if (sellerCoOwners) {
      for (var i = 0; i < sellerCoOwners.length; i++) {
        recipientList.push({
          name: sellerCoOwners[i].name,
          email: sellerCoOwners[i].email,
          phone: sellerCoOwners[i].phone,
        })
      }
    }

    // Buyer
    if (answers.buyer) {
      recipientList.push({
        name: answers.buyer.name,
        email: answers.buyer.email,
        phone: answers.buyer.phone,
      })
    }

    // Buyer's co-owners
    if (buyerCoOwners) {
      for (var i = 0; i < buyerCoOwners.length; i++) {
        recipientList.push({
          name: buyerCoOwners[i].name,
          email: buyerCoOwners[i].email,
          phone: buyerCoOwners[i].phone,
        })
      }
    }

    // Buyer's operators
    if (buyerOperators) {
      for (var i = 0; i < buyerOperators.length; i++) {
        recipientList.push({
          name: buyerOperators[i].name,
          email: buyerOperators[i].email,
          phone: buyerOperators[i].phone,
        })
      }
    }

    // Send email/sms individually to each recipient about success of submitting application
    for (var i = 0; i < recipientList.length; i++) {
      if (recipientList[i].email) {
        await this.sharedTemplateAPIService.sendEmail(
          (props) =>
            generateConfirmationEmail(
              props,
              recipientList[i].name,
              recipientList[i].email,
            ),
          application,
        )
      }

      if (recipientList[i].phone) {
        await this.sharedTemplateAPIService.sendSms(
          () =>
            generateConfirmationSms(
              recipientList[i].name,
              recipientList[i].phone || '',
            ),
          application,
        )
      }
    }
  }

  private getDateAtNoonFromString(dateStr: string): Date {
    const dateObj = new Date(dateStr)
    const date =
      dateObj instanceof Date && !isNaN(dateObj.getDate())
        ? dateObj
        : new Date()
    return new Date(date.toISOString().substring(0, 10) + 'T12:00:00Z')
  }
}
