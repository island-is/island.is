import { Inject, Injectable } from '@nestjs/common'
import { verify } from 'jsonwebtoken'
import { ConfigType } from '@nestjs/config'

import { GetPaymentFlowInput } from './dto/getPaymentFlow.input'
import {
  PaymentsApi,
  GetPaymentFlowDTO,
  VerificationStatusResponse,
  VerificationCallbackInput,
} from '@island.is/clients/payments'

import { VerifyCardInput } from './dto/verifyCard.input'
import { VerifyCardResponse } from './dto/verifyCard.response'
import { ChargeCardInput } from './dto/chargeCard.input'
import { ChargeCardResponse } from './dto/chargeCard.response'
import { CardVerificationCallbackInput } from './dto/cardVerificationCallback.input'
import { PaymentsApiModuleConfig } from './payments.config'
import { CreateInvoiceInput } from './dto/createInvoice.input'
import { CreateInvoiceResponse } from './dto/createInvoice.response'
import { CardVerificationResponse } from './dto/cardVerificationCallback.response'

@Injectable()
export class PaymentsService {
  constructor(
    private readonly paymentsApi: PaymentsApi,
    @Inject(PaymentsApiModuleConfig.KEY)
    private readonly config: ConfigType<typeof PaymentsApiModuleConfig>,
  ) {}

  getPaymentFlow(input: GetPaymentFlowInput): Promise<GetPaymentFlowDTO> {
    return this.paymentsApi.paymentFlowControllerGetPaymentFlow(input)
  }

  getVerificationStatus(
    input: GetPaymentFlowInput,
  ): Promise<VerificationStatusResponse> {
    return this.paymentsApi.cardPaymentControllerVerificationStatus({
      paymentFlowId: input.id,
    })
  }

  verifyCard(verifyCardInput: VerifyCardInput): Promise<VerifyCardResponse> {
    return this.paymentsApi.cardPaymentControllerVerify({
      verifyCardInput,
    })
  }

  async verifyCardCallback(
    cardVerificationInput: CardVerificationCallbackInput,
  ): Promise<CardVerificationResponse> {
    const { verificationToken } = cardVerificationInput

    let decoded: null | VerificationCallbackInput = null

    try {
      decoded = verify(
        verificationToken,
        this.config.verificationCallbackSigningSecret,
      ) as VerificationCallbackInput
    } catch (e) {
      // pass
    }

    if (!decoded) {
      throw new Error('Invalid verification token')
    }

    const { cavv, xid, md, mdStatus, dsTransId } = decoded

    if (!cavv || !xid || !md || !mdStatus || !dsTransId) {
      throw new Error('Invalid verification token contents')
    }

    return this.paymentsApi.cardPaymentControllerVerificationCallback({
      verificationCallbackInput: {
        cavv,
        xid,
        md,
        mdStatus,
        dsTransId,
      },
    })
  }

  async chargeCard(
    chargeCardInput: ChargeCardInput,
  ): Promise<ChargeCardResponse> {
    const response = await this.paymentsApi.cardPaymentControllerCharge({
      chargeCardInput,
    })

    const { isSuccess, responseCode } = response

    return {
      isSuccess,
      responseCode,
    }
  }

  async createInvoice(
    createInvoiceInput: CreateInvoiceInput,
  ): Promise<CreateInvoiceResponse> {
    return this.paymentsApi.invoicePaymentControllerCreate({
      createInvoiceInput,
    })
  }

  async getJwks() {
    return this.paymentsApi.jwksControllerServeJwks()
  }
}
