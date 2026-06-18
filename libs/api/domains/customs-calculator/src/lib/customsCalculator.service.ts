import { Injectable } from '@nestjs/common'
import sanitizeHtml from 'sanitize-html'
import { sortAlpha } from '@island.is/shared/utils'
import { CustomsCalculatorClientService } from '@island.is/clients-rsk-customs-calculator'
import {
  BottomLevelProductCategory,
  CustomsCalculatorProductCategoriesResponse,
} from './models/customsCalculator.model'
import { CustomsCalculatorCalculationInput } from './dto/customsCalculatorCalculation.input'

@Injectable()
export class CustomsCalculatorService {
  constructor(
    private readonly customsCalculatorClient: CustomsCalculatorClientService,
  ) {}

  async getProductCategories(): Promise<CustomsCalculatorProductCategoriesResponse> {
    const allCategories = (
      await this.customsCalculatorClient.getProductCategories()
    ).map((category) => ({
      ...category,
      description: sanitizeHtml(category.description ?? ''),
      id: crypto.randomUUID(),
    }))

    let topLevelCategories: CustomsCalculatorProductCategoriesResponse['topLevel'][number][] =
      allCategories.map((category) => ({
        ...category,
        children: [],
      }))

    for (let i = 0; i < topLevelCategories.length; i++) {
      const a = topLevelCategories[i]
      for (let j = 0; j < topLevelCategories.length; j++) {
        if (i === j) continue
        const b = topLevelCategories[j]
        if (a.label === b.parentLabel) a.children.push(b)
      }
      a.children.sort(sortAlpha('label'))
    }

    topLevelCategories.sort(sortAlpha('label'))
    topLevelCategories = topLevelCategories.filter(
      (category) => !category.parentLabel,
    )

    const bottomLevelCategories: BottomLevelProductCategory[] = allCategories
      .filter(
        (category) => !!category.tariffNumber && category.tariffNumber !== '#',
      )
      .map((category) => ({
        ...category,
        parentLabels: [category.parentLabel],
      }))

    for (const bottomLevelCategory of bottomLevelCategories) {
      let currentLabel = bottomLevelCategory.parentLabels[0]
      while (currentLabel) {
        let found = false
        for (const category of allCategories) {
          if (category.id === bottomLevelCategory.id) continue
          if (category.label === currentLabel) {
            currentLabel = category.parentLabel
            if (currentLabel)
              bottomLevelCategory.parentLabels.unshift(currentLabel)
            found = true
            break
          }
        }
        if (!found) break
      }
    }

    bottomLevelCategories.sort(sortAlpha('label'))

    return {
      topLevel: topLevelCategories,
      bottomLevel: bottomLevelCategories,
    }
  }

  async getProductCategoryUnits(tariffNumber: string) {
    const referenceDate = `${new Date().toISOString().split('.')[0]}Z`
    const units = await this.customsCalculatorClient.getProductCategoryUnits(
      tariffNumber,
      referenceDate,
    )

    return {
      units,
    }
  }

  async calculate(input: CustomsCalculatorCalculationInput) {
    const referenceDate = `${new Date().toISOString().split('.')[0]}Z`
    const response = await this.customsCalculatorClient.calculate({
      tariffNumber: input.tariffNumber,
      currencyCode: input.currencyCode,
      priceWithShipping: input.priceWithShipping ?? '',
      unitCount: input.unitCount ?? '',
      netWeightKg: input.netWeightKg ?? '',
      liters: input.liters ?? '',
      percentage: input.percentage ?? '',
      nedcEmission: input.nedcEmission ?? '',
      nedcWeightedEmission: input.nedcWeightedEmission ?? '',
      wltpEmission: input.wltpEmission ?? '',
      wltpWeightedEmission: input.wltpWeightedEmission ?? '',
      cardboardPackagingKg: '',
      referenceDate,
      curbWeight: '',
      customsCode: '',
      netNetWeightKg: '',
      plasticPackagingKg: '',
      sugar: '',
      sweetener: '',
    })

    return response
  }
}
