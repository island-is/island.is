import isAfter from 'date-fns/isAfter'
import { Locale } from '@island.is/shared/types'
import {
  FlattenedAdrDto,
  FlattenedAdrRightsDto,
} from '@island.is/clients/license-client'
import { DEFAULT_LICENSE_ID } from '../licenseService.constants'
import {
  GenericLicenseDataField,
  GenericLicenseDataFieldType,
<<<<<<< Updated upstream
  GenericLicenseLabels,
<<<<<<< Updated upstream
  GenericLicenseMappedPayloadResponse,
=======
=======
  GenericLicenseMappedPayloadResponse,
>>>>>>> Stashed changes
>>>>>>> Stashed changes
  GenericLicenseMapper,
} from '../licenceService.type'
import { Injectable } from '@nestjs/common'
import { IntlService } from '@island.is/cms-translations'
import { m } from '../messages'

export const LICENSE_NAMESPACE = 'api.license-service'

@Injectable()
export class AdrLicensePayloadMapper implements GenericLicenseMapper {
  constructor(private readonly intlService: IntlService) { }
  async parsePayload(
    payload: Array<unknown>,
    locale: Locale = 'is',
<<<<<<< Updated upstream
    labels?: GenericLicenseLabels,
  ): Array<GenericLicenseMappedPayloadResponse> {
    if (!payload) return []
=======
  ): Promise<Array<GenericLicenseMappedPayloadResponse>> {
    if (!payload) return Promise.resolve([])
>>>>>>> Stashed changes

    const typedPayload = payload as Array<FlattenedAdrDto>

    const { formatMessage } = await this.intlService.useIntl(
      [LICENSE_NAMESPACE],
      locale,
    )

    const mappedPayload: Array<GenericLicenseMappedPayloadResponse> =
      typedPayload.map((t) => {
        const data: Array<GenericLicenseDataField> = [
          {
            name: formatMessage(m.basicInfoLicense),
            type: GenericLicenseDataFieldType.Value,
            label: formatMessage(m.licenseNumber),
            value: t.skirteinisNumer?.toString(),
          },
          {
            type: GenericLicenseDataFieldType.Value,
            label: formatMessage(m.fullName),
            value: t.fulltNafn ?? '',
          },
          {
            type: GenericLicenseDataFieldType.Value,
            label: formatMessage(m.publisher),
            value: 'Vinnueftirlitið',
          },
          {
            type: GenericLicenseDataFieldType.Value,
            label: formatMessage(m.validTo),
            value: t.gildirTil ?? '',
          },
        ]

        const adrRights = (t.adrRettindi ?? []).filter((field) => field.grunn)
        const tankar = this.parseRights(
          formatMessage(m.tanks) ?? '',
          adrRights.filter((field) => field.tankar),
        )

        if (tankar) data.push(tankar)

        const grunn = this.parseRights(
          formatMessage(m.otherThanTanks) ?? '',
          adrRights,
        )
        if (grunn) data.push(grunn)

        const isExpired: boolean | undefined = t.gildirTil
          ? !isAfter(new Date(t.gildirTil), new Date())
          : undefined

        return {
<<<<<<< Updated upstream
=======
<<<<<<< Updated upstream
          data,
          rawData: JSON.stringify(t),
          metadata: {
            licenseNumber: t.skirteinisNumer?.toString() ?? '',
            licenseId: DEFAULT_LICENSE_ID,
            expired: t.gildirTil
              ? !isAfter(new Date(t.gildirTil), new Date())
              : null,
            expireDate: t.gildirTil ?? undefined,
=======
          licenseName: formatMessage(m.adrLicense),
>>>>>>> Stashed changes
          type: 'user',
          payload: {
            data,
            rawData: JSON.stringify(t),
            metadata: {
              licenseNumber: t.skirteinisNumer?.toString() ?? '',
              licenseId: DEFAULT_LICENSE_ID,
              expired: t.gildirTil
                ? !isAfter(new Date(t.gildirTil), new Date())
                : null,
              expireDate: t.gildirTil ?? undefined,
<<<<<<< Updated upstream
            },
=======
              displayTag: t.gildirTil ? {
                text: isExpired ?
                  formatMessage(m.expired)
                  : formatMessage(m.valid)
                color: isExpired ? 'red100' : 'blue100'
              } : undefined,
            },
>>>>>>> Stashed changes
>>>>>>> Stashed changes
          },
        }
      })

    return mappedPayload
  }

  private parseRights(
    label: string,
    data: FlattenedAdrRightsDto[],
  ): GenericLicenseDataField | undefined {
    if (!data.length) {
      return
    }

    return {
      type: GenericLicenseDataFieldType.Group,
      label: label,
      fields: data.map((field) => ({
        type: GenericLicenseDataFieldType.Category,
        name: field.flokkur ?? '',
        label: field.heiti ?? '',
        description: field.heiti ?? '',
      })),
    }
  }
}
