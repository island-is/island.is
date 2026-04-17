import { Injectable } from '@nestjs/common'
import { CustomsCalculatorApi } from '@island.is/clients-rsk-customs-calculator'
import { CustomsCalculatorCalculationInput } from './dto/customsCalculatorCalculation.input'
import {
  CustomsCalculatorCalculationResponse,
  CustomsCalculatorProductCategoriesResponse,
  CustomsCalculatorUnitsResponse,
} from './models/customsCalculator.model'

@Injectable()
export class CustomsCalculatorService {
  constructor(private readonly customsCalculatorApi: CustomsCalculatorApi) {}

  async getProductCategories(): Promise<CustomsCalculatorProductCategoriesResponse> {
    const response = await this.customsCalculatorApi.getReiknivelVoruflokkar()
    const payload = response as Record<string, unknown>
    const data = (payload['Response'] ?? {}) as Record<string, unknown>
    const categories =
      ((data['Voruflokkar'] as Record<string, unknown>[] | undefined) ?? []).map(
        (item) => ({
          parentCategory: String(item['Yfirflokkur'] ?? ''),
          category: String(item['Voruflokkur'] ?? ''),
          tariffNumber: String(item['Tollnumer'] ?? ''),
          description: String(item['Lysing'] ?? ''),
        }),
      )

    return {
      status: this.mapStatus(payload),
      categories,
      errors: this.toNullableString(data['Villur']),
    }
  }

  async getUnits(
    tariffNumber: string,
    referenceDate: string,
  ): Promise<CustomsCalculatorUnitsResponse> {
    const response = await this.customsCalculatorApi.getReiknivelEiningar({
      tollskrarnumer: tariffNumber,
      vidmDags: referenceDate,
    })
    const payload = response as Record<string, unknown>
    const data = (payload['Response'] ?? {}) as Record<string, unknown>
    const unitsRaw = this.toNullableString(data['Einingar'])

    return {
      status: this.mapStatus(payload),
      units: unitsRaw ? unitsRaw.split(',').map((unit) => unit.trim()) : [],
      errors: this.toNullableString(data['Villur']),
    }
  }

  async calculate(
    input: CustomsCalculatorCalculationInput,
  ): Promise<CustomsCalculatorCalculationResponse> {
    const response = await this.customsCalculatorApi.postReiknivelUtreikningur({
      reiknivelUtreikningurRequest: {
        tollskrarnumer: input.tariffNumber,
        tollurKodi: input.customsCode,
        vidmDags: input.referenceDate,
        myntKodi: input.currencyCode,
        voruverd: input.productPrice,
        plastumbudirKg: input.plasticPackagingKg,
        pappaumbudirKg: input.cardboardPackagingKg,
        stykki: input.unitCount,
        nettoKg: input.netWeightKg,
        litrar: input.liters,
        prosenta: input.percentage,
        netNetKg: input.netNetWeightKg,
        sykur: input.sugar,
        saetuefni: input.sweetener,
        nedcUtblastur: input.nedcEmission,
        nedcVigtadUtblastur: input.nedcWeightedEmission,
        wltpUtblastur: input.wltpEmission,
        wltpVigtadUtblastur: input.wltpWeightedEmission,
        eiginThyngd: input.curbWeight,
      },
    })

    const payload = response as Record<string, unknown>
    const responseData = (payload['Response'] ?? {}) as Record<string, unknown>
    const linaGjald = (responseData['LinaGjald'] ?? {}) as Record<string, unknown>
    const firstLine = ((linaGjald['LinaGjaldLinur'] ?? []) as Record<
      string,
      unknown
    >[])[0]
    const charges =
      ((firstLine?.['LinaAlagningar'] ?? []) as Record<string, unknown>[]).map(
        (charge) => ({
          chargeType: this.toNullableString(charge['tegund']),
          code: this.toNullableString(charge['kodi']),
          name: this.toNullableString(charge['heiti']),
          amount: this.toNullableString(charge['bruttoupphaed']),
          netAmount: this.toNullableString(charge['nettoupphaed']),
          ratePercent: this.toNullableString(charge['TaxtiPros']),
          rateAmount: this.toNullableString(charge['TaxtiUpph']),
        }),
      )

    return {
      status: this.mapStatus(payload),
      lineCharge: {
        reportId: this.toNullableString(linaGjald['Skyrsla_ID']),
        currencyName: this.toNullableString(linaGjald['Mynt']),
        charges,
      },
      exchangeRate: this.toNullableString(responseData['Gengi']),
      errors: this.toNullableString(responseData['Villur']),
    }
  }

  private mapStatus(payload: Record<string, unknown>) {
    const status = (payload['status'] ?? {}) as Record<string, unknown>
    return {
      type: this.toNullableString(status['type']),
      code: this.toNullableString(status['code']),
      message: this.toNullableString(status['message']),
    }
  }

  private toNullableString(value: unknown): string | undefined {
    if (value === null || value === undefined || value === '') {
      return undefined
    }

    return String(value)
  }
}
