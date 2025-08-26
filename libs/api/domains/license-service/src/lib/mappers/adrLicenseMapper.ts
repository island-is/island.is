import isAfter from 'date-fns/isAfter'
import { Locale } from '@island.is/shared/types'
import {
  FlattenedAdrDto,
  FlattenedAdrRightsDto,
} from '@island.is/clients/license-client'
import {
  DEFAULT_LICENSE_ID,
  LICENSE_NAMESPACE,
} from '../licenseService.constants'
import { Injectable } from '@nestjs/common'
import { IntlService } from '@island.is/cms-translations'
import { m } from '../messages'
import { formatDate, expiryTag } from '../utils'
import {
  ExpiryStatus,
  GenericLicenseDataFieldType,
  GenericLicenseMappedPayloadResponse,
  GenericLicenseMapper,
} from '../licenceService.type'
import { GenericLicenseDataField } from '../dto/GenericLicenseDataField.dto'

@Injectable()
export class AdrLicensePayloadMapper implements GenericLicenseMapper {
  constructor(private readonly intlService: IntlService) {}
  async parsePayload(
    payload: Array<unknown>,
    locale: Locale = 'is',
  ): Promise<Array<GenericLicenseMappedPayloadResponse>> {
    if (!payload) return Promise.resolve([])

    const typedPayload = payload as Array<FlattenedAdrDto>

    const { formatMessage } = await this.intlService.useIntl(
      [LICENSE_NAMESPACE],
      locale,
    )

    const mappedPayload: Array<GenericLicenseMappedPayloadResponse> =
      typedPayload.map((t) => {
        const isExpired: boolean | undefined = t.gildirTil
          ? !isAfter(new Date(t.gildirTil), new Date())
          : undefined

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
            value: t.gildirTil ? formatDate(new Date(t.gildirTil)) : '',
            tag: expiryTag(formatMessage, isExpired),
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

        return {
          licenseName: formatMessage(m.adrLicense),
          type: 'user',
          payload: {
            data,
            rawData: JSON.stringify(t),
            metadata: {
              licenseNumber: t.skirteinisNumer ?? '',
              subtitle: formatMessage(m.licenseNumberVariant, {
                arg: t.skirteinisNumer ?? formatMessage(m.unknown),
              }),
              licenseId: DEFAULT_LICENSE_ID,
              expired: isExpired,
              expireDate: t.gildirTil ?? undefined,
              expiryStatus:
                isExpired === undefined
                  ? ExpiryStatus.UNKNOWN
                  : isExpired
                  ? ExpiryStatus.EXPIRED
                  : ExpiryStatus.ACTIVE,
              displayTag: expiryTag(
                formatMessage,
                isExpired,
                t.gildirTil
                  ? formatMessage(m.validUntil, {
                      arg: formatDate(new Date(t.gildirTil)),
                    })
                  : undefined,
              ),
              name: formatMessage(m.adrLicense),
              title: formatMessage(m.yourADRLicense),
              description: [
                { text: formatMessage(m.yourAdrLicenseDescription) },
              ],
            },
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
      })),
    }
  }
}
