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
import { DriverLicenseDto as DriversLicense } from '@island.is/clients/driving-license'
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

    const expired = typedPayload.dateValidTo
      ? !isAfter(new Date(typedPayload.dateValidTo), new Date())
      : null

    const label = labels?.labels

    // Parse license data into the fields as they're displayed on the physical drivers license
    // see: https://www.reglugerd.is/reglugerdir/eftir-raduneytum/srn/nr/18033
    const data = [
      {
        name: getLabel('basicInfoLicense', locale, label),
        type: GenericLicenseDataFieldType.Value,
        label: getLabel('licenseNumber', locale, label),
        value: (typedPayload?.id ?? '').toString(),
      },
      {
        type: GenericLicenseDataFieldType.Value,
        label: getLabel('fullName', locale, label),
        value: typedPayload.name ?? '',
      },
      {
        type: GenericLicenseDataFieldType.Value,
        label: getLabel('publisher', locale, label),
        value: 'Ríkislögreglustjóri',
      },
      {
        type: GenericLicenseDataFieldType.Value,
        label: getLabel('publishedDate', locale, label),
        value: typedPayload.publishDate
          ? new Date(typedPayload.publishDate).toISOString()
          : '',
      },
      {
        type: GenericLicenseDataFieldType.Value,
        label: getLabel('validTo', locale, label),
        value: typedPayload.dateValidTo
          ? new Date(typedPayload.dateValidTo).toISOString()
          : '',
      },
      {
        type: GenericLicenseDataFieldType.Group,
        label: getLabel('classesOfRights', locale, label),
        fields: (typedPayload.categories ?? []).map((field) => ({
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
              value: field.publishDate ? field.publishDate.toISOString() : '',
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
      rawData: JSON.stringify(typedPayload),
      metadata: {
        licenseNumber: typedPayload.id?.toString() ?? '',
        expired,
        expireDate: typedPayload.dateValidTo?.toISOString() ?? undefined,
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
