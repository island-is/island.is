import { Inject, Injectable } from '@nestjs/common'
import { MMSApi } from '@island.is/clients/mms'
import { HealthDirectorateClientService } from '@island.is/clients/health-directorate'
import type { User } from '@island.is/auth-nest-tools'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { OccupationalLicensesList } from './models/occupationalLicenseList.model'
import { isDefined } from '@island.is/shared/utils'
import { FeatureFlagService, Features } from '@island.is/nest/feature-flags'
import {
  EducationalLicense,
  HealthDirectorateLicense,
  OccupationalLicenseType,
} from './models/occupationalLicense.model'

@Injectable()
export class OccupationalLicensesService {
  constructor(
    private healthDirectorateApi: HealthDirectorateClientService,
    private mmsApi: MMSApi,
    private readonly featureFlagService: FeatureFlagService,
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

      const today = new Date()

      return (
        licenses
          .map((license) => {
            if (
              !license.leyfi ||
              !license.starfsstett ||
              !license.gildirFra ||
              !license.leyfisnumer
            )
              return null
            const isValid =
              license.gildirTIl && license.gildirFra
                ? today >= license.gildirFra && today <= license.gildirTIl
                : license.gildirFra && !license.gildirTIl
                ? today >= license.gildirFra
                : false
            if (!license.logadiliID || !license.kennitala || !license.nafn)
              return undefined
            return {
              institution: OccupationalLicenseType.HEALTH,
              id: license.logadiliID,
              legalEntityId: license.logadiliID,
              holderName: license.nafn,
              profession: license.starfsstett,
              type: license.leyfi,
              number: license.leyfisnumer,
              validFrom: license.gildirFra?.toString(),
              isValid: isValid,
            }
          })
          .filter(isDefined)
          .find((license) => license.id === id) ?? undefined
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

      const today = new Date()

      return licenses
        .map((license) => {
          if (
            !license.leyfi ||
            !license.starfsstett ||
            !license.gildirFra ||
            !license.leyfisnumer
          )
            return null
          const isValid =
            license.gildirTIl && license.gildirFra
              ? today >= license.gildirFra && today <= license.gildirTIl
              : license.gildirFra && !license.gildirTIl
              ? today >= license.gildirFra
              : false
          if (!license.logadiliID || !license.kennitala || !license.nafn)
            return null
          return {
            institution: OccupationalLicenseType.HEALTH,
            id: license.logadiliID,
            legalEntityId: license.logadiliID,
            holderName: license.nafn,
            profession: license.starfsstett,
            type: license.leyfi,
            number: license.leyfisnumer,
            validFrom: license.gildirFra?.toString(),
            isValid: isValid,
          }
        })
        .filter(isDefined)
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
            institution: OccupationalLicenseType.EDUCATION,
            id: license.id,
            type: license.issuer,
            profession: license.type,
            validFrom: license.issued,
            isValid: new Date(license.issued) < new Date(),
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
        institution: OccupationalLicenseType.EDUCATION,
        id: license.id,
        type: license.issuer,
        profession: license.type,
        validFrom: license.issued,
        isValid: new Date(license.issued) < new Date(),
      }))
    } catch (e) {
      this.logger.error(`Error getting educational license`, {
        ...e,
      })
      return null
    }
  }

  async getOccupationalLicenses(user: User): Promise<OccupationalLicensesList> {
    const allowHealthDirectorate = await this.featureFlagService.getValue(
      Features.occupationalLicensesHealthDirectorate,
      false,
      user,
    )
    const healthDirectorateLicenses = allowHealthDirectorate
      ? await this.getHealthDirectorateLicense(user)
      : []

    const educationalLicenses = await this.getEducationalLicenses(user)

    return {
      count:
        (healthDirectorateLicenses?.length ?? 0) +
        (educationalLicenses?.length ?? 0),
      items: [
        ...(healthDirectorateLicenses ?? []),
        ...(educationalLicenses ?? []),
      ].filter(isDefined),
      error: {
        hasError:
          healthDirectorateLicenses === null || educationalLicenses === null,
      },
    }
  }
}
