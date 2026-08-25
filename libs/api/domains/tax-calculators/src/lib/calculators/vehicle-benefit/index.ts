import type { GetVehicleBenefitData } from '@island.is/clients/rsk/calculators'
import { CalculatorResultRow } from '../../models/resultRow.model'
import { CalculatorModule } from '../../utils/calculatorModule'
import { buildCalculatorQuery } from '../../utils/parsing'
import { vehicleBenefitFields } from './vehicleBenefit.fields'
import { mapVehicleBenefitResultToRows } from './vehicleBenefit.mapper'

export const vehicleBenefitCalculator: CalculatorModule = {
  fields: vehicleBenefitFields,
  calculate: async (client, input): Promise<CalculatorResultRow[]> => {
    const query = buildCalculatorQuery<GetVehicleBenefitData['query']>(
      vehicleBenefitFields,
      input,
    )
    const result = await client.getVehicleBenefit(query)
    return mapVehicleBenefitResultToRows(result)
  },
}
