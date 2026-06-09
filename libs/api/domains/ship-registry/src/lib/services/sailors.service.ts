import { Injectable } from '@nestjs/common'
import { User } from '@island.is/auth-nest-tools'
import { ShipRegistryClientV2Service } from '@island.is/clients/ship-registry-v2'
import {
  mapToSailorMaritimeBooks,
  mapToSailorRegistrationExemptions,
  mapToSailorRightCertificates,
  mapToSailorSchoolCertificates,
  mapToSailorSeaServiceBook,
} from '../mapper'
import { ShipRegistrySailorSchoolCertificate } from '../models/sailorSchoolCertificate.model'
import { ShipRegistrySailorRightCertificate } from '../models/sailorRightCertificate.model'
import { ShipRegistrySailorMaritimeBook } from '../models/sailorMaritimeBook.model'
import { ShipRegistrySailorRegistrationExemption } from '../models/sailorRegistrationExemption.model'
import { ShipRegistrySailorSeaServiceBookEntry } from '../models/sailorSeaServiceBookEntry.model'
import { LocaleEnum } from '@island.is/nest/graphql'
import type { SeaServiceBookFilterInput } from '../dto/sailor-sea-service-book-filter.input'

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
    filters?: SeaServiceBookFilterInput,
  ): Promise<ShipRegistrySailorSeaServiceBookEntry[]> {
    const entries = await this.shipRegistryClientV2Service.getSailorSeaService(
      user,
      filters,
    )
    return mapToSailorSeaServiceBook(entries, locale)
  }
}
