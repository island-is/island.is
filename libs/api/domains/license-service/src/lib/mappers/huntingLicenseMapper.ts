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
import { HuntingLicenseDto } from '@island.is/clients/hunting-license'
import { format } from 'kennitala'

@Injectable()
export class HuntingLicensePayloadMapper implements GenericLicenseMapper {
  parsePayload(
    payload: Array<unknown>,
    locale: Locale = 'is',
    labels?: GenericLicenseLabels,
  ): Array<GenericUserLicensePayload> {
    if (!payload) return []

    const typedPayload = payload as Array<HuntingLicenseDto>

    const label = labels?.labels

    const mappedPayload: Array<GenericUserLicensePayload> = typedPayload.map(
      (t) => {
        const data: Array<GenericLicenseDataField> = [
          {
            name: getLabel('basicInfoLicense', locale, label),
            type: GenericLicenseDataFieldType.Value,
            label: getLabel('personName', locale, label),
            value: t.holderName ?? '',
          },
          {
            type: GenericLicenseDataFieldType.Value,
            label: getLabel('nationalId', locale, label),
            value: t.holderNationalId ? format(t.holderNationalId) : '',
          },
          {
            type: GenericLicenseDataFieldType.Value,
            label: getLabel('legalAddress', locale, label),
            value: '',
          },
          {
            type: GenericLicenseDataFieldType.Value,
            label: getLabel('cardNumber', locale, label),
            value: t.number ?? '',
          },
          {
            type: GenericLicenseDataFieldType.Value,
            label: getLabel('publishedDate', locale, label),
            value: t.validFrom?.toString() ?? '',
          },
          {
            type: GenericLicenseDataFieldType.Value,
            label: getLabel('validDuration', locale, label),
            value: `${t.validFrom} - ${t.validTo}` ?? '',
          },
          {
            type: GenericLicenseDataFieldType.Value,
            label: getLabel('huntingPermitValidFor', locale, label),
            value: t.permitFor?.join(' ,') ?? '',
          },
        ]

        return {
          data,
          rawData: JSON.stringify(t),
          metadata: {
            licenseNumber: t.number?.toString() ?? '',
            licenseId: DEFAULT_LICENSE_ID,
            expired: t.isValid,
            expireDate: t.validTo ?? undefined,
          },
        }
      },
    )

    return mappedPayload
  }
}
