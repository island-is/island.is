import {
  VinnuvelaDto,
  VinnuvelaRettindiDto,
} from '@island.is/clients/adr-and-machine-license'

import isAfter from 'date-fns/isAfter'
import { Locale } from '@island.is/shared/types'
import {
  GenericLicenseLabels,
  GenericUserLicensePayload,
  GenericLicenseDataField,
  GenericLicenseDataFieldType,
  GenericLicenseMapper,
  DEFAULT_LICENSE_ID,
} from '../licenceService.type'
import { getLabel } from '../utils/translations'
import { Injectable } from '@nestjs/common'
@Injectable()
export class MachineLicensePayloadMapper implements GenericLicenseMapper {
  private checkLicenseExpirationDate(license: VinnuvelaDto) {
    return license.vinnuvelaRettindi
      ? license.vinnuvelaRettindi
          .filter((field) => field.kenna || field.stjorna)
          .every(
            (field: VinnuvelaRettindiDto) =>
              field.kenna &&
              !isAfter(new Date(field.kenna), new Date()) &&
              field.stjorna &&
              !isAfter(new Date(field.stjorna), new Date()),
          )
      : null
  }

  parsePayload(
    payload: Array<unknown>,
    locale: Locale = 'is',
    labels?: GenericLicenseLabels,
  ): Array<GenericUserLicensePayload> {
    if (!payload) return []

    const typedPayload = payload as Array<VinnuvelaDto>
    const label = labels?.labels

    const mappedPayload: Array<GenericUserLicensePayload> = typedPayload.map(
      (t) => {
        const expired: boolean | null = this.checkLicenseExpirationDate(t)

        const data: Array<GenericLicenseDataField> = [
          {
            name: getLabel('basicInfoLicense', locale, label),
            type: GenericLicenseDataFieldType.Value,
            label: getLabel('licenseNumber', locale, label),
            value: t.skirteinisNumer?.toString(),
          },
          {
            type: GenericLicenseDataFieldType.Value,
            label: getLabel('fullName', locale, label),
            value: t?.fulltNafn ?? '',
          },
          {
            type: GenericLicenseDataFieldType.Value,
            label: getLabel('placeOfIssue', locale, label),
            value: t.utgafuStadur ?? '',
          },
          {
            type: GenericLicenseDataFieldType.Value,
            label: getLabel('firstPublishedDate', locale, label),
            value: t.fyrstiUtgafuDagur?.toString(),
          },
          {
            type: GenericLicenseDataFieldType.Value,
            label: getLabel('validTo', locale, label),
            value: getLabel('seeRights', locale, label),
          },
          {
            type: GenericLicenseDataFieldType.Value,
            label: getLabel('drivingLicenseNumber', locale, label),
            value: t.okuskirteinisNumer ?? '',
          },
          {
            type: GenericLicenseDataFieldType.Group,
            label: getLabel('classesOfRights', locale, label),
            fields: (t.vinnuvelaRettindi ?? [])
              .filter((field) => field.kenna || field.stjorna)
              .map((field) => ({
                type: GenericLicenseDataFieldType.Category,
                name: field.flokkur ?? '',
                label: field.fulltHeiti ?? field.stuttHeiti ?? '',
                description: field.fulltHeiti ?? field.stuttHeiti ?? '',
                fields: this.parseVvrRights(field, locale, labels),
              })),
          },
        ]

        return {
          data,
          rawData: JSON.stringify(t),
          metadata: {
            licenseNumber: t.skirteinisNumer?.toString() ?? '',
            licenseId: DEFAULT_LICENSE_ID,
            expired: expired,
          },
        }
      },
    )
    return mappedPayload
  }

  parseVvrRights(
    rights: VinnuvelaRettindiDto,
    locale: Locale = 'is',
    labels?: GenericLicenseLabels,
  ): Array<GenericLicenseDataField> | undefined {
    const fields = new Array<GenericLicenseDataField>()
    const label = labels?.labels
    if (rights.stjorna) {
      fields.push({
        type: GenericLicenseDataFieldType.Value,
        label: getLabel('control', locale, label),
        value: rights.stjorna,
      })
    }
    if (rights.kenna) {
      fields.push({
        type: GenericLicenseDataFieldType.Value,
        label: getLabel('teach', locale, label),
        value: rights.kenna,
      })
    }

    return fields?.length ? fields : undefined
  }
}
