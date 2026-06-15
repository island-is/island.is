import { Injectable } from '@nestjs/common'
import { User } from '@island.is/auth-nest-tools'
import { ShipRegistryClientV2Service } from '@island.is/clients/ship-registry-v2'
import {
  mapToRanks,
  mapToSailorMaritimeBooks,
  mapToSailorRegistrationExemptions,
  mapToSailorRightCertificates,
  mapToSailorSchoolCertificates,
  mapToSailorSeaServiceBookCollection,
} from '../mapper'
import { ShipRegistrySailorSchoolCertificate } from '../models/sailorSchoolCertificate.model'
import { ShipRegistrySailorRightCertificate } from '../models/sailorRightCertificate.model'
import { ShipRegistrySailorMaritimeBook } from '../models/sailorMaritimeBook.model'
import { ShipRegistrySailorRegistrationExemption } from '../models/sailorRegistrationExemption.model'
import { ShipRegistrySailorSeaServiceBookCollection } from '../models/sailorSeaServiceBookCollection.model'
import { ShipRegistryRank } from '../models/rank.model'
import { LocaleEnum } from '@island.is/nest/graphql'
import type { SeaServiceBookInput } from '../dto/seaServiceBook.input'

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
    input: SeaServiceBookInput,
  ): Promise<ShipRegistrySailorSeaServiceBookCollection | null> {
    const response = await this.shipRegistryClientV2Service.getSailorSeaService(
      user,
      input,
    )
    return response ? mapToSailorSeaServiceBookCollection(response, locale) : null
  }

  async getRanks(locale: LocaleEnum): Promise<ShipRegistryRank[]> {
    const dtos = await this.shipRegistryClientV2Service.getRanks()
    return mapToRanks(dtos, locale)
  }
}
