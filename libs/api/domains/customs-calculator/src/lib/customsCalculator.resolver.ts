import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { CustomsCalculatorCalculationInput } from './dto/customsCalculatorCalculation.input'
import {
  CustomsCalculatorCalculationResponse,
  CustomsCalculatorProductCategoriesResponse,
  CustomsCalculatorUnitsResponse,
} from './models/customsCalculator.model'
import { CustomsCalculatorService } from './customsCalculator.service'

@Resolver()
export class CustomsCalculatorResolver {
  constructor(private readonly customsCalculatorService: CustomsCalculatorService) {}

  @Query(() => CustomsCalculatorProductCategoriesResponse, {
    name: 'customsCalculatorProductCategories',
  })
  getProductCategories(): Promise<CustomsCalculatorProductCategoriesResponse> {
    return this.customsCalculatorService.getProductCategories()
  }

  @Query(() => CustomsCalculatorUnitsResponse, { name: 'customsCalculatorUnits' })
  getUnits(
    @Args('tariffNumber') tariffNumber: string,
    @Args('referenceDate') referenceDate: string,
  ): Promise<CustomsCalculatorUnitsResponse> {
    return this.customsCalculatorService.getUnits(tariffNumber, referenceDate)
  }

  @Mutation(() => CustomsCalculatorCalculationResponse, {
    name: 'customsCalculatorCalculate',
  })
  calculate(
    @Args('input') input: CustomsCalculatorCalculationInput,
  ): Promise<CustomsCalculatorCalculationResponse> {
    return this.customsCalculatorService.calculate(input)
  }
}
