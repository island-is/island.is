import type { GetChildBenefitData } from '@island.is/clients/rsk/calculators'
import { CalculatorResultRow } from '../../models/resultRow.model'
import { CalculatorModule } from '../../utils/calculatorModule'
import { buildCalculatorQuery } from '../../utils/parsing'
import { childBenefitFields } from './childBenefit.fields'
import { mapChildBenefitResultToRows } from './childBenefit.mapper'

export const childBenefitCalculator: CalculatorModule = {
  fields: childBenefitFields,
  calculate: async (client, input): Promise<CalculatorResultRow[]> => {
    const query = buildCalculatorQuery<GetChildBenefitData['query']>(
      childBenefitFields,
      input,
    )
    const result = await client.getChildBenefit(query)
    return mapChildBenefitResultToRows(result)
  },
}
