import {
  FirearmCategories,
  FirearmProperty,
} from '@island.is/clients/firearm-license'
import isAfter from 'date-fns/isAfter'
import { Locale } from '@island.is/shared/types'
import {
  GenericLicenseDataField,
  GenericLicenseDataFieldType,
  GenericLicenseLabels,
  GenericLicenseMapper,
  GenericUserLicensePayload,
  LicenseLabelsObject,
} from '../licenceService.type'
import { getLabel } from '../utils/translations'
import { FirearmLicenseDto } from '@island.is/clients/license-client'
import { Injectable } from '@nestjs/common'
import { isDefined } from '@island.is/shared/utils'
@Injectable()
export class FirearmLicensePayloadMapper implements GenericLicenseMapper {
  public parsePayload = (
    payload?: unknown,
    locale: Locale = 'is',
    labels?: GenericLicenseLabels,
  ): GenericUserLicensePayload | null => {
    if (!payload) return null

    const typedPayload = payload as FirearmLicenseDto
    const { licenseInfo, properties, categories } = typedPayload

    const expired = licenseInfo?.expirationDate
      ? !isAfter(new Date(licenseInfo.expirationDate), new Date())
      : null
    if (!licenseInfo) return null

    const label = labels?.labels
    const data: Array<GenericLicenseDataField> = [
      licenseInfo.licenseNumber
        ? {
            name: getLabel('basicInfoLicense', locale, label),
            type: GenericLicenseDataFieldType.Value,
            label: getLabel('licenseNumber', locale, label),
            value: licenseInfo.licenseNumber,
          }
        : null,
      licenseInfo.name
        ? {
            type: GenericLicenseDataFieldType.Value,
            label: getLabel('fullName', locale, label),
            value: licenseInfo.name,
          }
        : null,
      licenseInfo.issueDate
        ? {
            type: GenericLicenseDataFieldType.Value,
            label: getLabel('publishedDate', locale, label),
            value: licenseInfo.issueDate ?? '',
          }
        : null,
      licenseInfo.expirationDate
        ? {
            type: GenericLicenseDataFieldType.Value,
            label: getLabel('validTo', locale, label),
            value: licenseInfo.expirationDate ?? '',
          }
        : null,
      licenseInfo.collectorLicenseExpirationDate
        ? {
            type: GenericLicenseDataFieldType.Value,
            label: getLabel('collectorLicenseValidTo', locale, label),
            value: licenseInfo.collectorLicenseExpirationDate ?? '',
          }
        : null,

      licenseInfo.qualifications
        ? this.parseQualifications(
            licenseInfo.qualifications,
            locale,
            categories ?? undefined,
            label,
          )
        : null,
      properties
        ? {
            type: GenericLicenseDataFieldType.Group,
            hideFromServicePortal: true,
            label: getLabel('firearmProperties', locale, label),
            fields: (properties.properties ?? []).map((property) => ({
              type: GenericLicenseDataFieldType.Category,
              fields: this.parseProperties(labels, property, locale)?.filter(
                isDefined,
              ),
            })),
          }
        : null,
      properties
        ? {
            type: GenericLicenseDataFieldType.Table,
            label: getLabel('firearmProperties', locale, label),
            fields: (properties.properties ?? []).map((property) => ({
              type: GenericLicenseDataFieldType.Category,
              fields: this.parseProperties(labels, property, locale)?.filter(
                isDefined,
              ),
            })),
          }
        : null,
    ].filter(isDefined)

    return {
      data,
      rawData: JSON.stringify(typedPayload),
      metadata: {
        licenseNumber:
          typedPayload.licenseInfo?.licenseNumber?.toString() ?? '',
        expired,
        expireDate: typedPayload.licenseInfo?.expirationDate ?? undefined,
        links: [
          {
            label: getLabel('renewFirearmLicense', locale, label),
            value: 'https://island.is/skotvopnaleyfi',
          },
        ],
      },
    }
  }

  private parseQualifications = (
    qualifications: string,
    locale: Locale = 'is',
    categories?: FirearmCategories,
    labels?: LicenseLabelsObject,
  ): GenericLicenseDataField | null => {
    if (!categories) {
      return null
    }

    return {
      type: GenericLicenseDataFieldType.Group,
      label: getLabel('classesOfRights', locale, labels),
      fields: qualifications.split('').map((qualification) => ({
        type: GenericLicenseDataFieldType.Category,
        name: qualification,
        label:
          categories?.[
            `${getLabel('category', locale, labels)} ${qualification}`
          ] ?? '',
        description:
          categories?.[
            `${getLabel('category', locale, labels)} ${qualification}`
          ] ?? '',
      })),
    }
  }

  private parseProperties = (
    labels?: GenericLicenseLabels,
    property?: FirearmProperty,
    locale: Locale = 'is',
  ): Array<GenericLicenseDataField> | null => {
    if (!property) return null
    const label = labels?.labels

    const mappedProperty = [
      {
        type: GenericLicenseDataFieldType.Value,
        label: getLabel('firearmStatus', locale, label),
        value: property.category ?? '',
      },
      {
        type: GenericLicenseDataFieldType.Value,
        label: getLabel('type', locale, label),
        value: property.typeOfFirearm ?? '',
      },
      {
        type: GenericLicenseDataFieldType.Value,
        label: getLabel('name', locale, label),
        value: property.name ?? '',
      },
      {
        type: GenericLicenseDataFieldType.Value,
        label: getLabel('number', locale, label),
        value: property.serialNumber ?? '',
      },
      {
        type: GenericLicenseDataFieldType.Value,
        label: getLabel('countryNumber', locale, label),
        value: property.landsnumer ?? '',
      },
      {
        type: GenericLicenseDataFieldType.Value,
        label: getLabel('caliber', locale, label),
        value: property.caliber ?? '',
      },
      {
        type: GenericLicenseDataFieldType.Value,
        label: getLabel('limitation', locale, label),
        value: property.limitation ?? '',
      },
    ]
    return mappedProperty
  }
}
