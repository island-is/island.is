import {
  DEFAULT_LICENSE_ID,
  GenericLicenseDataFieldType,
  GenericLicenseLabels,
  GenericLicenseMapper,
  GenericUserLicensePayload,
} from '../licenceService.type'
import isAfter from 'date-fns/isAfter'
import { Locale } from '@island.is/shared/types'
import { getLabel } from '../utils/translations'
import { Injectable } from '@nestjs/common'
import { DriverLicenseDto as DriversLicense } from '@island.is/clients/driving-license'
import { isDefined } from '@island.is/shared/utils'

@Injectable()
export class DrivingLicensePayloadMapper implements GenericLicenseMapper {
  parsePayload(
    payload: Array<unknown>,
    locale: Locale = 'is',
    labels?: GenericLicenseLabels,
  ): Array<GenericUserLicensePayload> {
    if (!payload) return []

    const typedPayload = payload as Array<DriversLicense>

    const label = labels?.labels

    // Parse license data into the fields as they're displayed on the physical drivers license
    // see: https://www.reglugerd.is/reglugerdir/eftir-raduneytum/srn/nr/18033

    const mappedPayload: Array<GenericUserLicensePayload> = typedPayload.map(
      (t) => {
        const expired = t.dateValidTo
          ? !isAfter(new Date(t.dateValidTo), new Date())
          : null

        const data = [
          {
            name: getLabel('basicInfoLicense', locale, label),
            type: GenericLicenseDataFieldType.Value,
            label: getLabel('licenseNumber', locale, label),
            value: (t.id ?? '').toString(),
          },
          {
            type: GenericLicenseDataFieldType.Value,
            label: getLabel('fullName', locale, label),
            value: t.name ?? '',
          },
          {
            type: GenericLicenseDataFieldType.Value,
            label: getLabel('publisher', locale, label),
            value: 'Ríkislögreglustjóri',
          },
          {
            type: GenericLicenseDataFieldType.Value,
            label: getLabel('publishedDate', locale, label),
            value: t.publishDate ? new Date(t.publishDate).toISOString() : '',
          },
          {
            type: GenericLicenseDataFieldType.Value,
            label: getLabel('validTo', locale, label),
            value: t.dateValidTo ? new Date(t.dateValidTo).toISOString() : '',
          },
          {
            type: GenericLicenseDataFieldType.Group,
            label: getLabel('classesOfRights', locale, label),
            fields: (t.categories ?? []).map((field) => ({
              type: GenericLicenseDataFieldType.Category,
              name: field.nr ?? '',
              label: '',
              fields: [
                {
                  type: GenericLicenseDataFieldType.Value,
                  label: getLabel('expiryDate', locale, label),
                  value: field.dateTo ? field.dateTo.toISOString() : '',
                },
                {
                  type: GenericLicenseDataFieldType.Value,
                  label: getLabel('publishedDate', locale, label),
                  value: field.publishDate
                    ? field.publishDate.toISOString()
                    : '',
                },
                field.comment
                  ? {
                      type: GenericLicenseDataFieldType.Value,
                      label: getLabel('comment', locale, label),
                      value: field.comment ?? '',
                    }
                  : undefined,
              ].filter(isDefined),
            })),
          },
        ]

        return {
          data,
          rawData: JSON.stringify(t),
          metadata: {
            licenseNumber: t.id?.toString() ?? '',
            licenseId: DEFAULT_LICENSE_ID,
            expired,
            expireDate: t.dateValidTo?.toISOString() ?? undefined,
            links: [
              {
                label: getLabel('renewDrivingLicense', locale, label),
                value: 'https://island.is/endurnyjun-okuskirteina',
              },
            ],
          },
        }
      },
    )
    return mappedPayload
  }
}
