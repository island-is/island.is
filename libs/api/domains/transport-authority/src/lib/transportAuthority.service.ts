import { Injectable } from '@nestjs/common'
import { User } from '@island.is/auth-nest-tools'
import {
  InsuranceCompany,
  VehicleCodetablesClient,
} from '@island.is/clients/transport-authority/vehicle-codetables'
import { DigitalTachographDriversCardClient } from '@island.is/clients/transport-authority/digital-tachograph-drivers-card'
import { CheckTachoNetInput } from './graphql/dto'
import { CheckTachoNetExists } from './graphql/models'

@Injectable()
export class TransportAuthorityApi {
  constructor(
    private readonly vehicleCodetablesClient: VehicleCodetablesClient,
    private readonly digitalTachographDriversCardClient: DigitalTachographDriversCardClient,
  ) {}

  async getInsuranceCompanies(): Promise<InsuranceCompany[]> {
    return await this.vehicleCodetablesClient.getInsuranceCompanies()
  }

  async checkTachoNet(
    user: User,
    input: CheckTachoNetInput,
  ): Promise<CheckTachoNetExists> {
    const hasActiveCard = await this.digitalTachographDriversCardClient.checkIfHasActiveCardInTachoNet(
      user,
      input,
    )

    return { exists: hasActiveCard }
  }
}
