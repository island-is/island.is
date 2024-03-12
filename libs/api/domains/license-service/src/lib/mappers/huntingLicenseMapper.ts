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
import dateFormat from 'date-fns/format'
import { isDefined } from '@island.is/shared/utils'
import capitalize from 'lodash/capitalize'

const formatDate = (date: Date) => dateFormat(date, 'dd.MM.yyyy')

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
        let address = t.holderAddress
        if (t.holderCity) {
          address += `, ${t.holderCity}`
        }

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
            value: address,
          },
          {
            type: GenericLicenseDataFieldType.Value,
            label: getLabel('cardNumber', locale, label),
            value: t.number ?? '',
          },
          t.validFrom
            ? {
                type: GenericLicenseDataFieldType.Value,
                label: getLabel('publishedDate', locale, label),
                value: formatDate(t.validFrom),
              }
            : undefined,
          t.validFrom && t.validTo
            ? {
                type: GenericLicenseDataFieldType.Value,
                label: getLabel('validDuration', locale, label),
                value: `${formatDate(t.validFrom)} - ${formatDate(t.validTo)}`,
              }
            : undefined,
          t.permitFor?.length
            ? {
                type: GenericLicenseDataFieldType.Value,
                label: getLabel('huntingPermitValidFor', locale, label),
                value: t.permitFor?.map((p) => capitalize(p))?.join(', ') ?? '',
              }
            : undefined,
          t.benefits?.length
            ? {
                type: GenericLicenseDataFieldType.Value,
                label: getLabel('huntingPermitBenefits', locale, label),
                value:
                  t.benefits?.map((b) => capitalize(b.land))?.join(', ') ?? '',
              }
            : undefined,
        ].filter(isDefined)

        return {
          data,
          rawData: JSON.stringify(t),
          metadata: {
            licenseNumber: t.number?.toString() ?? '',
            licenseId: DEFAULT_LICENSE_ID,
            expired: !t.isValid,
            expireDate: t.validTo ? t.validTo.toISOString() : undefined,
          },
        }
      },
    )

    return mappedPayload
  }
}
