import { Injectable } from '@nestjs/common'
import { DefaultApi } from '../../gen/fetch'
import { VehicleDebtStatus } from './vehicleServiceFjsV1Client.types'

@Injectable()
export class VehicleServiceFjsV1ClientService {
  constructor(private api: DefaultApi) {}

  async getVehicleDebtStatus(permno: string): Promise<VehicleDebtStatus> {
    // TODOx disable vehicle debt status while api is returning 401 error
    return { isDebtLess: true }

    const result = await this.api.vehicleDebtLesscarNumberGET1({
      carNumber: permno,
    })

    return {
      isDebtLess: result?.debtLessResult?.debtLess,
    }
  }
}
