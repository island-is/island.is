import isAfter from 'date-fns/isAfter'
import { Locale } from '@island.is/shared/types'
import { OrorkuSkirteini } from '@island.is/clients/disability-license'
import {
  GenericLicenseDataField,
  GenericLicenseDataFieldType,
  GenericLicenseLabels,
  GenericLicenseMapper,
  GenericUserLicensePayload,
} from '../licenceService.type'
import { i18n } from '../utils/translations'
import { Injectable } from '@nestjs/common'

@Injectable()
export class DisabilityLicensePayloadMapper implements GenericLicenseMapper {
  parsePayload(
    payload?: unknown,
    locale: Locale = 'is',
    labels?: GenericLicenseLabels,
  ): GenericUserLicensePayload | null {
    if (!payload) return null
    const typedPayload = payload as OrorkuSkirteini

    const label = labels?.labels
    const data: Array<GenericLicenseDataField> = [
      {
        type: GenericLicenseDataFieldType.Value,
        name: 'Grunnupplýsingar örorkuskírteinis',
        label: label ? label['fullName'] : i18n.fullName[locale],
        value: typedPayload.nafn ?? '',
      },
      {
        type: GenericLicenseDataFieldType.Value,
        label: label ? label['publisher'] : i18n.publisher[locale],
        value: 'Tryggingastofnun',
      },
      {
        type: GenericLicenseDataFieldType.Value,
        label: label ? label['validTo'] : i18n.validTo[locale],
        value: typedPayload.gildirtil?.toISOString() ?? '',
      },
    ]

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
