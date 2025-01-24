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
      verifyCardInput: {
        ...verifyCardInput,
        verificationCallbackUrl: '', // TODO
      },
    })
  }

  async verifyCardCallback(
    cardVerificationInput: CardVerificationCallbackInput,
  ): Promise<boolean> {
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

    await this.paymentsApi.cardPaymentControllerVerificationCallback({
      verificationCallbackInput: {
        cavv,
        xid,
        md,
        mdStatus,
        dsTransId,
      },
    })

    return true
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
}
