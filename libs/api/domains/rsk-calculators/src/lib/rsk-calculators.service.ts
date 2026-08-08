import { BadRequestException, Injectable } from '@nestjs/common'
import { ReiknivelarClientService } from '@island.is/clients/rsk/reiknivelar'
import type {
  GetApiBarnabaeturData,
  GetApiStadgreidslaData,
} from '@island.is/clients/rsk/reiknivelar'
import { CalculatorField } from './models/field.model'
import { CalculatorResultRow } from './models/resultRow.model'
import { CalculatorInputValue } from './dto/inputValue.input'
import { RskCalculatorType } from './models/enums'
import {
  buildCalculatorQuery,
  getCalculatorFields,
  mapBarnabaeturResultToRows,
  mapStadgreidslaResultToRows,
} from './mapper'

@Injectable()
export class RskCalculatorsService {
  constructor(private readonly reiknivelarService: ReiknivelarClientService) {}

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
          NonNullable<GetApiStadgreidslaData['query']>
        >(calculatorType, input)
        const result = await this.reiknivelarService.getStadgreidsla(query)
        return mapStadgreidslaResultToRows(result)
      }
      case RskCalculatorType.CHILD_BENEFIT: {
        const query = buildCalculatorQuery<GetApiBarnabaeturData['query']>(
          calculatorType,
          input,
        )
        const result = await this.reiknivelarService.getBarnabaetur(query)
        return mapBarnabaeturResultToRows(result)
      }
      default:
        throw new BadRequestException(
          `Unsupported calculator type: ${calculatorType}`,
        )
    }
  }
}
