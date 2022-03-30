import { Inject, Injectable } from '@nestjs/common'
import {
  SkipApi,
  UtgerdirApi,
  FishingLicenseCodeType,
} from '@island.is/clients/fishing-license'
import { Auth, AuthMiddleware } from '@island.is/auth-nest-tools'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

@Injectable()
export class FishingLicenseService {
  constructor(
    private readonly shipApi: SkipApi,
    private readonly utgerdirApi: UtgerdirApi,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  async getShips(nationalId: string, auth: Auth) {
    try {
      const ships = await this.utgerdirApi
        .withMiddleware(new AuthMiddleware(auth, { forwardUserInfo: true }))
        .v1UtgerdirKennitalaSkipGet({ kennitala: nationalId })

      return (
        ships.skip?.map((ship) => ({
          name: ship.skipanafn ?? '',
          deprivations:
            ship.sviptingar?.map((d) => ({
              validFrom: d.iGildi ?? undefined,
              invalidFrom: d.urGildi ?? undefined,
              explanation: d.skyring,
            })) ?? [],
          features: ship.einkenni ?? '',
          grossTons: ship.bruttotonn ?? 0,
          homePort: ship.heimahofn ?? '',
          length: ship.lengd ?? 0,
          registrationNumber: ship.skipaskrarnumer ?? 0,
          seaworthiness: ship.haffaeri
            ? { validTo: new Date(ship.haffaeri.gildistimi as Date) }
            : { validTo: new Date() },
          fishingLicenses: [],
        })) ?? []
      )
    } catch (error) {
      this.logger.error('Error when trying to get ships', error)
      throw new Error('Error when trying to get ships')
    }
  }

  async getFishingLicenses(shipRegistationNumber: number, auth: Auth) {
    const licenses = await this.shipApi
      .withMiddleware(new AuthMiddleware(auth))
      .v1SkipSkipaskrarnumerVeidileyfiGet({
        skipaskrarnumer: shipRegistationNumber,
      })

    return (
      licenses.veidileyfiIBodi?.map((l) => ({
        fishingLicenseInfo: {
          code:
            l.veidileyfi?.kodi === '1'
              ? FishingLicenseCodeType.catchMark
              : l.veidileyfi?.kodi === '32'
              ? FishingLicenseCodeType.hookCatchLimit
              : '',
          name: l.veidileyfi?.nafn ?? '',
        },
        answer: !!l.svar,
        reasons:
          l.astaedur?.map((x) => ({
            description: x.lysing ?? '',
            directions: x.leidbeining ?? '',
          })) ?? [],
      })) ?? []
    )
  }

  //Todo fishingLicense type
  async createFishingLicense(fishingLicense: any) {
    console.log('🐟🐠🦈🎣')
  }
}
