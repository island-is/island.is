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
  ExpiryStatus,
  GenericLicenseDataFieldType,
  GenericLicenseMappedPayloadResponse,
  GenericLicenseMapper,
  GenericLicenseType,
  GenericUserLicenseMetaLinksType,
} from '../licenceService.type'
import { FirearmLicenseDto } from '@island.is/clients/license-client'
import { Inject, Injectable } from '@nestjs/common'
import { isDefined } from '@island.is/shared/utils'
import { FormatMessage, IntlService } from '@island.is/cms-translations'
import { m } from '../messages'
import { expiryTag, formatDate } from '../utils'
import { GenericLicenseDataField } from '../dto/GenericLicenseDataField.dto'
import { UserAgent } from '@island.is/nest/core'
import { enableAppCompatibilityMode } from '../utils/appCompatibilityMode'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { formatPhoto } from '../utils/formatPhoto'

const APP_VERSION_CUTOFF = '1.4.7'

@Injectable()
export class FirearmLicensePayloadMapper implements GenericLicenseMapper {
  constructor(private readonly intlService: IntlService) {}
  async parsePayload(
    payload: Array<unknown>,
    locale: Locale = 'is',
    userAgent?: UserAgent,
  ): Promise<Array<GenericLicenseMappedPayloadResponse>> {
    if (!payload) return Promise.resolve([])

    //App version before 1.4.8 doesn't know how to handle table
    const enableAppCompatibility = enableAppCompatibilityMode(
      userAgent?.app?.version,
      APP_VERSION_CUTOFF,
    )

    const typedPayload = payload as Array<FirearmLicenseDto>

    const { formatMessage } = await this.intlService.useIntl(
      [LICENSE_NAMESPACE],
      locale,
    )
    const mappedPayload: Array<GenericLicenseMappedPayloadResponse> =
      typedPayload
        .map((t) => {
          const { licenseInfo, properties, categories } = t

          if (!licenseInfo) return null

          const isExpired = licenseInfo?.expirationDate
            ? !isAfter(new Date(licenseInfo.expirationDate), new Date())
            : undefined

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
                  value: formatDate(new Date(licenseInfo.issueDate)) ?? '',
                }
              : null,
            licenseInfo.expirationDate
              ? {
                  type: GenericLicenseDataFieldType.Value,
                  label: formatMessage(m.validTo),
                  value: formatDate(new Date(licenseInfo.expirationDate)) ?? '',
                  tag: expiryTag(formatMessage, isExpired),
                }
              : null,
            licenseInfo.collectorLicenseExpirationDate
              ? {
                  type: GenericLicenseDataFieldType.Value,
                  label: formatMessage(m.collectorLicenseValidTo),
                  value:
                    formatDate(
                      new Date(licenseInfo.collectorLicenseExpirationDate),
                    ) ?? '',
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
                  type: enableAppCompatibility
                    ? GenericLicenseDataFieldType.Group
                    : GenericLicenseDataFieldType.Table,
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
            type: 'user' as const,
            payload: {
              data,
              rawData: JSON.stringify(t),
              metadata: {
                licenseNumber: t.licenseInfo?.licenseNumber?.toString() ?? '',
                subtitle: formatMessage(m.licenseNumberVariant, {
                  arg:
                    t.licenseInfo?.licenseNumber?.toString() ??
                    formatMessage(m.unknown),
                }),
                licenseId: DEFAULT_LICENSE_ID,
                expiryStatus:
                  isExpired === undefined
                    ? ExpiryStatus.UNKNOWN
                    : isExpired
                    ? ExpiryStatus.EXPIRED
                    : ExpiryStatus.ACTIVE,
                expired: isExpired,
                expireDate: t.licenseInfo?.expirationDate ?? undefined,
                displayTag:
                  isExpired !== undefined && t.licenseInfo?.expirationDate
                    ? expiryTag(
                        formatMessage,
                        isExpired,
                        formatMessage(m.validUntil, {
                          arg: formatDate(
                            new Date(t.licenseInfo.expirationDate),
                          ),
                        }),
                      )
                    : undefined,
                links: [
                  {
                    label: formatMessage(m.renewLicense, {
                      arg: formatMessage(m.firearmLicense).toLowerCase(),
                    }),
                    value: 'https://island.is/skotvopnaleyfi',
                    type: GenericUserLicenseMetaLinksType.External,
                  },
                ],
                name: formatMessage(m.firearmLicense),
                title: formatMessage(m.yourFirearmLicense),
                description: [
                  { text: formatMessage(m.yourFirearmLicenseDescription) },
                ],
                photo: formatPhoto(
                  t.licenseInfo?.licenseImgBase64,
                  GenericLicenseType.FirearmLicense,
                ),
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
      fields: qualifications.split('').map((qualification) => {
        const key: keyof FirearmCategories = `${formatMessage(
          m.category,
        )} ${qualification}`

        return {
          type: GenericLicenseDataFieldType.Category,
          name: qualification,
          label: categories?.[key] ?? '',
        }
      }),
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
