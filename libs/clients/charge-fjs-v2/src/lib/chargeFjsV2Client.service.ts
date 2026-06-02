import { Inject, Injectable } from '@nestjs/common'
import {
  CatalogperformingOrgperformingOrgIDGET3Request,
  ChargeStatusByRequestIDrequestIDGETResponse,
  ChargeStatusResultStatusEnum,
  DefaultApi,
  PayInfoPaymentMeansEnum as GenPayInfoPaymentMeansEnum,
} from '../../gen/fetch'
import {
  Catalog,
  Charge,
  ChargeResponse,
  ChargeToValidate,
  PayeeInfo,
} from './chargeFjsV2Client.types'
import { isValid } from 'kennitala'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

@Injectable()
export class ChargeFjsV2ClientService {
  constructor(
    private api: DefaultApi,
    @Inject(LOGGER_PROVIDER) private logger: Logger,
  ) {}

  async getChargeStatus(
    chargeId: string,
  ): Promise<ChargeStatusByRequestIDrequestIDGETResponse | null> {
    try {
      return await this.api.chargeStatusByRequestIDrequestIDGET4({
        requestID: chargeId,
      })
    } catch (e) {
      if (e.status === 404) {
        this.logger.warn(
          `Did not find charge ${chargeId} in FJS database. No charge status returned`,
          e,
        )
        return null
      }
      throw e
    }
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
    // Card-payment safety net: with the card-only payInfo fields now optional on
    // the hand-written type (to allow Millifærsla / bank transfer), a card call
    // missing any of them would silently send '' to FJS instead of being a compile
    // error. Refuse at runtime until the generated client is regenerated.
    if (
      upcomingPayment.payInfo &&
      (upcomingPayment.payInfo.paymentMeans === 'Kreditkort' ||
        upcomingPayment.payInfo.paymentMeans === 'Debetkort')
    ) {
      const { RRN, cardType, authCode, PAN } = upcomingPayment.payInfo
      if (!RRN || !cardType || !authCode || !PAN) {
        throw new Error(
          'createCharge: card payInfo missing required field(s) (RRN/cardType/authCode/PAN) — refusing to send empty strings to FJS',
        )
      }
    }

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
        // TODO(fjs-spec): once FJS ships their spec update and `gen/fetch` is
        // regenerated against it, drop the bridges below:
        //   1. The four `?? ''` defaults — card-only fields will be optional
        //      on the generated model, matching our hand-written type.
        //   2. The `as unknown as GenPayInfoPaymentMeansEnum` cast — the
        //      generated enum will include `Millifærsla`.
        //   3. The runtime card-field assertion above — the regenerated types
        //      will once again make missing card fields a compile error.
        payInfo: upcomingPayment.payInfo
          ? {
              // The card-only fields are optional on our type (omitted for bank transfers) but the
              // generated model still requires them; default to '' until the client is regenerated
              // against the updated FJS spec. The card path's runtime assertion above ensures these
              // defaults are never actually hit for card calls.
              rRN: upcomingPayment.payInfo.RRN ?? '',
              cardType: upcomingPayment.payInfo.cardType ?? '',
              // The generated enum lacks the bank-transfer value until the client is regenerated against
              // the updated FJS spec; the value is a valid string at runtime.
              paymentMeans: upcomingPayment.payInfo
                .paymentMeans as unknown as GenPayInfoPaymentMeansEnum,
              authCode: upcomingPayment.payInfo.authCode ?? '',
              pAN: upcomingPayment.payInfo.PAN ?? '',
              payableAmount: upcomingPayment.payInfo.payableAmount,
              correlationId: upcomingPayment.payInfo.correlationId,
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

  async getCatalogByPerformingOrg({
    performingOrgID,
    chargeType,
    chargeItemCode,
    paymentOptions,
  }: CatalogperformingOrgperformingOrgIDGET3Request): Promise<Catalog> {
    const response = await this.api.catalogperformingOrgperformingOrgIDGET3({
      performingOrgID,
      chargeType,
      chargeItemCode,
      paymentOptions,
    })

    return {
      item: response.item.map((item) => ({
        performingOrgID: item.performingOrgID,
        chargeType: item.chargeType,
        chargeItemCode: item.chargeItemCode,
        chargeItemName: item.chargeItemName,
        priceAmount: item.priceAmount,
        paymentOptions: item.paymentOptions
          ? item.paymentOptions.split(',').filter(Boolean)
          : undefined,
      })),
    }
  }

  async getPayeeInfo(payeeNationalId: string): Promise<PayeeInfo> {
    if (!payeeNationalId) {
      throw new Error('Payee national ID is required')
    }

    if (!isValid(payeeNationalId)) {
      throw new Error('Invalid payee national ID')
    }

    try {
      const response = await this.api.payeeInfonationalIDGET6({
        nationalID: payeeNationalId,
      })

      if (response.error) {
        throw new Error(
          `Failed to get payee info [${response.error.code}] ${response.error.message}`,
        )
      }

      if (!response || !response.payeeInfo) {
        throw new Error('Payee info not found in response')
      }

      return {
        nationalId: response.payeeInfo.nationalID,
        name: response.payeeInfo.name,
        address: response.payeeInfo.address,
        zip: response.payeeInfo.postcode,
        city: response.payeeInfo.city,
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }

      throw new Error(`Unexpected error while fetching payee info: ${error}`)
    }
  }
}
