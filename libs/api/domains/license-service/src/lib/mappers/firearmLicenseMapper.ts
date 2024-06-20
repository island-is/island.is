import {
  FirearmCategories,
  FirearmProperty,
} from '@island.is/clients/firearm-license'
import isAfter from 'date-fns/isAfter'
import { Locale } from '@island.is/shared/types'
import {
  DEFAULT_LICENSE_ID,
  LICENSE_NAMESPACE,
} from '../licenseService.constants'
import {
  GenericLicenseDataField,
  GenericLicenseDataFieldType,
<<<<<<< Updated upstream
  GenericLicenseLabels,
  GenericLicenseMappedPayloadResponse,
  GenericLicenseMapper,
  LicenseLabelsObject,
=======
  GenericLicenseMappedPayloadResponse,
  GenericLicenseMapper,
>>>>>>> Stashed changes
} from '../licenceService.type'
import { FirearmLicenseDto } from '@island.is/clients/license-client'
import { Injectable } from '@nestjs/common'
import { isDefined } from '@island.is/shared/utils'
import { FormatMessage, IntlService } from '@island.is/cms-translations'
import { m } from '../messages'

@Injectable()
export class FirearmLicensePayloadMapper implements GenericLicenseMapper {
  constructor(private readonly intlService: IntlService) {}
  async parsePayload(
    payload: Array<unknown>,
    locale: Locale = 'is',
<<<<<<< Updated upstream
    labels?: GenericLicenseLabels,
  ): Array<GenericLicenseMappedPayloadResponse> {
    if (!payload) return []
=======
  ): Promise<Array<GenericLicenseMappedPayloadResponse>> {
    if (!payload) return Promise.resolve([])
>>>>>>> Stashed changes

    const typedPayload = payload as Array<FirearmLicenseDto>

<<<<<<< Updated upstream
=======
<<<<<<< Updated upstream
    const mappedPayload: Array<GenericUserLicensePayload> = typedPayload
      .map((t) => {
        const { licenseInfo, properties, categories } = t
=======
    const { formatMessage } = await this.intlService.useIntl(
      [LICENSE_NAMESPACE],
      locale,
    )
>>>>>>> Stashed changes
    const mappedPayload: Array<GenericLicenseMappedPayloadResponse> =
      typedPayload
        .map((t) => {
          const { licenseInfo, properties, categories } = t
<<<<<<< Updated upstream
=======
>>>>>>> Stashed changes
>>>>>>> Stashed changes

          const expired = licenseInfo?.expirationDate
            ? !isAfter(new Date(licenseInfo.expirationDate), new Date())
            : null
          if (!licenseInfo) return null

<<<<<<< Updated upstream
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
=======
<<<<<<< Updated upstream
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
>>>>>>> Stashed changes

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
                    fields: this.parseProperties(
                      labels,
                      property,
                      locale,
                    )?.filter(isDefined),
                  })),
                }
              : null,
            properties
              ? {
                  type: GenericLicenseDataFieldType.Table,
                  label: getLabel('firearmProperties', locale, label),
                  fields: (properties.properties ?? []).map((property) => ({
                    type: GenericLicenseDataFieldType.Category,
                    fields: this.parseProperties(
                      labels,
                      property,
                      locale,
                    )?.filter(isDefined),
                  })),
                }
              : null,
          ].filter(isDefined)

<<<<<<< Updated upstream
          return {
=======
        return {
          data,
          rawData: JSON.stringify(t),
          metadata: {
            licenseNumber: t.licenseInfo?.licenseNumber?.toString() ?? '',
            licenseId: DEFAULT_LICENSE_ID,
            expired,
            expireDate: t.licenseInfo?.expirationDate ?? undefined,
            links: [
              {
                label: getLabel('renewFirearmLicense', locale, label),
                value: 'https://island.is/skotvopnaleyfi',
=======
          const data: Array<GenericLicenseDataField> = [
            licenseInfo.licenseNumber
              ? {
                  name: formatMessage(m.basicInfoLicense),
                  type: GenericLicenseDataFieldType.Value,
                  label: formatMessage(m.licenseNumber),
                  value: licenseInfo.licenseNumber,
                }
              : null,
            licenseInfo.name
              ? {
                  type: GenericLicenseDataFieldType.Value,
                  label: formatMessage(m.fullName),
                  value: licenseInfo.name,
                }
              : null,
            licenseInfo.issueDate
              ? {
                  type: GenericLicenseDataFieldType.Value,
                  label: formatMessage(m.publishedDate),
                  value: licenseInfo.issueDate ?? '',
                }
              : null,
            licenseInfo.expirationDate
              ? {
                  type: GenericLicenseDataFieldType.Value,
                  label: formatMessage(m.validTo),
                  value: licenseInfo.expirationDate ?? '',
                }
              : null,
            licenseInfo.collectorLicenseExpirationDate
              ? {
                  type: GenericLicenseDataFieldType.Value,
                  label: formatMessage(m.collectorLicenseValidTo),
                  value: licenseInfo.collectorLicenseExpirationDate ?? '',
                }
              : null,

            licenseInfo.qualifications
              ? this.parseQualifications(
                  licenseInfo.qualifications,
                  categories ?? undefined,
                  formatMessage,
                )
              : null,
            properties
              ? {
                  type: GenericLicenseDataFieldType.Group,
                  hideFromServicePortal: true,
                  label: formatMessage(m.firearmProperties),
                  fields: (properties.properties ?? []).map((property) => ({
                    type: GenericLicenseDataFieldType.Category,
                    fields: this.parseProperties(
                      property,
                      formatMessage,
                    )?.filter(isDefined),
                  })),
                }
              : null,
            properties
              ? {
                  type: GenericLicenseDataFieldType.Table,
                  label: formatMessage(m.firearmProperties),
                  fields: (properties.properties ?? []).map((property) => ({
                    type: GenericLicenseDataFieldType.Category,
                    fields: this.parseProperties(
                      property,
                      formatMessage,
                    )?.filter(isDefined),
                  })),
                }
              : null,
          ].filter(isDefined)

          return {
            licenseName: formatMessage(m.firearmLicense),
>>>>>>> Stashed changes
            type: 'user' as const,
            payload: {
              data,
              rawData: JSON.stringify(t),
              metadata: {
                licenseNumber: t.licenseInfo?.licenseNumber?.toString() ?? '',
                licenseId: DEFAULT_LICENSE_ID,
                expired,
                expireDate: t.licenseInfo?.expirationDate ?? undefined,
                links: [
                  {
<<<<<<< Updated upstream
                    label: getLabel('renewFirearmLicense', locale, label),
                    value: 'https://island.is/skotvopnaleyfi',
                  },
                ],
=======
                    label: formatMessage(m.renewFirearmLicense),
                    value: 'https://island.is/skotvopnaleyfi',
                  },
                ],
>>>>>>> Stashed changes
>>>>>>> Stashed changes
              },
            },
          }
        })
        .filter(isDefined)
    return mappedPayload
  }

  private parseQualifications = (
    qualifications: string,
    categories?: FirearmCategories,
    formatMessage?: FormatMessage,
  ): GenericLicenseDataField | null => {
    if (!categories || !formatMessage) {
      return null
    }

    return {
      type: GenericLicenseDataFieldType.Group,
      label: formatMessage(m.classesOfRights),
      fields: qualifications.split('').map((qualification) => ({
        type: GenericLicenseDataFieldType.Category,
        name: qualification,
        label:
          categories?.[`${formatMessage(m.category)} ${qualification} `] ?? '',
        description:
          categories?.[`${formatMessage(m.category)} ${qualification} `] ?? '',
      })),
    }
  }

  private parseProperties = (
    property?: FirearmProperty,
    formatMessage?: FormatMessage,
  ): Array<GenericLicenseDataField> | null => {
    if (!property || !formatMessage) return null

    const mappedProperty = [
      {
        type: GenericLicenseDataFieldType.Value,
        label: formatMessage(m.firearmStatus),
        value: property.category ?? '',
      },
      {
        type: GenericLicenseDataFieldType.Value,
        label: formatMessage(m.type),
        value: property.typeOfFirearm ?? '',
      },
      {
        type: GenericLicenseDataFieldType.Value,
        label: formatMessage(m.name),
        value: property.name ?? '',
      },
      {
        type: GenericLicenseDataFieldType.Value,
        label: formatMessage(m.number),
        value: property.serialNumber ?? '',
      },
      {
        type: GenericLicenseDataFieldType.Value,
        label: formatMessage(m.countryNumber),
        value: property.landsnumer ?? '',
      },
      {
        type: GenericLicenseDataFieldType.Value,
        label: formatMessage(m.caliber),
        value: property.caliber ?? '',
      },
      {
        type: GenericLicenseDataFieldType.Value,
        label: formatMessage(m.limitations),
        value: property.limitation ?? '',
      },
    ]
    return mappedProperty
  }
}
