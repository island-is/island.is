import type { GetWithholdingTaxData } from '@island.is/clients/rsk/calculators'
import { CalculatorResultRow } from '../../models/resultRow.model'
import { CalculatorModule } from '../../utils/calculatorModule'
import { buildCalculatorQuery } from '../../utils/parsing'
import { withholdingTaxFields } from './withholdingTax.fields'
import { mapWithholdingTaxResultToRows } from './withholdingTax.mapper'

export const withholdingTaxCalculator: CalculatorModule = {
  fields: withholdingTaxFields,
  calculate: async (client, input): Promise<CalculatorResultRow[]> => {
    const query = buildCalculatorQuery<
      NonNullable<GetWithholdingTaxData['query']>
    >(withholdingTaxFields, input)
    const result = await client.getWithholdingTax(query)
    return mapWithholdingTaxResultToRows(result)
  },
}
