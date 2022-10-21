import { Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../../shared'
import { TemplateApiModuleActionProps } from '../../../../types'
import { ChargeItemCode } from '@island.is/shared/constants'
import { VehicleOwnerChangeService } from '@island.is/api/domains/transport-authority/vehicle-owner-change'
import { TransferOfVehicleOwnershipAnswers } from '@island.is/application/templates/transport-authority/transfer-of-vehicle-ownership'
import {
  generateAssignReviewerEmail,
  generateConfirmationEmail,
} from './emailGenerators'

interface EmailRecipient {
  name: string
  email: string
}

@Injectable()
export class TransferOfVehicleOwnershipService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly vehicleOwnerChangeService: VehicleOwnerChangeService,
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

  async initReview({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<Array<EmailRecipient>> {
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
      // TODOx payment step disabled
      // throw new Error(
      //   'Ekki er búið að staðfesta greiðslu, hinkraðu þar til greiðslan er staðfest.',
      // )
    }

    // Send emails about review to users that have been added (and have not approved yet):
    const newSubmitRecipientList: Array<EmailRecipient> = []
    const answers = application.answers as TransferOfVehicleOwnershipAnswers

    // // Seller's co-owners
    // if (answers.sellerCoOwners) {
    //   for (var i = 0; i < answers.sellerCoOwners.length; i++) {
    //     newSubmitRecipientList.push({
    //       name: answers.sellerCoOwners[i].name,
    //       email: answers.sellerCoOwners[i].email,
    //     })
    //   }
    // }

    // // Buyer
    // if (answers.buyer) {
    //   newSubmitRecipientList.push({
    //     name: answers.buyer.name,
    //     email: answers.buyer.email,
    //   })
    // }

    // // Buyer's co-owners
    // if (answers.buyerCoOwners) {
    //   for (var i = 0; i < answers.buyerCoOwners.length; i++) {
    //     newSubmitRecipientList.push({
    //       name: answers.buyerCoOwners[i].name,
    //       email: answers.buyerCoOwners[i].email,
    //     })
    //   }
    // }

    // // Buyer's operators
    // if (answers.buyerOperators) {
    //   for (var i = 0; i < answers.buyerOperators.length; i++) {
    //     newSubmitRecipientList.push({
    //       name: answers.buyerOperators[i].name,
    //       email: answers.buyerOperators[i].email,
    //     })
    //   }
    // }

    // Send email individually to each recipient
    for (var i = 0; i < newSubmitRecipientList.length; i++) {
      await this.sharedTemplateAPIService.sendEmail(
        (props) =>
          generateAssignReviewerEmail(
            props,
            newSubmitRecipientList[i].name,
            newSubmitRecipientList[i].email,
          ),
        application,
      )
    }

    return newSubmitRecipientList
  }

  async submitReview({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<Array<EmailRecipient>> {
    const oldReviewRecipientList = (application.externalData.initReview?.data ||
      []) as Array<EmailRecipient>
    const oldSubmitRecipientList = (application.externalData.submitReview
      ?.data || []) as Array<EmailRecipient>

    const oldRecipientList = [
      ...oldReviewRecipientList,
      ...oldSubmitRecipientList,
    ]

    // Send emails about review to users that have been added (and have not approved yet):
    const newSubmitRecipientList: Array<EmailRecipient> = []
    const answers = application.answers as TransferOfVehicleOwnershipAnswers

    // // Buyer's co-owners
    // if (answers.buyerCoOwners) {
    //   for (var i = 0; i < answers.buyerCoOwners.length; i++) {
    //     if (
    //       !oldRecipientList.find((x) => {
    //         x.email === answers.buyerCoOwners[i].email
    //       })
    //     ) {
    //       newSubmitRecipientList.push({
    //         name: answers.buyerCoOwners[i].name,
    //         email: answers.buyerCoOwners[i].email,
    //       })
    //     }
    //   }
    // }

    // // Buyer's operators
    // if (answers.buyerOperators) {
    //   for (var i = 0; i < answers.buyerOperators.length; i++) {
    //     if (
    //       !oldRecipientList.find((x) => {
    //         x.email === answers.buyerOperators[i].email
    //       })
    //     ) {
    //       newSubmitRecipientList.push({
    //         name: answers.buyerOperators[i].name,
    //         email: answers.buyerOperators[i].email,
    //       })
    //     }
    //   }
    // }

    // Send email individually to each recipient
    for (var i = 0; i < newSubmitRecipientList.length; i++) {
      await this.sharedTemplateAPIService.sendEmail(
        (props) =>
          generateAssignReviewerEmail(
            props,
            newSubmitRecipientList[i].name,
            newSubmitRecipientList[i].email,
          ),
        application,
      )
    }

    return [...oldSubmitRecipientList, ...newSubmitRecipientList]
  }

  async submitApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<void> {
    const answers = application.answers as TransferOfVehicleOwnershipAnswers

    // Submit the application
    await this.vehicleOwnerChangeService.saveOwnerChange(auth.nationalId, {
      permno: answers?.vehicle?.plate,
      seller: {
        ssn: answers?.seller?.nationalId,
        email: answers?.seller?.email,
      },
      buyer: {
        ssn: answers?.buyer?.nationalId,
        email: answers?.buyer?.email,
      },
      dateOfPurchase: new Date(answers?.vehicle?.date || Date.now()),
      saleAmount: Number(answers?.vehicle?.salePrice) || 0,
      insuranceCompanyCode: 'TODOx vantar',
      operators: [
        //TODOx vantar
        // {
        //   ssn: '',
        //   email: '',
        //   isMainOperator: false,
        // },
      ],
      coOwners: [
        //TODOx vantar
        // {
        //   ssn: '',
        //   email: '',
        // },
      ],
    })

    // Send emails to everyone in the process that the application have successfully been submitted
    const recipientList: Array<EmailRecipient> = []

    // // Seller
    // if (answers.seller) {
    //   recipientList.push({
    //     name: answers.seller.name,
    //     email: answers.seller.email,
    //   })
    // }

    // // Seller's co-owners
    // if (answers.sellerCoOwners) {
    //   for (var i = 0; i < answers.sellerCoOwners.length; i++) {
    //     recipientList.push({
    //       name: answers.sellerCoOwners[i].name,
    //       email: answers.sellerCoOwners[i].email,
    //     })
    //   }
    // }

    // // Buyer
    // if (answers.buyer) {
    //   recipientList.push({
    //     name: answers.buyer.name,
    //     email: answers.buyer.email,
    //   })
    // }

    // // Buyer's co-owners
    // if (answers.buyerCoOwners) {
    //   for (var i = 0; i < answers.buyerCoOwners.length; i++) {
    //     recipientList.push({
    //       name: answers.buyerCoOwners[i].name,
    //       email: answers.buyerCoOwners[i].email,
    //     })
    //   }
    // }

    // // Buyer's operators
    // if (answers.buyerOperators) {
    //   for (var i = 0; i < answers.buyerOperators.length; i++) {
    //     recipientList.push({
    //       name: answers.buyerOperators[i].name,
    //       email: answers.buyerOperators[i].email,
    //     })
    //   }
    // }

    // Send email individually to each recipient
    for (var i = 0; i < recipientList.length; i++) {
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
  }
}
