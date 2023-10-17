import isAfter from 'date-fns/isAfter'
import { Locale } from '@island.is/shared/types'
import {
  GenericLicenseDataField,
  GenericLicenseDataFieldType,
  GenericLicenseLabels,
  GenericLicenseMapper,
  GenericUserLicensePayload,
} from '../licenceService.type'
import { getLabel, i18n } from '../utils/translations'
import { Injectable } from '@nestjs/common'
import { Staediskortamal } from '@island.is/clients/p-card'
import { isDefined } from '@island.is/shared/utils'

@Injectable()
export class PCardPayloadMapper implements GenericLicenseMapper {
  parsePayload(
    payload?: unknown,
    locale: Locale = 'is',
    labels?: GenericLicenseLabels,
  ): GenericUserLicensePayload | null {
    if (!payload) return null
    const typedPayload = payload as Staediskortamal

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
            value: typedPayload.kennitala,
          }
        : null,
      typedPayload.nafn
        ? {
            type: GenericLicenseDataFieldType.Value,
            label: getLabel('name', locale, label),
            value: typedPayload.nafn,
          }
        : null,
      typedPayload.nafn
        ? {
            type: GenericLicenseDataFieldType.Value,
            label: getLabel('name', locale, label),
            value: typedPayload.nafn,
          }
        : null,
      typedPayload.nafn
        ? {
            type: GenericLicenseDataFieldType.Value,
            label: getLabel('name', locale, label),
            value: typedPayload.nafn,
          }
        : null,
      typedPayload.nafn
        ? {
            type: GenericLicenseDataFieldType.Value,
            label: getLabel('name', locale, label),
            value: typedPayload.nafn,
          }
        : null,
    ].filter(isDefined)

    return {
      data,
      rawData: JSON.stringify(typedPayload),
      metadata: {
        licenseNumber: typedPayload.kennitala?.toString() ?? '',
        expired: typedPayload.gildirtil
          ? !isAfter(new Date(typedPayload.gildirtil), new Date())
          : null,
      },
    }
  }
}
