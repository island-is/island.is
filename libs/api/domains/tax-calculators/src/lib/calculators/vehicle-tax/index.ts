import type { GetVehicleTaxData } from '@island.is/clients/rsk/calculators'
import { CalculatorResultRow } from '../../models/resultRow.model'
import { CalculatorModule } from '../../utils/calculatorModule'
import { buildCalculatorQuery } from '../../utils/parsing'
import { vehicleTaxFields } from './vehicleTax.fields'
import { mapVehicleTaxResultToRows } from './vehicleTax.mapper'

export const vehicleTaxCalculator: CalculatorModule = {
  fields: vehicleTaxFields,
  calculate: async (client, input): Promise<CalculatorResultRow[]> => {
    const query = buildCalculatorQuery<GetVehicleTaxData['query']>(
      vehicleTaxFields,
      input,
    )
    const result = await client.getVehicleTax(query)
    return mapVehicleTaxResultToRows(result)
  },
}
