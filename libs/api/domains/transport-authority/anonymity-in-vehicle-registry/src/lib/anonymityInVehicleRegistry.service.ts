import { Injectable } from '@nestjs/common'
import { User } from '@island.is/auth-nest-tools'

@Injectable()
export class AnonymityInVehicleRegistryApi {
  async getAnonymityStatus(user: User): Promise<Boolean> {
    return false // TODOx call SGS Anonymity api when ready
  }

  async setAnonymityStatus(user: User, isChecked: boolean): Promise<void> {
    // TODOx call SGS Anonymity api when ready
  }
}
