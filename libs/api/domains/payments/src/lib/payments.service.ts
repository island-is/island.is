import { Injectable, Inject } from '@nestjs/common'
import { verify } from 'jsonwebtoken'
import { ConfigType } from '@nestjs/config'
import * as kennitala from 'kennitala'

import { GetPaymentFlowInput } from './dto/getPaymentFlow.input'
import { GetPaymentFlowResponse } from './dto/getPaymentFlow.response'
import {
  PaymentsApi,
  VerificationStatusResponse,
  VerificationCallbackInput,
  GetPaymentFlowDTOPaymentStatusEnum,
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
import { GetPaymentFlowsInput } from './dto/getPaymentFlows.input'
import { GetPaymentFlowsResponse } from './dto/getPaymentFlows.response'
import { GetApplePaySessionResponse } from './dto/getApplePaySession.response'
import { ApplePayChargeResponse } from './dto/applePayCharge.response'
import { ApplePayChargeInput } from './dto/applePayCharge.input'

@Injectable()
export class PaymentsService {
  constructor(
    @Inject(PaymentsApiModuleConfig.KEY)
    private readonly config: ConfigType<typeof PaymentsApiModuleConfig>,
    private readonly paymentsApi: PaymentsApi,
  ) {}

  getPaymentFlow(
    input: GetPaymentFlowInput,
    includeEvents = false,
  ): Promise<GetPaymentFlowResponse> {
    return this.paymentsApi.paymentFlowControllerGetPaymentFlow({
      id: input.id,
      includeEvents,
    })
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

  async getPaymentFlows(
    input: GetPaymentFlowsInput,
  ): Promise<GetPaymentFlowsResponse> {
    const xQueryNationalId =
      input.search && kennitala.isValid(input.search)
        ? kennitala.sanitize(input.search)
        : ''
    const response =
      await this.paymentsApi.paymentFlowControllerGetPaymentFlows({
        after: input.after,
        before: input.before,
        xQueryNationalId,
        search: xQueryNationalId ? '' : input.search,
      })

    return {
      ...response,
      data: response.data.map((flow) => ({
        ...flow,
        paymentStatus:
          flow.paymentStatus as unknown as GetPaymentFlowDTOPaymentStatusEnum,
      })),
    }
  }

  async getApplePaySession(): Promise<GetApplePaySessionResponse> {
    return this.paymentsApi.cardPaymentControllerGetApplePaySession()
  }

  async chargeApplePay(
    applePayChargeInput: ApplePayChargeInput,
  ): Promise<ApplePayChargeResponse> {
    const response = await this.paymentsApi.cardPaymentControllerChargeApplePay(
      {
        applePayChargeInput,
      },
    )

    const { isSuccess, responseCode } = response

    return {
      isSuccess,
      responseCode,
    }
  }
}
