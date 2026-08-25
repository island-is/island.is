import type { GetInterestBenefitData } from '@island.is/clients/rsk/calculators'
import { CalculatorResultRow } from '../../models/resultRow.model'
import { CalculatorModule } from '../../utils/calculatorModule'
import { buildCalculatorQuery } from '../../utils/parsing'
import { interestBenefitFields } from './interestBenefit.fields'
import { mapInterestBenefitResultToRows } from './interestBenefit.mapper'

export const interestBenefitCalculator: CalculatorModule = {
  fields: interestBenefitFields,
  calculate: async (client, input): Promise<CalculatorResultRow[]> => {
    const query = buildCalculatorQuery<GetInterestBenefitData['query']>(
      interestBenefitFields,
      input,
    )
    const result = await client.getInterestBenefit(query)
    return mapInterestBenefitResultToRows(result)
  },
}
