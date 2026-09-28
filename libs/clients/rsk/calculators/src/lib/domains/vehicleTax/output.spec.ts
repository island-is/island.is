import type { VehicleTaxResult } from '../../../../gen/fetch'
import { toVehicleTaxOutput } from './output'

const result: VehicleTaxResult = {
  timabil: 'text-1',
  gjaldar: 2,
  eiginthyngd: 3,
  co2: 4,
  nedc: 5,
  wltp: 6,
  bifreidagjold: 7,
  urvinnslugjald: 8,
  bifreidagjoldAlls: 9,
}

describe('toVehicleTaxOutput', () => {
  it('reads each output field from its own RSK source key', () => {
    expect(toVehicleTaxOutput(result)).toEqual({
      periodLabel: 'text-1',
      feeYear: 2,
      vehicleWeight: 3,
      co2: 4,
      nedc: 5,
      wltp: 6,
      vehicleTax: 7,
      recyclingFee: 8,
      totalVehicleTax: 9,
    })
  })

  it('maps an absent result to undefined scalars, never null', () => {
    const empty: VehicleTaxResult = {
      timabil: null,
    }
    const output = toVehicleTaxOutput(empty)

    expect(output.periodLabel).toBeUndefined()
    expect(output.feeYear).toBeUndefined()
    expect(output.vehicleWeight).toBeUndefined()
    expect(output.co2).toBeUndefined()
    expect(output.nedc).toBeUndefined()
    expect(output.wltp).toBeUndefined()
    expect(output.vehicleTax).toBeUndefined()
    expect(output.recyclingFee).toBeUndefined()
    expect(output.totalVehicleTax).toBeUndefined()
  })
})
