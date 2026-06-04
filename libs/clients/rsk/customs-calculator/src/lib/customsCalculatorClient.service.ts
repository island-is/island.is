import { Injectable } from '@nestjs/common'
import { DefaultApi } from '../../gen/fetch'

@Injectable()
export class CustomsCalculatorClientService {
  constructor(private readonly customsCalculatorApi: DefaultApi) {}

  async getProductCategories() {
    const response = await this.customsCalculatorApi.getReiknivelVoruflokkar()

    const payload = response as Record<string, unknown>
    const data = (payload['Response'] ?? {}) as Record<string, unknown>
    const categories = (
      (data['Voruflokkar'] as Record<string, unknown>[] | undefined) ?? []
    ).map((item) => ({
      parentCategory: String(item['Yfirflokkur'] ?? ''),
      label: String(item['Voruflokkur'] ?? ''),
      tariffNumber: String(item['Tollnumer'] ?? ''),
      description: String(item['Lysing'] ?? ''),
    }))

    return categories
  }
}
