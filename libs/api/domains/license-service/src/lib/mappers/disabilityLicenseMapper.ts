import format from 'date-fns/format'
import isAfter from 'date-fns/isAfter'
import { Locale } from '@island.is/shared/types'
import { OrorkuSkirteini } from '@island.is/clients/disability-license'
import {
  GenericLicenseDataField,
  GenericLicenseDataFieldType,
  GenericLicenseLabels,
  GenericLicensePayloadMapper,
  GenericUserLicensePayload,
} from '../licenceService.type'
import { i18n } from '../utils/translations'

export class DisabilityLicensePayloadMapper
  implements GenericLicensePayloadMapper<OrorkuSkirteini> {
  parsePayload(
    payload: OrorkuSkirteini,
    locale: Locale = 'is',
    labels?: GenericLicenseLabels,
  ): GenericUserLicensePayload | null {
    if (!payload) return null
    const label = labels?.labels
    const data: Array<GenericLicenseDataField> = [
      {
        type: GenericLicenseDataFieldType.Value,
        name: 'Grunnupplýsingar örorkuskírteinis',
        label: label ? label['fullName'] : i18n.fullName[locale],
        value: payload.nafn ?? '',
      },
      {
        type: GenericLicenseDataFieldType.Value,
        label: label ? label['publisher'] : i18n.publisher[locale],
        value: 'Tryggingastofnun ríkisins',
      },
      {
        type: GenericLicenseDataFieldType.Value,
        label: label ? label['validTo'] : i18n.validTo[locale],
        value: payload.gildirtil?.toISOString() ?? '',
      },
    ]

    return {
      data,
      rawData: JSON.stringify(payload),
      metadata: {
        licenseNumber: payload.kennitala?.toString() ?? '',
        expired: payload.gildirtil
          ? !isAfter(new Date(payload.gildirtil), new Date())
          : null,
      },
    }
  }
}
