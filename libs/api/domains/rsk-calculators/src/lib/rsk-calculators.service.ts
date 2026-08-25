import { BadRequestException, Injectable } from '@nestjs/common'
import { CalculatorsClientService } from '@island.is/clients/rsk/calculators'
import type {
  GetChildBenefitData,
  GetVehicleTaxData,
  GetVehicleBenefitData,
  GetWithholdingTaxData,
} from '@island.is/clients/rsk/calculators'
import { CalculatorField } from './models/field.model'
import { CalculatorResultRow } from './models/resultRow.model'
import { CalculatorInputValue } from './dto/inputValue.input'
import { RskCalculatorType } from './models/enums'
import {
  buildCalculatorQuery,
  getCalculatorFields,
  mapBarnabaeturResultToRows,
  mapBifreidagjoldResultToRows,
  mapBifreidahlunnindiResultToRows,
  mapStadgreidslaResultToRows,
} from './mapper'

@Injectable()
export class RskCalculatorsService {
  constructor(private readonly calculatorsService: CalculatorsClientService) {}

  getFields(calculatorType: RskCalculatorType): CalculatorField[] {
    return getCalculatorFields(calculatorType)
  }

  async calculate(
    calculatorType: RskCalculatorType,
    input: CalculatorInputValue[],
  ): Promise<CalculatorResultRow[]> {
    switch (calculatorType) {
      case RskCalculatorType.WITHHOLDING_TAX_ON_WAGES: {
        const query = buildCalculatorQuery<
          NonNullable<GetWithholdingTaxData['query']>
        >(calculatorType, input)
        const result = await this.calculatorsService.getWithholdingTax(query)
        return mapStadgreidslaResultToRows(result)
      }
      case RskCalculatorType.CHILD_BENEFIT: {
        const query = buildCalculatorQuery<GetChildBenefitData['query']>(
          calculatorType,
          input,
        )
        const result = await this.calculatorsService.getChildBenefit(query)
        return mapBarnabaeturResultToRows(result)
      }
      case RskCalculatorType.VEHICLE_TAX: {
        const query = buildCalculatorQuery<GetVehicleTaxData['query']>(
          calculatorType,
          input,
        )
        const result = await this.calculatorsService.getVehicleTax(query)
        return mapBifreidagjoldResultToRows(result)
      }
      case RskCalculatorType.VEHICLE_BENEFIT: {
        const query = buildCalculatorQuery<GetVehicleBenefitData['query']>(
          calculatorType,
          input,
        )
        const result = await this.calculatorsService.getVehicleBenefit(query)
        return mapBifreidahlunnindiResultToRows(result)
      }
      default:
        throw new BadRequestException(
          `Unsupported calculator type: ${calculatorType}`,
        )
    }
  }
}
