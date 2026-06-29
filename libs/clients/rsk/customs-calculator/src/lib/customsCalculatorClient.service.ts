import Decimal from 'decimal.js'
import { Inject, Injectable } from '@nestjs/common'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import {
  getReiknivelVoruflokkar,
  getReiknivelEiningar,
  postReiknivelUtreikningur,
} from '../../gen/fetch'
import type { client as Client } from '../../gen/fetch/client.gen'
import { CUSTOMS_CALCULATOR_CLIENT } from './customsCalculator.apiConfig'

/**
 * Parses a numeric string as returned by RSK into a Decimal.
 *
 * RSK is not guaranteed to return clean machine-readable numbers, so we
 * normalize Icelandic/locale formatting before parsing:
 *  - whitespace (incl. non-breaking space) used as a thousands separator
 *  - ',' as the decimal separator (is-IS), e.g. "1.234,56" -> 1234.56
 *  - repeated '.'/',' used purely as thousands separators
 *
 * Throws if the value cannot be parsed as a
 * number, so callers can decide
 * how to handle an unparseable line rather than silently producing NaN.
 */
export const parseRskAmount = (
  raw: string | number | null | undefined,
): Decimal => {
  if (raw === null || raw === undefined) return new Decimal(0)
  if (typeof raw === 'number') return new Decimal(raw)

  // \s also matches the non-breaking space RSK may use for digit grouping.
  let value = raw.replace(/\s/g, '')
  if (!value) return new Decimal(0)

  const hasComma = value.includes(',')
  const hasDot = value.includes('.')

  if (hasComma && hasDot) {
    // is-IS grouping: '.' thousands, ',' decimal -> "1.234,56" => "1234.56"
    value = value.replace(/\./g, '').replace(',', '.')
  } else if (hasComma) {
    const commaCount = (value.match(/,/g) ?? []).length
    // A single comma is a decimal separator; multiple are grouping.
    value = commaCount > 1 ? value.replace(/,/g, '') : value.replace(',', '.')
  } else if (hasDot) {
    const dotCount = (value.match(/\./g) ?? []).length
    // Multiple dots can only be grouping (a single dot is left as decimal).
    if (dotCount > 1) value = value.replace(/\./g, '')
  }

  // Decimal throws (DecimalError) on anything it cannot parse.
  return new Decimal(value)
}

@Injectable()
export class CustomsCalculatorClientService {
  constructor(
    @Inject(CUSTOMS_CALCULATOR_CLIENT)
    private readonly client: typeof Client,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
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

    return (payload?.Response?.Voruflokkar ?? [])
      .filter((item) => Boolean(item.Voruflokkur) && Boolean(item.Tollnumer))
      .map((item) => ({
        parentLabel: String(item.Yfirflokkur ?? '').trim(),
        label: String(item.Voruflokkur ?? '').trim(),
        tariffNumber: String(item.Tollnumer ?? '').trim(),
        description: String(item.Lysing ?? '').trim(),
      }))
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
        voruverd: input.priceWithShipping || '0',
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

    // Round each charge once, then derive the totals from those rounded
    // values, so the displayed breakdown always reconciles exactly with the
    // displayed totals (rounding the components and the sum independently can
    // leave them off by a few krónur).
    let additionalAmount = new Decimal(0)
    let hasUnparseableCharge = false

    const charges: {
      code: string
      description: string
      percentage: number | undefined
      unit: string
      amount: number
    }[] = []

    for (const line of data?.Response?.LinaGjald?.LinaGjaldLinur ?? []) {
      for (const charge of line?.LinaAlagningar ?? []) {
        if (!charge.bruttoupphaed) continue
        let amount: Decimal
        try {
          amount = parseRskAmount(charge.bruttoupphaed).round()
        } catch (error) {
          // Don't silently drop the line: a discarded charge understates the
          // total with no indication to the user. Flag it so we can surface a
          // "couldn't compute" state and leave a breadcrumb in the logs.
          hasUnparseableCharge = true
          this.logger.warn('Skipping customs charge with unparseable amount', {
            code: charge.kodi,
            bruttoupphaed: charge.bruttoupphaed,
            error: error instanceof Error ? error.message : String(error),
          })
          continue
        }

        const percentage = Number(charge.TaxtiPros)
        additionalAmount = additionalAmount.plus(amount)
        charges.push({
          code: charge.kodi,
          description: charge.heiti,
          percentage: Number.isFinite(percentage) ? percentage : undefined,
          unit: charge.TegTexti,
          amount: amount.toNumber(),
        })
      }
    }

    let startAmount: Decimal
    try {
      startAmount = parseRskAmount(
        data?.Response?.LinaGjald?.LinaGjaldLinur?.[0]?.Tollverd_ISK,
      ).round()
    } catch (error) {
      hasUnparseableCharge = true
      this.logger.warn(
        'Customs calculation returned an unparseable customs value',
        {
          tariffNumber: input.tariffNumber,
          error: error instanceof Error ? error.message : String(error),
        },
      )
      startAmount = new Decimal(0)
    }

    return {
      startAmount: startAmount.toNumber(),
      additionalAmount: additionalAmount.toNumber(),
      totalAmount: startAmount.plus(additionalAmount).toNumber(),
      hasUnparseableCharge,
      charges,
    }
  }
}
