import { Inject, Injectable } from '@nestjs/common'
import {
  getReiknivelVoruflokkar,
  getReiknivelEiningar,
} from '../../gen/fetch'
import type { Client } from '../../gen/fetch/client.gen'
import { CUSTOMS_CALCULATOR_CLIENT } from './customsCalculator.apiConfig'

@Injectable()
export class CustomsCalculatorClientService {
  constructor(
    @Inject(CUSTOMS_CALCULATOR_CLIENT) private readonly client: Client,
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

    return payload?.Response?.Einingar
  }
}
