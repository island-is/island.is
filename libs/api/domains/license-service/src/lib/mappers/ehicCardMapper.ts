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
    payload?: unknown,
    locale: Locale = 'is',
    labels?: GenericLicenseLabels,
  ): GenericUserLicensePayload | null {
    const typedPayload = payload as EhicCardResponse

    if (!typedPayload || !typedPayload.expiryDate) return null

    const expired = typedPayload.expiryDate
      ? !isAfter(new Date(typedPayload.expiryDate?.toISOString()), new Date())
      : null

    const label = labels?.labels
    const data: Array<GenericLicenseDataField> = [
      typedPayload.cardHolderName
        ? {
            type: GenericLicenseDataFieldType.Value,
            label: getLabel('fullName', locale, label),
            value: typedPayload.cardHolderName ?? '',
          }
        : null,
      typedPayload.cardHolderNationalId
        ? {
            type: GenericLicenseDataFieldType.Value,
            label: getLabel('nationalId', locale, label),
            value: typedPayload.cardHolderNationalId
              ? format(typedPayload.cardHolderNationalId)
              : '',
          }
        : null,
      typedPayload.cardNumber
        ? {
            type: GenericLicenseDataFieldType.Value,
            label: getLabel('cardNumber', locale, label),
            value: typedPayload.cardNumber,
          }
        : null,
      typedPayload.issued
        ? {
            type: GenericLicenseDataFieldType.Value,
            label: getLabel('publishedDate', locale, label),
            value: typedPayload.issued.toISOString(),
          }
        : null,
      typedPayload.expiryDate
        ? {
            type: GenericLicenseDataFieldType.Value,
            label: getLabel('validTo', locale, label),
            value: typedPayload.expiryDate.toISOString(),
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
      rawData: JSON.stringify(typedPayload),
      metadata: {
        licenseNumber: typedPayload.cardNumber?.toString() ?? '',
        expired,
        expireDate: typedPayload.expiryDate.toISOString(),
        links: [
          typedPayload.hasTempCard && typedPayload.tempCardPdf
            ? {
                label: getLabel('downloadCard', locale, label),
                value: getDocument(typedPayload.tempCardPdf, 'pdf'),
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
  }
}
