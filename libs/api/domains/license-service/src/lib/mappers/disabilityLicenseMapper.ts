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
    payload: Array<unknown>,
    locale: Locale = 'is',
    labels?: GenericLicenseLabels,
  ): Array<GenericUserLicensePayload> {
    if (!payload) return []

    const typedPayload = payload as Array<OrorkuSkirteini>

    const label = labels?.labels
    const mappedPayload: Array<GenericUserLicensePayload> = typedPayload.map(
      (t) => {
        const data: Array<GenericLicenseDataField> = [
          {
            type: GenericLicenseDataFieldType.Value,
            name: 'Grunnupplýsingar örorkuskírteinis',
            label: label ? label['fullName'] : i18n.fullName[locale],
            value: t.nafn ?? '',
          },
          {
            type: GenericLicenseDataFieldType.Value,
            label: label ? label['publisher'] : i18n.publisher[locale],
            value: 'Tryggingastofnun',
          },
          {
            type: GenericLicenseDataFieldType.Value,
            label: label ? label['validTo'] : i18n.validTo[locale],
            value: t.gildirtil?.toISOString() ?? '',
          },
        ]

        return {
          data,
          rawData: JSON.stringify(typedPayload),
          metadata: {
            licenseNumber: t.kennitala?.toString() ?? '',
            licenseId: 'default',
            expired: t.gildirtil
              ? !isAfter(new Date(t.gildirtil), new Date())
              : null,
          },
        }
      },
    )

    return mappedPayload
  }
}
