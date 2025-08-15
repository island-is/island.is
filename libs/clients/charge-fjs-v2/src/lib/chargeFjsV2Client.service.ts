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

// TODO: Remove this once we have a real catalog
const LANDSPITALI_PERFORMING_ORG_ID = '5003002130'
const LANDSPITALI_MOCK_CATALOG: Catalog['item'] =
  // Minningarkort
  [
    {
      performingOrgID: LANDSPITALI_PERFORMING_ORG_ID,
      chargeType: 'memorialCard',
      chargeItemCode: 'MR124',
      chargeItemName: 'Minningargjafasjóður Landspítala Íslands',
      priceAmount: 1000,
    },
    {
      performingOrgID: LANDSPITALI_PERFORMING_ORG_ID,
      chargeType: 'memorialCard',
      chargeItemCode: 'MR119',
      chargeItemName: 'Minningarsjóður blóð- og krabbameinslækningadeilda',
      priceAmount: 1000,
    },
    {
      performingOrgID: LANDSPITALI_PERFORMING_ORG_ID,
      chargeType: 'memorialCard',
      chargeItemCode: 'MR108',
      chargeItemName: 'Minningarsjóður gjörgæslu',
      priceAmount: 1000,
    },
    {
      performingOrgID: LANDSPITALI_PERFORMING_ORG_ID,
      chargeType: 'memorialCard',
      chargeItemCode: 'MR122',
      chargeItemName: 'Minningarsjóður hjartadeildar',
      priceAmount: 1000,
    },
    {
      performingOrgID: LANDSPITALI_PERFORMING_ORG_ID,
      chargeType: 'memorialCard',
      chargeItemCode: 'MR117',
      chargeItemName: 'Minningarsjóður kvenlækningadeildar',
      priceAmount: 1000,
    },
    {
      performingOrgID: LANDSPITALI_PERFORMING_ORG_ID,
      chargeType: 'memorialCard',
      chargeItemCode: 'MR128',
      chargeItemName: 'Minningarsjóður líknardeildar og HERU',
      priceAmount: 1000,
    },
    {
      performingOrgID: LANDSPITALI_PERFORMING_ORG_ID,
      chargeType: 'memorialCard',
      chargeItemCode: 'MR109',
      chargeItemName: 'Minningarsjóður lyflækningadeilda',
      priceAmount: 1000,
    },
    {
      performingOrgID: LANDSPITALI_PERFORMING_ORG_ID,
      chargeType: 'memorialCard',
      chargeItemCode: 'MR131',
      chargeItemName:
        'Minningarsjóður Rannsóknarstofu HÍ og LSH í öldrunarfræðum',
      priceAmount: 1000,
    },
    {
      performingOrgID: LANDSPITALI_PERFORMING_ORG_ID,
      chargeType: 'memorialCard',
      chargeItemCode: 'MR121',
      chargeItemName: 'Minningarsjóður skurðdeildar',
      priceAmount: 1000,
    },
    {
      performingOrgID: LANDSPITALI_PERFORMING_ORG_ID,
      chargeType: 'memorialCard',
      chargeItemCode: 'MR118',
      chargeItemName: 'Minningarsjóður öldrunardeildar',
      priceAmount: 1000,
    },
  ].concat(
    // Beinir styrkir
    [
      {
        performingOrgID: LANDSPITALI_PERFORMING_ORG_ID,
        chargeType: 'directGrant',
        chargeItemCode: 'MR106',
        chargeItemName: 'Styrktarsjóður barna- og unglingageðdeildar',
        priceAmount: 1000,
      },
      {
        performingOrgID: LANDSPITALI_PERFORMING_ORG_ID,
        chargeType: 'directGrant',
        chargeItemCode: 'MR105',
        chargeItemName: 'Styrktarsjóður Barnaspítala Hringsins',
        priceAmount: 1000,
      },
      {
        performingOrgID: LANDSPITALI_PERFORMING_ORG_ID,
        chargeType: 'directGrant',
        chargeItemCode: 'MR133',
        chargeItemName: 'Styrktarsjóður Blóðbankans',
        priceAmount: 1000,
      },
      {
        performingOrgID: LANDSPITALI_PERFORMING_ORG_ID,
        chargeType: 'directGrant',
        chargeItemCode: 'MR104',
        chargeItemName: 'Styrktarsjóður bráðasviðs',
        priceAmount: 1000,
      },
      {
        performingOrgID: LANDSPITALI_PERFORMING_ORG_ID,
        chargeType: 'directGrant',
        chargeItemCode: 'MR112',
        chargeItemName: 'Styrktarsjóður endurhæfingar',
        priceAmount: 1000,
      },
      {
        performingOrgID: LANDSPITALI_PERFORMING_ORG_ID,
        chargeType: 'directGrant',
        chargeItemCode: 'MR103',
        chargeItemName: 'Styrktarsjóður geðsviðs',
        priceAmount: 1000,
      },
      {
        performingOrgID: LANDSPITALI_PERFORMING_ORG_ID,
        chargeType: 'directGrant',
        chargeItemCode: 'MR110',
        chargeItemName: 'Styrktarsjóður gjörgæslu',
        priceAmount: 1000,
      },
      {
        performingOrgID: LANDSPITALI_PERFORMING_ORG_ID,
        chargeType: 'directGrant',
        chargeItemCode: 'MR130',
        chargeItemName: 'Styrktarsjóður hjartadeildar',
        priceAmount: 1000,
      },
      {
        performingOrgID: LANDSPITALI_PERFORMING_ORG_ID,
        chargeType: 'directGrant',
        chargeItemCode: 'MR125',
        chargeItemName: 'Styrktarsjóður kvenna- og fæðingardeildar',
        priceAmount: 1000,
      },
      {
        performingOrgID: LANDSPITALI_PERFORMING_ORG_ID,
        chargeType: 'directGrantFee',
        chargeItemCode: 'MR101',
        chargeItemName: 'Styrktarsjóður Landspítala',
        priceAmount: 500,
      },
      {
        performingOrgID: LANDSPITALI_PERFORMING_ORG_ID,
        chargeType: 'directGrant',
        chargeItemCode: 'MR111',
        chargeItemName: 'Styrktarsjóður lyflækningadeilda',
        priceAmount: 1000,
      },
      {
        performingOrgID: LANDSPITALI_PERFORMING_ORG_ID,
        chargeType: 'directGrant',
        chargeItemCode: 'MR115',
        chargeItemName: 'Styrktarsjóður myndgreininga',
        priceAmount: 1000,
      },
      {
        performingOrgID: LANDSPITALI_PERFORMING_ORG_ID,
        chargeType: 'directGrant',
        chargeItemCode: 'MR114',
        chargeItemName: 'Styrktarsjóður rannsóknarstofa',
        priceAmount: 1000,
      },
      {
        performingOrgID: LANDSPITALI_PERFORMING_ORG_ID,
        chargeType: 'directGrant',
        chargeItemCode: 'MR107',
        chargeItemName: 'Styrktarsjóður skurðlækningadeildar',
        priceAmount: 1000,
      },
      {
        performingOrgID: LANDSPITALI_PERFORMING_ORG_ID,
        chargeType: 'directGrant',
        chargeItemCode: 'MR113',
        chargeItemName: 'Styrktarsjóður öldrunar',
        priceAmount: 1000,
      },
    ],
  )

@Injectable()
export class ChargeFjsV2ClientService {
  constructor(private api: DefaultApi) {}

  async getChargeStatus(
    chargeId: string,
  ): Promise<ChargeStatusByRequestIDrequestIDGETResponse | null> {
    try {
      const response = await this.api.chargeStatusByRequestIDrequestIDGET4({
        requestID: chargeId,
      })

      return response
    } catch (e) {
      if (e.status === 404) {
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
    // TODO: Remove this once we have a real catalog
    if (performingOrganizationID === LANDSPITALI_PERFORMING_ORG_ID) {
      return {
        item: LANDSPITALI_MOCK_CATALOG,
      }
    }

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
