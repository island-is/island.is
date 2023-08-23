import { Inject, Injectable } from '@nestjs/common'
import { MMSApi } from '@island.is/clients/mms'
import { HealthDirectorateClientService } from '@island.is/clients/health-directorate'
import type { User } from '@island.is/auth-nest-tools'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { OccupationalLicenseList } from './models/occupationalLicenseList.model'
import { HealthDirectorateLicense } from './models/healthDirectorateLicense.model'
import { EducationalLicense } from './models/educationalLicense.model'

type ExcludesFalse = <T>(x: T | null | undefined | false | '') => x is T

// TODO: Replace undefined for error handling

@Injectable()
export class OccupationalLicensesService {
  constructor(
    @Inject(HealthDirectorateClientService)
    private healthDirectorateApi: HealthDirectorateClientService,
    @Inject(MMSApi) private mmsApi: MMSApi,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  async getHealthDirectorateLicenseById(
    user: User,
    id: string,
  ): Promise<HealthDirectorateLicense | null | undefined> {
    try {
      const licenses =
        (await this.healthDirectorateApi.getHealthDirectorateLicense(user)) ??
        []

      return (
        licenses
          .map((license) => {
            if (!license.logadiliID || !license.kennitala || !license.nafn)
              return undefined
            return {
              legalEntityId: license.logadiliID,
              name: license.nafn,
              nationalId: license.kennitala,
              profession: license.starfsstett,
              license: license.leyfi,
              licenseNumber: license.leyfisnumer,
              validFrom: license.gildirFra,
              validTo: license.gildirTIl,
            }
          })
          .filter((Boolean as unknown) as ExcludesFalse)
          .find((license) => license.legalEntityId === id) ?? undefined
      )
    } catch (e) {
      this.logger.error(`Error getting health directorate license by id`, {
        ...e,
      })
      return null
    }
  }
  async getHealthDirectorateLicense(
    user: User,
  ): Promise<HealthDirectorateLicense[] | null> {
    try {
      const licenses =
        (await this.healthDirectorateApi.getHealthDirectorateLicense(user)) ??
        []

      return licenses
        .map((license) => {
          if (!license.logadiliID || !license.kennitala || !license.nafn)
            return null
          return {
            legalEntityId: license.logadiliID,
            name: license.nafn,
            nationalId: license.kennitala,
            profession: license.starfsstett,
            license: license.leyfi,
            licenseNumber: license.leyfisnumer,
            validFrom: license.gildirFra,
            validTo: license.gildirTIl,
          }
        })
        .filter((Boolean as unknown) as ExcludesFalse)
    } catch (e) {
      this.logger.error(`Error getting health directorate license`, {
        ...e,
      })
      return null
    }
  }

  async getEducationalLicensesById(
    user: User,
    id: string,
  ): Promise<EducationalLicense | null> {
    try {
      const licenses = await (this.mmsApi.getLicenses(user.nationalId) ?? [])

      return (
        licenses
          .map((license) => ({
            id: license.id,
            school: license.issuer,
            programme: license.type,
            date: license.issued,
          }))
          .find((license) => license.id === id) ?? null
      )
    } catch (e) {
      this.logger.error(`Error getting educational license by id`, {
        ...e,
      })
      return null
    }
  }

  async getEducationalLicenses(
    user: User,
  ): Promise<EducationalLicense[] | null> {
    try {
      const licenses = await (this.mmsApi.getLicenses(user.nationalId) ?? [])

      return licenses.map((license) => ({
        id: license.id,
        school: license.issuer,
        programme: license.type,
        date: license.issued,
      }))
    } catch (e) {
      this.logger.error(`Error getting educational license`, {
        ...e,
      })
      return null
    }
  }

  async getOccupationalLicenses(user: User): Promise<OccupationalLicenseList> {
    const healthDirectorateLicenses = await this.getHealthDirectorateLicense(
      user,
    )

    const educationalLicenses = await this.getEducationalLicenses(user)

    return {
      count:
        (healthDirectorateLicenses?.length ?? 0) +
        (educationalLicenses?.length ?? 0),
      items: [
        ...(healthDirectorateLicenses ?? []),
        ...(educationalLicenses ?? []),
      ].filter((Boolean as unknown) as ExcludesFalse),
    }
  }
}
