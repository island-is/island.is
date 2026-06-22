import { Injectable } from '@nestjs/common'
import { User } from '@island.is/auth-nest-tools'
import { ShipRegistryClientV2Service } from '@island.is/clients/ship-registry-v2'
import {
  mapToRanks,
  mapToSailorMaritimeBooks,
  mapToSailorRegistrationExemptions,
  mapToSailorRightCertificates,
  mapToSailorSchoolCertificates,
  mapToSailorSeagoingTime,
} from '../mappers'
import { ShipRegistrySailorSchoolCertificate } from '../models/sailorSchoolCertificate.model'
import { ShipRegistrySailorRightCertificate } from '../models/sailorRightCertificate.model'
import { ShipRegistrySailorMaritimeBook } from '../models/sailorMaritimeBook.model'
import { ShipRegistrySailorRegistrationExemption } from '../models/sailorRegistrationExemption.model'
import { ShipRegistrySailorSeagoingTimeCollection } from '../models/sailorSeagoingTime.model'
import { ShipRegistryRank } from '../models/rank.model'
import { LocaleEnum } from '@island.is/nest/graphql'
import type { SeagoingTimeInput } from '../dto/seagoingTime.input'
import type { SeagoingTimeFilterDto } from '@island.is/clients/ship-registry-v2'

@Injectable()
export class SailorsService {
  constructor(
    private readonly shipRegistryClientV2Service: ShipRegistryClientV2Service,
  ) {}

  async getSailorSchoolCertificates(
    user: User,
    locale: LocaleEnum,
  ): Promise<ShipRegistrySailorSchoolCertificate[]> {
    const entries =
      await this.shipRegistryClientV2Service.getSailorSchoolCertificates(user)
    return mapToSailorSchoolCertificates(entries, locale)
  }

  async getSailorRightCertificates(
    user: User,
    locale: LocaleEnum,
  ): Promise<ShipRegistrySailorRightCertificate[]> {
    const entries =
      await this.shipRegistryClientV2Service.getSailorRightCertificates(user)
    return mapToSailorRightCertificates(entries, locale)
  }

  async getSailorMaritimeBooks(
    user: User,
    locale: LocaleEnum,
  ): Promise<ShipRegistrySailorMaritimeBook[]> {
    const entries =
      await this.shipRegistryClientV2Service.getSailorMaritimeBooks(user)
    return mapToSailorMaritimeBooks(entries, locale)
  }

  async getSailorRegistrationExemptions(
    user: User,
    locale: LocaleEnum,
  ): Promise<ShipRegistrySailorRegistrationExemption[]> {
    const entries =
      await this.shipRegistryClientV2Service.getSailorRegistrationExemptions(
        user,
      )
    return mapToSailorRegistrationExemptions(entries, locale)
  }

  async getSailorSeaServiceBook(
    user: User,
    locale: LocaleEnum,
    input: SeagoingTimeInput,
  ): Promise<ShipRegistrySailorSeagoingTimeCollection | null> {
    const filter: SeagoingTimeFilterDto = {
      dateFrom: input.dateFrom?.toISOString(),
      dateTo: input.dateTo?.toISOString(),
      rankId: input.rankId,
      fromOrEqLength: input.minimumLength,
      fromOrEqMainEnginePower: input.minimumEnginePower,
      fromOrEqBruttoWeight: input.minimumGrossTonnage,
      pageNumber: input.pageNumber,
      pageSize: input.pageSize,
    }
    const response = await this.shipRegistryClientV2Service.getSailorSeaService(
      user,
      filter,
    )
    return response ? mapToSailorSeagoingTime(response, locale) : null
  }

  async getRanks(locale: LocaleEnum): Promise<ShipRegistryRank[]> {
    const dtos = await this.shipRegistryClientV2Service.getRanks()
    return mapToRanks(dtos, locale)
  }
}
