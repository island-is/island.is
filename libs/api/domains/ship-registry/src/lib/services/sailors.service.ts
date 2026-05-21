import { Injectable } from '@nestjs/common'
import { User } from '@island.is/auth-nest-tools'
import {
  SailorSeaServiceFilterDto,
  ShipRegistryClientV2Service,
} from '@island.is/clients/ship-registry-v2'
import {
  mapToRanks,
  mapToSailorCertificates,
  mapToSailorSeaService,
} from '../mapper'
import { ShipRegistrySailorCertificates } from '../models/sailorCertificates.model'
import { ShipRegistrySailorSeaServiceEntry } from '../models/sailorSeaServiceEntry.model'
import { ShipRegistryRank } from '../models/rank.model'

@Injectable()
export class SailorsService {
  constructor(
    private readonly shipRegistryClientV2Service: ShipRegistryClientV2Service,
  ) {}

  async getSailorCertificates(
    user: User,
  ): Promise<ShipRegistrySailorCertificates | null> {
    const [
      schoolCertificates,
      rightCertificates,
      maritimeBooks,
      registrationExemptions,
    ] = await Promise.all([
      this.shipRegistryClientV2Service.getSailorSchoolCertificates(user),
      this.shipRegistryClientV2Service.getSailorRightCertificates(user),
      this.shipRegistryClientV2Service.getSailorMaritimeBooks(user),
      this.shipRegistryClientV2Service.getSailorRegistrationExemptions(user),
    ])

    return mapToSailorCertificates({
      schoolCertificates,
      rightCertificates,
      maritimeBooks,
      registrationExemptions,
    })
  }

  async getSailorSeaService(
    filters?: SailorSeaServiceFilterDto,
  ): Promise<ShipRegistrySailorSeaServiceEntry[]> {
    const entries = await this.shipRegistryClientV2Service.getSailorSeaService(
      filters,
    )

    return mapToSailorSeaService(entries)
  }

  async getRanks(): Promise<ShipRegistryRank[]> {
    const ranks = await this.shipRegistryClientV2Service.getRanks()

    return mapToRanks(ranks)
  }
}
