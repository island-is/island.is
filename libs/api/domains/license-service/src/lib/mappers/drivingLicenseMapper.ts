import {
  GenericLicenseDataFieldType,
  GenericLicenseLabels,
  GenericLicenseMapper,
  GenericUserLicensePayload,
} from '../licenceService.type'
import isAfter from 'date-fns/isAfter'
import { Locale } from '@island.is/shared/types'
import { DrivingLicenseDto } from '@island.is/clients/license-client'
import { getLabel } from '../utils/translations'
import { Injectable } from '@nestjs/common'

type ExcludesFalse = <T>(x: T | null | undefined | false | '') => x is T

@Injectable()
export class DrivingLicensePayloadMapper implements GenericLicenseMapper {
  parsePayload(
    payload?: unknown,
    locale: Locale = 'is',
    labels?: GenericLicenseLabels,
  ): GenericUserLicensePayload | null {
    if (!payload) return null

    const typedPayload = payload as DrivingLicenseDto

    const expired = typedPayload.gildirTil
      ? !isAfter(new Date(typedPayload.gildirTil), new Date())
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
        value: typedPayload.nafn,
      },
      {
        type: GenericLicenseDataFieldType.Value,
        label: getLabel('publisher', locale, label),
        value: typedPayload.nafnUtgafustadur,
      },
      {
        type: GenericLicenseDataFieldType.Value,
        label: getLabel('publishedDate', locale, label),
        value: typedPayload.utgafuDagsetning
          ? new Date(typedPayload.utgafuDagsetning).toISOString()
          : '',
      },
      {
        type: GenericLicenseDataFieldType.Value,
        label: getLabel('validTo', locale, label),
        value: typedPayload.gildirTil
          ? new Date(typedPayload.gildirTil).toISOString()
          : '',
      },
      {
        type: GenericLicenseDataFieldType.Group,
        label: getLabel('classesOfRights', locale, label),
        fields: (typedPayload.rettindi ?? []).map((field) => ({
          type: GenericLicenseDataFieldType.Category,
          name: (field.nr ?? '').trim(),
          label: '',
          fields: [
            {
              type: GenericLicenseDataFieldType.Value,
              label: getLabel('expiryDate', locale, label),
              value: field.gildirTil
                ? new Date(field.gildirTil).toISOString()
                : '',
            },
            {
              type: GenericLicenseDataFieldType.Value,
              label: getLabel('publishedDate', locale, label),
              value: field.utgafuDags
                ? new Date(field.utgafuDags).toISOString()
                : '',
            },
            field.aths && {
              type: GenericLicenseDataFieldType.Value,
              label: getLabel('comment', locale, label),
              value: field.aths,
            },
          ].filter((Boolean as unknown) as ExcludesFalse),
        })),
      },
    ]

    return {
      data,
      rawData: JSON.stringify(typedPayload),
      metadata: {
        licenseNumber: typedPayload.id?.toString() ?? '',
        expired,
        expireDate: typedPayload.gildirTil ?? undefined,
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
