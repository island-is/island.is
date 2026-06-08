import { Injectable } from '@nestjs/common'
import { DefaultApi } from '../../gen/fetch'

@Injectable()
export class CustomsCalculatorClientService {
  constructor(private readonly customsCalculatorApi: DefaultApi) {}

  async getProductCategories() {
    const payload =
      (await this.customsCalculatorApi.getReiknivelVoruflokkar()) as {
        Response?: {
          Voruflokkar?: {
            Yfirflokkur?: string
            Voruflokkur?: string
            Tollnumer?: string
            Lysing?: string
          }[]
        }
      }

    return (
      (payload?.Response?.Voruflokkar ?? [])
        .filter((item) => Boolean(item.Voruflokkur) && Boolean(item.Tollnumer))
        .map((item) => ({
          parentLabel: String(item.Yfirflokkur ?? ''),
          label: String(item.Voruflokkur ?? ''),
          tariffNumber: String(item.Tollnumer ?? ''),
          description: String(item.Lysing ?? ''),
        })) ?? []
    )
  }

  // async getUnits(tariffNumber: string, referenceDate: string) {
  //   const payload = (await this.customsCalculatorApi.getReiknivelEiningar({
  //     tollskrarnumer: tariffNumber,
  //     vidmDags: referenceDate,
  //   })) as {
  //     Response?: {
  //       Einingar?: string
  //       Villur?: string
  //     }
  //   }
  //   const data = (payload['Response'] ?? {}) as Record<string, unknown>
  //   const unitsRaw = this.toNullableString(data['Einingar'])

  //   return {
  //     status: this.mapStatus(payload),
  //     units: unitsRaw ? unitsRaw.split(',').map((unit) => unit.trim()) : [],
  //     errors: this.toNullableString(data['Villur']),
  //   }
  // }
}
