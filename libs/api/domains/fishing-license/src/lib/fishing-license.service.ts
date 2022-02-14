import { Inject, Injectable } from '@nestjs/common'
import {
  FISHING_LICENSE_CLIENT,
  FishingLicenseClient,
  SkipApi,
  UtgerdirApi,
  FishingLicenseCodeType,
} from '@island.is/clients/fishing-license'
import { Auth, AuthMiddleware } from '@island.is/auth-nest-tools'

@Injectable()
export class FishingLicenseService {
  constructor(
    private readonly shipApi: SkipApi,
    private readonly utgerdirApi: UtgerdirApi,
  ) {}

  async getShips(nationalId: string, auth: Auth) {
    console.log('get ships')
    console.log('auth', auth)
    console.log('nationalid', nationalId)
    const ships = await this.utgerdirApi
      .withMiddleware(new AuthMiddleware(auth, { forwardUserInfo: true }))
      .v1UtgerdirKennitalaSkipGet({ kennitala: nationalId })

    return (
      ships.skip?.map((ship) => ({
        name: ship.skipanafn ?? '',
        deprivations:
          ship.sviptingar?.map((d) => ({
            validFrom: new Date(),
            invalidFrom: new Date(),
            explanation: '',
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
  }

  async getFishingLicenses(shipRegistationNumber: number, auth: Auth) {
    const licenses = await this.shipApi
      .withMiddleware(new AuthMiddleware(auth))
      .v1SkipSkipaskrarnumerVeidileyfiGet({
        skipaskrarnumer: shipRegistationNumber.toString(),
      })

    return (
      licenses.veidileyfiIBodi?.map((l) => ({
        fishingLicenseInfo: {
          code: FishingLicenseCodeType.catchMark,
          name: l.forsendur?.veidileyfi?.nafn ?? '',
        },
        answer: !!l.svar,
        reasons:
          l.astaedur?.map((x) => ({ description: '', directions: '' })) ?? [],
      })) ?? []
    )
  }

  //Todo fishingLicense type
  async createFishingLicense(fishingLicense: any) {
    console.log('🐟🐠🦈🎣')
  }
}
