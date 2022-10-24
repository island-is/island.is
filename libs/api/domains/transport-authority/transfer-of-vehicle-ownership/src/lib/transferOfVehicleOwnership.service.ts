import {
  Inject,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common'
import {
  OwnerChange,
  VehicleOwnerChangeClient,
} from '@island.is/clients/transport-authority/vehicle-owner-change'
import { User } from '@island.is/auth-nest-tools'

@Injectable()
export class TransferOfVehicleOwnershipApi {
  constructor(
    private readonly vehicleOwnerChangeClient: VehicleOwnerChangeClient,
  ) {}

  async saveOwnerChange(
    currentUserSsn: string,
    ownerChange: OwnerChange,
  ): Promise<void> {
    this.vehicleOwnerChangeClient.saveOwnerChange(currentUserSsn, ownerChange)
  }
}
