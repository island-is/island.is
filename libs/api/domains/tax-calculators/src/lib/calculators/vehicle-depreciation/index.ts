import type { GetVehicleDepreciationData } from '@island.is/clients/rsk/calculators'
import { CalculatorResultRow } from '../../models/resultRow.model'
import { CalculatorModule } from '../../utils/calculatorModule'
import { buildCalculatorQuery } from '../../utils/parsing'
import { vehicleDepreciationFields } from './vehicleDepreciation.fields'
import { mapVehicleDepreciationResultToRows } from './vehicleDepreciation.mapper'

export const vehicleDepreciationCalculator: CalculatorModule = {
  fields: vehicleDepreciationFields,
  calculate: async (client, input): Promise<CalculatorResultRow[]> => {
    const query = buildCalculatorQuery<GetVehicleDepreciationData['query']>(
      vehicleDepreciationFields,
      input,
    )
    const result = await client.getVehicleDepreciation(query)
    return mapVehicleDepreciationResultToRows(result)
  },
}
