import { Injectable } from '@nestjs/common'
import {
  ChargeStatusByRequestIDrequestIDGETResponse,
  DefaultApi,
  ChargeStatusResultStatusEnum,
} from '../../gen/fetch'
import {
  Catalog,
  Charge,
  ChargeResponse,
  ChargeToValidate,
} from './chargeFjsV2Client.types'

@Injectable()
export class ChargeFjsV2ClientService {
  constructor(private api: DefaultApi) {}

  async getChargeStatus(
    chargeId: string,
  ): Promise<ChargeStatusByRequestIDrequestIDGETResponse | null> {
    const response = await this.api.chargeStatusByRequestIDrequestIDGET4({
      requestID: chargeId,
    })

    return response
  }

  async deleteCharge(chargeId: string): Promise<string | undefined> {
    const response = await this.getChargeStatus(chargeId)

    if (!response) {
      return undefined
    }

    // Make sure charge has not been deleted yet (will otherwise end in error here and wont continue)
    if (
      response.statusResult.status !== ChargeStatusResultStatusEnum.Cancelled
    ) {
      const response = await this.api.chargerequestIDDELETE2({
        requestID: chargeId,
      })
      return response.receptionID
    }
  }

  async validateCharge(chargeToValidate: ChargeToValidate): Promise<boolean> {
    const response = await this.api.validatePOST5({
      input: chargeToValidate,
    })

    if (response.error) {
      throw new Error(
        response.error.errors?.[0]?.message ??
          response.error.message ??
          'Failed to validate charge',
      )
    }

    return true
  }

  async createCharge(upcomingPayment: Charge): Promise<ChargeResponse> {
    const response = await this.api.chargePOST1({
      input: {
        systemID: upcomingPayment.systemID,
        performingOrgID: upcomingPayment.performingOrgID,
        payeeNationalID: upcomingPayment.payeeNationalID,
        chargeType: upcomingPayment.chargeType,
        chargeItemSubject: upcomingPayment.chargeItemSubject,
        performerNationalID: upcomingPayment.performerNationalID,
        immediateProcess: upcomingPayment.immediateProcess,
        returnUrl: upcomingPayment.returnUrl,
        requestID: upcomingPayment.requestID,
        effictiveDate: upcomingPayment.effictiveDate,
        comment: upcomingPayment.comment,
        charges: upcomingPayment.charges,
        payInfo: upcomingPayment.payInfo
          ? {
              rRN: upcomingPayment.payInfo.RRN,
              cardType: upcomingPayment.payInfo.cardType,
              paymentMeans: upcomingPayment.payInfo.paymentMeans,
              authCode: upcomingPayment.payInfo.authCode,
              pAN: upcomingPayment.payInfo.PAN,
              payableAmount: upcomingPayment.payInfo.payableAmount,
            }
          : undefined,
        extraData: upcomingPayment.extraData
          ? upcomingPayment.extraData.map((x) => ({
              name: x.name,
              value: x.value,
            }))
          : undefined,
      },
    })

    if (!response?.chargeResult?.receptionID) {
      throw new Error(
        `POST chargePOST1 was not successful, response was: ${response.error?.code}`,
      )
    }

    return {
      user4: response.chargeResult.docNum,
      receptionID: response.chargeResult.receptionID,
    }
  }

  async getCatalogByPerformingOrg(
    performingOrganizationID: string,
  ): Promise<Catalog> {
    const response = await this.api.catalogperformingOrgperformingOrgIDGET3({
      performingOrgID: performingOrganizationID,
    })

    return {
      item: response.item.map((item) => ({
        performingOrgID: item.performingOrgID,
        chargeType: item.chargeType,
        chargeItemCode: item.chargeItemCode,
        chargeItemName: item.chargeItemName,
        priceAmount: item.priceAmount,
      })),
    }
  }
}
