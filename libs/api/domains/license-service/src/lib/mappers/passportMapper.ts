import isAfter from 'date-fns/isAfter'
import { Locale } from '@island.is/shared/types'
import {
  DEFAULT_LICENSE_ID,
  GenericLicenseDataField,
  GenericLicenseDataFieldType,
  GenericLicenseLabels,
  GenericLicenseMapper,
  GenericUserLicensePayload,
} from '../licenceService.type'
import { getLabel } from '../utils/translations'
import { Injectable } from '@nestjs/common'
import { Passport } from '@island.is/clients/passports'
import { isDefined } from '@island.is/shared/utils'
import { format } from 'kennitala'

@Injectable()
export class PassportPayloadMapper implements GenericLicenseMapper {
  parsePayload(
    payload: Array<unknown>,
    locale: Locale = 'is',
    labels?: GenericLicenseLabels,
  ): Array<GenericUserLicensePayload> {
    if (!payload) return []

    const typedPayload = payload as Array<Passport>
    const label = labels?.labels

    const mappedPayload: Array<GenericUserLicensePayload> = typedPayload.map(
      (t) => {
        const expired = t.gildistimi
          ? !isAfter(new Date(t.gildistimi.toISOString()), new Date())
          : null

        const data: Array<GenericLicenseDataField> = [
          t.nafn
            ? {
                type: GenericLicenseDataFieldType.Value,
                label: getLabel('name', locale, label),
                value: t.nafn,
              }
            : null,
          t.kennitala
            ? {
                type: GenericLicenseDataFieldType.Value,
                label: getLabel('nationalId', locale, label),
                value: format(t.kennitala),
              }
            : null,
          t.malsnumer
            ? {
                type: GenericLicenseDataFieldType.Value,
                label: getLabel('cardNumber', locale, label),
                value: t.malsnumer,
              }
            : null,
          t.utgafudagur
            ? {
                type: GenericLicenseDataFieldType.Value,
                label: getLabel('publishedDate', locale, label),
                value: t.utgafudagur.toISOString(),
              }
            : null,
          t.gildistimi
            ? {
                type: GenericLicenseDataFieldType.Value,
                label: getLabel('validTo', locale, label),
                value: t.gildistimi.toISOString(),
              }
            : null,
          t.utgefandi
            ? {
                type: GenericLicenseDataFieldType.Value,
                label: getLabel('publisher', locale, label),
                value: t.utgefandi,
              }
            : null,
        ].filter(isDefined)

        return {
          data,
          rawData: JSON.stringify(t),
          metadata: {
            licenseNumber: t.malsnumer?.toString() ?? '',
            licenseId: DEFAULT_LICENSE_ID,
            expired,
            expireDate: t.gildistimi?.toISOString(),
          },
        }
      },
    )
    return mappedPayload
  }
}
