import { Injectable } from '@nestjs/common'
import { User } from '@island.is/auth-nest-tools'
import { ShipRegistryClientV2Service } from '@island.is/clients/ship-registry-v2'
import { mapToSailorCertificates } from '../mapper'
import { ShipRegistrySailorCertificates } from '../models/sailorCertificates.model'

@Injectable()
export class SailorsService {
  constructor(
    private readonly shipRegistryClientV2Service: ShipRegistryClientV2Service,
  ) {}

  async getSailorCertificates(
    user: User,
  ): Promise<ShipRegistrySailorCertificates | null> {
    const dto = await this.shipRegistryClientV2Service.getSailorCertificates(
      user,
    )

    if (!dto) {
      return null
    }

    return mapToSailorCertificates(dto)
  }
}
