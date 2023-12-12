import isAfter from 'date-fns/isAfter'
import { Locale } from '@island.is/shared/types'
import {
  GenericLicenseDataField,
  GenericLicenseDataFieldType,
  GenericLicenseLabels,
  GenericLicenseMapper,
  GenericUserLicensePayload,
} from '../licenceService.type'
import { getLabel } from '../utils/translations'
import { Injectable } from '@nestjs/common'
import { Staediskortamal } from '@island.is/clients/p-card'
import { isDefined } from '@island.is/shared/utils'
import { format } from 'kennitala'

@Injectable()
export class PCardPayloadMapper implements GenericLicenseMapper {
  parsePayload(
    payload?: unknown,
    locale: Locale = 'is',
    labels?: GenericLicenseLabels,
  ): GenericUserLicensePayload | null {
    if (!payload) return null
    const typedPayload = payload as Staediskortamal

    const expired = typedPayload.gildistimi
      ? !isAfter(new Date(typedPayload.gildistimi.toISOString()), new Date())
      : null

    const label = labels?.labels
    const data: Array<GenericLicenseDataField> = [
      typedPayload.nafn
        ? {
            type: GenericLicenseDataFieldType.Value,
            label: getLabel('name', locale, label),
            value: typedPayload.nafn,
          }
        : null,
      typedPayload.kennitala
        ? {
            type: GenericLicenseDataFieldType.Value,
            label: getLabel('nationalId', locale, label),
            value: format(typedPayload.kennitala),
          }
        : null,
      typedPayload.malsnumer
        ? {
            type: GenericLicenseDataFieldType.Value,
            label: getLabel('cardNumber', locale, label),
            value: typedPayload.malsnumer,
          }
        : null,
      typedPayload.utgafudagur
        ? {
            type: GenericLicenseDataFieldType.Value,
            label: getLabel('publishedDate', locale, label),
            value: typedPayload.utgafudagur.toISOString(),
          }
        : null,
      typedPayload.gildistimi
        ? {
            type: GenericLicenseDataFieldType.Value,
            label: getLabel('validTo', locale, label),
            value: typedPayload.gildistimi.toISOString(),
          }
        : null,
      typedPayload.utgefandi
        ? {
            type: GenericLicenseDataFieldType.Value,
            label: getLabel('publisher', locale, label),
            value: typedPayload.utgefandi,
          }
        : null,
    ].filter(isDefined)

    return {
      data,
      rawData: JSON.stringify(typedPayload),
      metadata: {
        licenseNumber: typedPayload.malsnumer?.toString() ?? '',
        expired,
        expireDate: typedPayload.gildistimi?.toISOString(),
      },
    }
  }
}
