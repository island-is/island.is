import isAfter from 'date-fns/isAfter'
import { Locale } from '@island.is/shared/types'
import {
  DEFAULT_LICENSE_ID,
  LICENSE_NAMESPACE,
} from '../licenseService.constants'
import { Injectable } from '@nestjs/common'
import { Staediskortamal } from '@island.is/clients/p-card'
import { isDefined } from '@island.is/shared/utils'
import { format } from 'kennitala'
import { m } from '../messages'
import { IntlService } from '@island.is/cms-translations'
import { expiryTag } from '../utils/expiryTag'
import { formatDate } from '../utils'
import {
  ExpiryStatus,
  GenericLicenseDataFieldType,
  GenericLicenseMappedPayloadResponse,
  GenericLicenseMapper,
} from '../licenceService.type'
import { GenericLicenseDataField } from '../dto/GenericLicenseDataField.dto'

@Injectable()
export class PCardPayloadMapper implements GenericLicenseMapper {
  constructor(private readonly intlService: IntlService) {}
  async parsePayload(
    payload: Array<unknown>,
    locale: Locale = 'is',
  ): Promise<Array<GenericLicenseMappedPayloadResponse>> {
    if (!payload) return Promise.resolve([])

    const typedPayload = payload as Array<Staediskortamal>

    const { formatMessage } = await this.intlService.useIntl(
      [LICENSE_NAMESPACE],
      locale,
    )

    const mappedPayload: Array<GenericLicenseMappedPayloadResponse> =
      typedPayload.map((t) => {
        const isExpired = t.gildistimi
          ? !isAfter(new Date(t.gildistimi.toISOString()), new Date())
          : undefined

        const data: Array<GenericLicenseDataField> = [
          t.nafn
            ? {
                type: GenericLicenseDataFieldType.Value,
                label: formatMessage(m.name),
                value: t.nafn,
              }
            : null,
          t.kennitala
            ? {
                type: GenericLicenseDataFieldType.Value,
                label: formatMessage(m.nationalId),
                value: format(t.kennitala),
              }
            : null,
          t.malsnumer
            ? {
                type: GenericLicenseDataFieldType.Value,
                label: formatMessage(m.cardNumber),
                value: t.malsnumer,
              }
            : null,
          t.utgafudagur
            ? {
                type: GenericLicenseDataFieldType.Value,
                label: formatMessage(m.publishedDate),
                value: formatDate(t.utgafudagur),
              }
            : null,
          t.gildistimi
            ? {
                type: GenericLicenseDataFieldType.Value,
                label: formatMessage(m.validTo),
                value: formatDate(t.gildistimi),
                tag: expiryTag(
                  formatMessage,
                  isExpired,
                  formatMessage(m.validUntil, {
                    arg: formatDate(t.gildistimi),
                  }),
                ),
              }
            : null,
          t.utgefandi
            ? {
                type: GenericLicenseDataFieldType.Value,
                label: formatMessage(m.publisher),
                value: t.utgefandi,
              }
            : null,
        ].filter(isDefined)

        return {
          licenseName: formatMessage(m.pCard),
          type: 'user',
          payload: {
            data,
            rawData: JSON.stringify(t),
            metadata: {
              licenseNumber: t.malsnumer?.toString() ?? '',
              subtitle: formatMessage(m.licenseNumberVariant, {
                arg: t.malsnumer?.toString() ?? formatMessage(m.unknown),
              }),
              licenseId: DEFAULT_LICENSE_ID,
              expiryStatus:
                isExpired === undefined
                  ? ExpiryStatus.UNKNOWN
                  : isExpired
                  ? ExpiryStatus.EXPIRED
                  : ExpiryStatus.ACTIVE,
              expired: isExpired,
              expireDate: t.gildistimi?.toISOString(),
              displayTag: expiryTag(formatMessage, isExpired),
              name: formatMessage(m.pCard),
              title: formatMessage(m.yourPCard),
              description: [{ text: formatMessage(m.yourPCardDescription) }],
            },
          },
        }
      })
    return mappedPayload
  }
}
