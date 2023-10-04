import {
  GenericLicenseDataFieldType,
  GenericLicenseLabels,
  GenericLicenseMapper,
  GenericUserLicensePayload,
} from '../licenceService.type'
import isAfter from 'date-fns/isAfter'
import { Locale } from '@island.is/shared/types'
import { getLabel } from '../utils/translations'
import { Injectable } from '@nestjs/common'
import { DriversLicense } from '@island.is/clients/driving-license'
import { isDefined } from '@island.is/shared/utils'

@Injectable()
export class DrivingLicensePayloadMapper implements GenericLicenseMapper {
  parsePayload(
    payload?: unknown,
    locale: Locale = 'is',
    labels?: GenericLicenseLabels,
  ): GenericUserLicensePayload | null {
    if (!payload) return null

    const typedPayload = payload as DriversLicense

    const expired = typedPayload.expires
      ? !isAfter(new Date(typedPayload.expires), new Date())
      : null

    const label = labels?.labels

    // Parse license data into the fields as they're displayed on the physical drivers license
    // see: https://www.samgongustofa.is/umferd/nam-og-rettindi/skirteini-og-rettindi/okurettindi-og-skirteini/
    const data = [
      // We don't get the name split into two from the API, combine
      {
        name: getLabel('basicInfoLicense', locale, label),
        type: GenericLicenseDataFieldType.Value,
        label: getLabel('licenseNumber', locale, label),
        value: (typedPayload?.id ?? '').toString(),
      },
      {
        type: GenericLicenseDataFieldType.Value,
        label: getLabel('fullName', locale, label),
        value: typedPayload.name,
      },
      {
        type: GenericLicenseDataFieldType.Value,
        label: getLabel('publisher', locale, label),
        // todo:
        // value: typedPayload.location ?? '',
        value: '',
      },
      {
        type: GenericLicenseDataFieldType.Value,
        label: getLabel('publishedDate', locale, label),
        value: typedPayload.issued
          ? new Date(typedPayload.issued).toISOString()
          : '',
      },
      {
        type: GenericLicenseDataFieldType.Value,
        label: getLabel('validTo', locale, label),
        value: typedPayload.expires
          ? new Date(typedPayload.expires).toISOString()
          : '',
      },
      {
        type: GenericLicenseDataFieldType.Group,
        label: getLabel('classesOfRights', locale, label),
        fields: (typedPayload.categories ?? []).map((field) => ({
          type: GenericLicenseDataFieldType.Category,
          name: field.name ?? '',
          label: '',
          fields: [
            {
              type: GenericLicenseDataFieldType.Value,
              label: getLabel('expiryDate', locale, label),
              value: field.expires ? field.expires.toISOString() : '',
            },
            {
              type: GenericLicenseDataFieldType.Value,
              label: getLabel('publishedDate', locale, label),
              value: field.issued ? field.issued.toISOString() : '',
            },
            field.comments
              ? {
                  type: GenericLicenseDataFieldType.Value,
                  label: getLabel('comment', locale, label),
                  value: field.comments ?? '',
                }
              : undefined,
          ].filter(isDefined),
        })),
      },
    ]

    return {
      data,
      rawData: JSON.stringify(typedPayload),
      metadata: {
        licenseNumber: typedPayload.id?.toString() ?? '',
        expired,
        expireDate: typedPayload.expires?.toISOString() ?? undefined,
        links: [
          {
            label: getLabel('renewDrivingLicense', locale, label),
            value: 'https://island.is/endurnyjun-okuskirteina',
          },
        ],
      },
    }
  }
}
