import isAfter from 'date-fns/isAfter'
import { Locale } from '@island.is/shared/types'
import {
  GenericLicenseDataField,
  GenericLicenseDataFieldType,
  GenericLicenseMappedPayloadResponse,
  GenericLicenseMapper,
} from '../licenceService.type'
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
                value: t.utgafudagur.toISOString(),
              }
            : null,
          t.gildistimi
            ? {
                type: GenericLicenseDataFieldType.Value,
                label: formatMessage(m.validTo),
                value: t.gildistimi.toISOString(),
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

        const isExpired = t.gildistimi
          ? !isAfter(new Date(t.gildistimi.toISOString()), new Date())
          : undefined

        return {
          licenseName: formatMessage(m.pCard),
          type: 'user',
          payload: {
            data,
            rawData: JSON.stringify(t),
            metadata: {
              licenseNumber: t.malsnumer?.toString() ?? '',
              licenseNumberDisplay: formatMessage(m.licenseNumberVariant, {
                arg: t.malsnumer?.toString() ?? formatMessage(m.unknown),
              }),
              licenseId: DEFAULT_LICENSE_ID,
              expired: isExpired,
              expireDate: t.gildistimi?.toISOString(),
              displayTag:
                isExpired !== undefined
                  ? expiryTag(formatMessage, isExpired)
                  : undefined,
              title: formatMessage(m.yourPCard),
              description: [{ text: formatMessage(m.yourPCardDescription) }],
            },
          },
        }
      })
    return mappedPayload
  }
}
