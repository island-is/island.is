import { Inject, Injectable } from '@nestjs/common'
import {
  SkipApi,
  UtgerdirApi,
  FishingLicenseCodeType,
} from '@island.is/clients/fishing-license'
import { AuthMiddleware, User } from '@island.is/auth-nest-tools'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { FishingLicenseLicense } from '../graphql/models/fishing-license-license.model'

@Injectable()
export class FishingLicenseService {
  constructor(
    private readonly shipApi: SkipApi,
    private readonly utgerdirApi: UtgerdirApi,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  // Returns enum value equivalent to the given fishing type
  getLicenseCode = (licenseCode?: string | null) => {
    if (
      licenseCode &&
      Object.values(FishingLicenseCodeType).includes(
        licenseCode as FishingLicenseCodeType,
      )
    ) {
      return licenseCode as FishingLicenseCodeType
    }
    return FishingLicenseCodeType.unknown
  }

  async getShips(nationalId: string, user: User) {
    try {
      const ships = await this.utgerdirApi
        .withMiddleware(new AuthMiddleware(user, { forwardUserInfo: false }))
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
          fishingLicenses:
            ship.veidileyfi?.map((v) => ({
              code: this.getLicenseCode(v.kodi),
              name: v.nafn ?? '',
              chargeType: v.vorunumerfjs ?? '',
            })) ?? [],
        })) ?? []
      )
    } catch (error) {
      this.logger.error('Error when trying to get ships', error)
      throw new Error(
        'Villa kom upp þegar reynt var að sækja upplýsingar um skip á þinni kennitölu.',
      )
    }
  }
  async getFishingLicenses(
    shipRegistationNumber: number,
    user: User,
  ): Promise<FishingLicenseLicense[]> {
    try {
      const licenses = await this.shipApi
        .withMiddleware(new AuthMiddleware(user, { forwardUserInfo: false }))
        .v1SkipSkipaskrarnumerVeidileyfiGet({
          skipaskrarnumer: shipRegistationNumber,
        })
      return licenses.veidileyfiIBodi?.map((l) => {
        return {
          fishingLicenseInfo: {
            code: this.getLicenseCode(l.veidileyfi?.kodi),
            name: l.veidileyfi?.nafn ?? '',
            chargeType: l.veidileyfi?.vorunumerfjs ?? '',
          },
          answer: !!l.svar,
          reasons:
            l.astaedur?.map((x) => ({
              description: x.lysing ?? '',
              directions: x.leidbeining ?? '',
            })) ?? [],
          attachmentInfo: l.serhaefdarSpurningarGogn?.vidhengiLysing,
          dateRestriction: {
            dateFrom:
              l.serhaefdarSpurningarGogn?.umbedinGildistakaTakmorkun
                ?.dagsetningFra || null,
            dateTo:
              l.serhaefdarSpurningarGogn?.umbedinGildistakaTakmorkun
                ?.dagsetningTil || null,
          },
          areas:
            l.serhaefdarSpurningarGogn?.veidisvaediValmoguleikar?.map((o) => ({
              key: o.lykill,
              description: o.lysing,
              disabled: o.ogildurValkostur,
              dateRestriction: {
                dateFrom: o.umbedinGildistakaTakmorkun?.dagsetningFra,
                dateTo: o.umbedinGildistakaTakmorkun?.dagsetningTil,
              },
              invalidOption: o.ogildurValkostur,
            })) || [],
          needsOwnershipRegistration:
            l.serhaefdarSpurningarGogn?.vantarEignarhaldskraningu ?? false,
        }
      }) as FishingLicenseLicense[]
    } catch (error) {
      this.logger.error('Error when trying to get fishing licenses', error)
      throw new Error(
        'Villa kom upp þegar reynt var að sækja veiðileyfi tengd skipinu sem var valið.',
      )
    }
  }
}
