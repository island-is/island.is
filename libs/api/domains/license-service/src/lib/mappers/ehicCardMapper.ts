import isAfter from 'date-fns/isAfter'
import { Locale } from '@island.is/shared/types'
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
  GenericUserLicenseMetaLinksType,
} from '../licenceService.type'
import { Injectable } from '@nestjs/common'
import { getDocument, isDefined } from '@island.is/shared/utils'
import { format } from 'kennitala'
import { EhicCardResponse } from '@island.is/clients/license-client'
import { IntlService } from '@island.is/cms-translations'
import { LICENSE_NAMESPACE } from '../licenseService.constants'
import { m } from '../messages'

@Injectable()
export class EHICCardPayloadMapper implements GenericLicenseMapper {
  constructor(private readonly intlService: IntlService) {}
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

    const typedPayload = payload as Array<EhicCardResponse>

    const { formatMessage } = await this.intlService.useIntl(
      [LICENSE_NAMESPACE],
      locale,
    )

    const mappedPayload: Array<GenericLicenseMappedPayloadResponse> =
      typedPayload
        .map((t) => {
          if (!t || !t.expiryDate) return null

          const expired = t.expiryDate
            ? !isAfter(new Date(t.expiryDate?.toISOString()), new Date())
            : null

<<<<<<< Updated upstream
          const data: Array<GenericLicenseDataField> = [
            t.cardHolderName
              ? {
                  type: GenericLicenseDataFieldType.Value,
                  label: getLabel('fullName', locale, label),
                  value: t.cardHolderName ?? '',
                }
              : null,
            t.cardHolderNationalId
              ? {
                  type: GenericLicenseDataFieldType.Value,
                  label: getLabel('nationalId', locale, label),
                  value: t.cardHolderNationalId
                    ? format(t.cardHolderNationalId)
                    : '',
                }
              : null,
            t.cardNumber
              ? {
                  type: GenericLicenseDataFieldType.Value,
                  label: getLabel('cardNumber', locale, label),
                  value: t.cardNumber,
                }
              : null,
            t.issued
              ? {
                  type: GenericLicenseDataFieldType.Value,
                  label: getLabel('publishedDate', locale, label),
                  value: t.issued.toISOString(),
                }
              : null,
            t.expiryDate
              ? {
                  type: GenericLicenseDataFieldType.Value,
                  label: getLabel('validTo', locale, label),
                  value: t.expiryDate.toISOString(),
                }
              : null,
            {
              type: GenericLicenseDataFieldType.Value,
              label: getLabel('publisher', locale, label),
              value: 'Sjúkratryggingar',
            },
          ].filter(isDefined)

          return {
=======
<<<<<<< Updated upstream
        const data: Array<GenericLicenseDataField> = [
          t.cardHolderName
            ? {
                type: GenericLicenseDataFieldType.Value,
                label: getLabel('fullName', locale, label),
                value: t.cardHolderName ?? '',
              }
            : null,
          t.cardHolderNationalId
            ? {
                type: GenericLicenseDataFieldType.Value,
                label: getLabel('nationalId', locale, label),
                value: t.cardHolderNationalId
                  ? format(t.cardHolderNationalId)
                  : '',
              }
            : null,
          t.cardNumber
            ? {
                type: GenericLicenseDataFieldType.Value,
                label: getLabel('cardNumber', locale, label),
                value: t.cardNumber,
              }
            : null,
          t.issued
            ? {
                type: GenericLicenseDataFieldType.Value,
                label: getLabel('publishedDate', locale, label),
                value: t.issued.toISOString(),
              }
            : null,
          t.expiryDate
            ? {
                type: GenericLicenseDataFieldType.Value,
                label: getLabel('validTo', locale, label),
                value: t.expiryDate.toISOString(),
              }
            : null,
          {
            type: GenericLicenseDataFieldType.Value,
            label: getLabel('publisher', locale, label),
            value: 'Sjúkratryggingar',
          },
        ].filter(isDefined)

        return {
          data,
          rawData: JSON.stringify(t),
          metadata: {
            licenseNumber: t.cardNumber?.toString() ?? '',
            licenseId: t.cardNumber?.toString() ?? 'default',
            expired,
            expireDate: t.expiryDate.toISOString(),
            links: [
              t.hasTempCard && t.tempCardPdf
                ? {
                    label: getLabel('downloadCard', locale, label),
                    value: getDocument(t.tempCardPdf, 'pdf'),
                    type: GenericUserLicenseMetaLinksType.Download,
                    name: `EHIC_${new Date().toISOString().split('T')[0]}.pdf`,
                  }
                : undefined,
              {
                label: getLabel('applyForNewCard', locale, label),
                value: '/umsoknir/evropska-sjukratryggingakortid',
=======
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
                    ? format(t.cardHolderNationalId)
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
                  value: t.issued.toISOString(),
                }
              : null,
            t.expiryDate
              ? {
                  type: GenericLicenseDataFieldType.Value,
                  label: formatMessage(m.validTo),
                  value: t.expiryDate.toISOString(),
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
>>>>>>> Stashed changes
            type: 'user' as const,
            payload: {
              data,
              rawData: JSON.stringify(t),
              metadata: {
                licenseNumber: t.cardNumber?.toString() ?? '',
                licenseId: t.cardNumber?.toString() ?? 'default',
                expired,
                expireDate: t.expiryDate.toISOString(),
                links: [
                  t.hasTempCard && t.tempCardPdf
                    ? {
<<<<<<< Updated upstream
                        label: getLabel('downloadCard', locale, label),
=======
                        label: formatMessage(m.downloadCard),
>>>>>>> Stashed changes
                        value: getDocument(t.tempCardPdf, 'pdf'),
                        type: GenericUserLicenseMetaLinksType.Download,
                        name: `EHIC_${
                          new Date().toISOString().split('T')[0]
                        }.pdf`,
                      }
                    : undefined,
                  {
<<<<<<< Updated upstream
                    label: getLabel('applyForNewCard', locale, label),
                    value: '/umsoknir/evropska-sjukratryggingakortid',
                  },
                ].filter(isDefined),
=======
                    label: formatMessage(m.applyForNewCard),
                    value: '/umsoknir/evropska-sjukratryggingakortid',
                  },
                ].filter(isDefined),
>>>>>>> Stashed changes
>>>>>>> Stashed changes
              },
            },
          }
        })
        .filter(isDefined)

    return mappedPayload
  }
}
