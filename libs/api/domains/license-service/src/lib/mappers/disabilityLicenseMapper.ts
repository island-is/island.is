import isAfter from 'date-fns/isAfter'
import { Locale } from '@island.is/shared/types'
import { OrorkuSkirteini } from '@island.is/clients/disability-license'
import {
  DEFAULT_LICENSE_ID,
  LICENSE_NAMESPACE,
} from '../licenseService.constants'
import {
  ExpiryStatus,
  GenericLicenseDataFieldType,
  GenericLicenseMappedPayloadResponse,
  GenericLicenseMapper,
} from '../licenceService.type'
import { Injectable } from '@nestjs/common'
import { IntlService } from '@island.is/cms-translations'
import { m } from '../messages'
import { formatDate, expiryTag } from '../utils'
import { GenericLicenseDataField } from '../dto/GenericLicenseDataField.dto'

@Injectable()
export class DisabilityLicensePayloadMapper implements GenericLicenseMapper {
  constructor(private readonly intlService: IntlService) {}
  async parsePayload(
    payload: Array<unknown>,
    locale: Locale = 'is',
  ): Promise<Array<GenericLicenseMappedPayloadResponse>> {
    if (!payload) return Promise.resolve([])

    const typedPayload = payload as Array<OrorkuSkirteini>

    const { formatMessage } = await this.intlService.useIntl(
      [LICENSE_NAMESPACE],
      locale,
    )

    const mappedPayload: Array<GenericLicenseMappedPayloadResponse> =
      typedPayload.map((t) => {
        const isExpired: boolean | undefined = t.gildirtil
          ? !isAfter(new Date(t.gildirtil), new Date())
          : undefined

        const data: Array<GenericLicenseDataField> = [
          {
            type: GenericLicenseDataFieldType.Value,
            name: formatMessage(m.basicInfoDisabilityLicense),
            label: formatMessage(m.fullName),
            value: t.nafn ?? '',
          },
          {
            type: GenericLicenseDataFieldType.Value,
            label: formatMessage(m.publisher),
            value: 'Tryggingastofnun',
          },
          {
            type: GenericLicenseDataFieldType.Value,
            label: formatMessage(m.validTo),
            value: t.gildirtil ? formatDate(t.gildirtil) : '',
            tag:
              isExpired !== undefined && t.gildirtil
                ? expiryTag(formatMessage, isExpired)
                : undefined,
          },
        ]

        return {
          licenseName: formatMessage(m.disabilityCard),
          type: 'user',
          payload: {
            data,
            rawData: JSON.stringify(t),
            metadata: {
              licenseNumber: t.kennitala?.toString() ?? '',
              subtitle: formatMessage(m.licenseNumberVariant, {
                arg: t.kennitala?.toString() ?? formatMessage(m.unknown),
              }),
              licenseId: DEFAULT_LICENSE_ID,
              expiryStatus:
                isExpired === undefined
                  ? ExpiryStatus.UNKNOWN
                  : isExpired
                  ? ExpiryStatus.EXPIRED
                  : ExpiryStatus.ACTIVE,
              expired: isExpired,
              expireDate: t.gildirtil?.toISOString() ?? undefined,
              displayTag: expiryTag(formatMessage, isExpired),
              name: formatMessage(m.disabilityCard),
              title: formatMessage(m.yourDisabilityLicense),
              description: [
                { text: formatMessage(m.yourDisabilityLicenseDescription) },
              ],
            },
          },
        }
      })

    return mappedPayload
  }
}
