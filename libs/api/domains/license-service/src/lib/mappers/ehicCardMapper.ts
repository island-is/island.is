import isAfter from 'date-fns/isAfter'
import { Locale } from '@island.is/shared/types'
import {
  GenericLicenseDataField,
  GenericLicenseDataFieldType,
  GenericLicenseLabels,
  GenericLicenseMapper,
  GenericUserLicenseMetaLinksType,
  GenericUserLicensePayload,
} from '../licenceService.type'
import { getLabel } from '../utils/translations'
import { Injectable } from '@nestjs/common'
import { getDocument, isDefined } from '@island.is/shared/utils'
import { format } from 'kennitala'
import { EhicCardResponse } from '@island.is/clients/license-client'

@Injectable()
export class EHICCardPayloadMapper implements GenericLicenseMapper {
  parsePayload(
    payload: Array<unknown>,
    locale: Locale = 'is',
    labels?: GenericLicenseLabels,
  ): Array<GenericUserLicensePayload> {
    if (!payload) return []

    const typedPayload = payload as Array<EhicCardResponse>
    const label = labels?.labels

    const mappedPayload: Array<GenericUserLicensePayload> = typedPayload
      .map((t) => {
        if (!t || !t.expiryDate) return null

        const expired = t.expiryDate
          ? !isAfter(new Date(t.expiryDate?.toISOString()), new Date())
          : null

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
              },
            ].filter(isDefined),
          },
        }
      })
      .filter(isDefined)

    return mappedPayload
  }
}
