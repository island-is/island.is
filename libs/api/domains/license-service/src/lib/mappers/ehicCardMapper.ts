import isAfter from 'date-fns/isAfter'
import { Locale } from '@island.is/shared/types'
import {
  ExpiryStatus,
  GenericLicenseDataFieldType,
  GenericLicenseMappedPayloadResponse,
  GenericLicenseMapper,
  GenericUserLicenseMetaLinksType,
} from '../licenceService.type'
import { Injectable } from '@nestjs/common'
import { getDocument, isDefined } from '@island.is/shared/utils'
import { format as formatNationalId } from 'kennitala'
import { EhicCardResponse } from '@island.is/clients/license-client'
import { IntlService } from '@island.is/cms-translations'
import { LICENSE_NAMESPACE } from '../licenseService.constants'
import { m } from '../messages'
import { expiryTag, formatDate } from '../utils'
import { GenericLicenseDataField } from '../dto/GenericLicenseDataField.dto'

@Injectable()
export class EHICCardPayloadMapper implements GenericLicenseMapper {
  constructor(private readonly intlService: IntlService) {}
  async parsePayload(
    payload: Array<unknown>,
    locale: Locale = 'is',
  ): Promise<Array<GenericLicenseMappedPayloadResponse>> {
    if (!payload) return Promise.resolve([])

    const typedPayload = payload as Array<EhicCardResponse>

    const { formatMessage } = await this.intlService.useIntl(
      [LICENSE_NAMESPACE],
      locale,
    )

    const mappedPayload: Array<GenericLicenseMappedPayloadResponse> =
      typedPayload
        .map((t) => {
          if (!t || !t.expiryDate) return null

          const isExpired = t.expiryDate
            ? !isAfter(new Date(t.expiryDate?.toISOString()), new Date())
            : undefined

          const data: Array<GenericLicenseDataField> = [
            t.cardHolderName
              ? {
                  type: GenericLicenseDataFieldType.Value,
                  label: formatMessage(m.fullName),
                  value: t.cardHolderName ?? '',
                }
              : null,
            t.cardHolderNationalId
              ? {
                  type: GenericLicenseDataFieldType.Value,
                  label: formatMessage(m.nationalId),
                  value: t.cardHolderNationalId
                    ? formatNationalId(t.cardHolderNationalId)
                    : '',
                }
              : null,
            t.cardNumber
              ? {
                  type: GenericLicenseDataFieldType.Value,
                  label: formatMessage(m.cardNumber),
                  value: t.cardNumber,
                }
              : null,
            t.issued
              ? {
                  type: GenericLicenseDataFieldType.Value,
                  label: formatMessage(m.publishedDate),
                  value: t.issued ? formatDate(t.issued) : '',
                }
              : null,
            t.expiryDate
              ? {
                  type: GenericLicenseDataFieldType.Value,
                  label: formatMessage(m.validTo),
                  value: t.expiryDate ? formatDate(t.expiryDate) : '',
                  tag: expiryTag(formatMessage, isExpired),
                }
              : null,
            {
              type: GenericLicenseDataFieldType.Value,
              label: formatMessage(m.publisher),
              value: 'Sjúkratryggingar',
            },
          ].filter(isDefined)

          return {
            licenseName: formatMessage(m.ehicCard),
            type: 'user' as const,
            payload: {
              data,
              rawData: JSON.stringify(t),
              metadata: {
                licenseNumber: t.cardNumber?.toString() ?? '',
                subtitle: formatMessage(m.licenseNumberVariant, {
                  arg: t.cardNumber?.toString() ?? formatMessage(m.unknown),
                }),
                licenseId: t.cardNumber?.toString() ?? 'default',
                expiryStatus:
                  isExpired === undefined
                    ? ExpiryStatus.UNKNOWN
                    : isExpired
                    ? ExpiryStatus.EXPIRED
                    : ExpiryStatus.ACTIVE,
                expired: isExpired,
                expireDate: t.expiryDate.toISOString(),
                displayTag: expiryTag(
                  formatMessage,
                  isExpired,
                  formatMessage(m.validUntil, {
                    arg: formatDate(t.expiryDate),
                  }),
                ),
                links: [
                  t.hasTempCard && t.tempCardPdf
                    ? {
                        label: formatMessage(m.downloadCard),
                        value: getDocument(t.tempCardPdf, 'pdf'),
                        type: GenericUserLicenseMetaLinksType.Download,
                        name: `EHIC_${
                          new Date().toISOString().split('T')[0]
                        }.pdf`,
                      }
                    : undefined,
                  {
                    label: formatMessage(m.applyForNewCard),
                    value: '/umsoknir/evropska-sjukratryggingakortid',
                  },
                ].filter(isDefined),
                name: formatMessage(m.ehicCard),
                title: formatMessage(m.ehicCard),
                description: [
                  { text: formatMessage(m.ehicDescription) },
                  {
                    text: formatMessage(m.ehicDescription2),
                    linkInText: formatMessage(m.ehicDescriptionLink),
                  },
                ],
              },
            },
          }
        })
        .filter(isDefined)

    return mappedPayload
  }
}
