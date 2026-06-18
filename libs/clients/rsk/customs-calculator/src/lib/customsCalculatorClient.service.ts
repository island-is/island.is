import { Inject, Injectable } from '@nestjs/common'
import {
  getReiknivelVoruflokkar,
  getReiknivelEiningar,
  postReiknivelUtreikningur,
} from '../../gen/fetch'
import type { client as Client } from '../../gen/fetch/client.gen'
import { CUSTOMS_CALCULATOR_CLIENT } from './customsCalculator.apiConfig'

@Injectable()
export class CustomsCalculatorClientService {
  constructor(
    @Inject(CUSTOMS_CALCULATOR_CLIENT)
    private readonly client: typeof Client,
  ) {}

  async getProductCategories() {
    const { data: payload } = (await getReiknivelVoruflokkar({
      client: this.client,
    })) as {
      data?: {
        Response?: {
          Voruflokkar?: {
            Yfirflokkur?: string
            Voruflokkur?: string
            Tollnumer?: string
            Lysing?: string
          }[]
        }
      }
    }

    return (
      (payload?.Response?.Voruflokkar ?? [])
        .filter((item) => Boolean(item.Voruflokkur) && Boolean(item.Tollnumer))
        .map((item) => ({
          parentLabel: String(item.Yfirflokkur ?? '').trim(),
          label: String(item.Voruflokkur ?? '').trim(),
          tariffNumber: String(item.Tollnumer ?? '').trim(),
          description: String(item.Lysing ?? '').trim(),
        })) ?? []
    )
  }

  async getProductCategoryUnits(tariffNumber: string, referenceDate: string) {
    const { data: payload } = (await getReiknivelEiningar({
      query: {
        vidmDags: referenceDate,
        tollskrarnumer: tariffNumber,
      },
      client: this.client,
    })) as {
      data?: {
        Response?: {
          Einingar?: string
          Villur?: string
        }
      }
    }

    return (
      payload?.Response?.Einingar?.split(',')
        ?.map((u) => u?.trim() ?? '')
        ?.filter(Boolean) ?? []
    )
  }

  async calculate(input: {
    tariffNumber: string
    referenceDate: string
    currencyCode: string
    priceWithShipping: string
    plasticPackagingKg: string
    cardboardPackagingKg: string
    unitCount: string
    netWeightKg: string
    liters: string
    percentage: string
    netNetWeightKg: string
    sugar: string
    sweetener: string
    nedcEmission: string
    nedcWeightedEmission: string
    wltpEmission: string
    wltpWeightedEmission: string
    curbWeight: string
    customsCode: string
  }) {
    const response = await postReiknivelUtreikningur({
      body: {
        tollskrarnumer: input.tariffNumber,
        vidmDags: input.referenceDate,
        eiginThyngd: input.curbWeight,
        litrar: input.liters,
        myntKodi: input.currencyCode,
        netNetKg: input.netNetWeightKg,
        nettoKg: input.netWeightKg,
        plastumbudirKg: input.plasticPackagingKg,
        pappaumbudirKg: input.cardboardPackagingKg,
        prosenta: input.percentage,
        stykki: input.unitCount,
        sykur: input.sugar,
        tollurKodi: input.customsCode,
        voruverd: input.priceWithShipping,
        wltpUtblastur: input.wltpEmission,
        wltpVigtadUtblastur: input.wltpWeightedEmission,
        nedcUtblastur: input.nedcEmission,
        nedcVigtadUtblastur: input.nedcWeightedEmission,
        saetuefni: input.sweetener,
      },
      client: this.client,
    })

    const data = response?.data as {
      Response: {
        LinaGjald: {
          LinaGjaldLinur: [
            {
              Tollverd_ISK: string
              LinaAlagningar: {
                kodi: string
                heiti: string
                TegTexti: string
                TaxtiPros: string
                TaxtiUpph: string
                bruttoupphaed: string
                nettoupphaed: string
              }[]
            },
          ]
        }
      }
    }

    let additionalAmount = 0

    const charges: {
      code: string
      description: string
      percentage: string
      unit: string
      amount: string
    }[] = []

    for (const line of data?.Response?.LinaGjald?.LinaGjaldLinur ?? []) {
      for (const charge of line?.LinaAlagningar ?? []) {
        const amount = Number(charge.bruttoupphaed)
        if (Number.isNaN(amount)) continue
        additionalAmount += amount
        charges.push({
          code: charge.kodi,
          description: charge.heiti,
          percentage: charge.TaxtiPros,
          unit: charge.TegTexti,
          amount: charge.bruttoupphaed,
        })
      }
    }

    return {
      startAmount: input.priceWithShipping,
      additionalAmount: additionalAmount.toString(),
      totalAmount: (
        additionalAmount + Number(input.priceWithShipping)
      ).toString(),
      charges,
    }
  }
}
