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
import isAfter from 'date-fns/isAfter'
import { Locale } from '@island.is/shared/types'
import { Injectable } from '@nestjs/common'
import {
  DriverLicenseDto as DriversLicense,
  LicenseComments,
} from '@island.is/clients/driving-license'
import { isDefined } from '@island.is/shared/utils'
import { IntlService } from '@island.is/cms-translations'
import { m } from '../messages'
import { formatDate, expiryTag } from '../utils'
import { format } from 'kennitala'
import { formatPhoto } from '../utils/formatPhoto'

@Injectable()
export class DrivingLicensePayloadMapper implements GenericLicenseMapper {
  constructor(private readonly intlService: IntlService) {}
  async parsePayload(
    payload: Array<unknown>,
    locale: Locale = 'is',
  ): Promise<Array<GenericLicenseMappedPayloadResponse>> {
    if (!payload) return Promise.resolve([])

    const typedPayload = payload as Array<DriversLicense>

    const { formatMessage } = await this.intlService.useIntl(
      [LICENSE_NAMESPACE],
      locale,
    )

    // Parse license data into the fields as they're displayed on the physical drivers license
    // see: https://www.reglugerd.is/reglugerdir/eftir-raduneytum/srn/nr/18033

    const mappedPayload: Array<GenericLicenseMappedPayloadResponse> =
      typedPayload.map((t) => {
        const isExpired = t.dateValidTo
          ? !isAfter(new Date(t.dateValidTo), new Date())
          : undefined

        const data = [
          {
            name: formatMessage(m.basicInfoLicense),
            type: GenericLicenseDataFieldType.Value,
            label: formatMessage(m.licenseNumber),
            value: (t.id ?? '').toString(),
          },
          {
            type: GenericLicenseDataFieldType.Value,
            label: formatMessage(m.fullName),
            value: t.name ?? '',
          },
          {
            type: GenericLicenseDataFieldType.Value,
            label: formatMessage(m.nationalId),
            value: t.socialSecurityNumber ? format(t.socialSecurityNumber) : '',
          },
          {
            type: GenericLicenseDataFieldType.Value,
            label: formatMessage(m.publisher),
            value: 'Ríkislögreglustjóri',
          },
          {
            type: GenericLicenseDataFieldType.Value,
            label: formatMessage(m.publishedDate),
            value: t.publishDate ? formatDate(t.publishDate) : '',
          },
          {
            type: GenericLicenseDataFieldType.Value,
            label: formatMessage(m.validTo),
            value: t.dateValidTo ? formatDate(t.dateValidTo) : '',
            tag: expiryTag(formatMessage, isExpired),
          },
          {
            type: GenericLicenseDataFieldType.Group,
            label: formatMessage(m.classesOfRights),
            fields: (t.categories ?? []).map((field) => ({
              type: GenericLicenseDataFieldType.Category,
              name: field.nr ?? '',
              label: '',
              fields: [
                {
                  type: GenericLicenseDataFieldType.Value,
                  label: formatMessage(m.expiryDate),
                  value: field.dateTo ? formatDate(field.dateTo) : '',
                },
                {
                  type: GenericLicenseDataFieldType.Value,
                  label: formatMessage(m.publishedDate),
                  value: field.publishDate ? formatDate(field.publishDate) : '',
                },
                field.comment
                  ? {
                      type: GenericLicenseDataFieldType.Value,
                      label: formatMessage(m.comments),
                      value: field.comment ?? '',
                    }
                  : undefined,
              ].filter(isDefined),
            })),
          },
          {
            type: GenericLicenseDataFieldType.Value,
            label: formatMessage(m.extraCodes),
            value: t.comments ? this.formatComments(t.comments) : '',
          },
        ]

        return {
          licenseName: formatMessage(m.drivingLicense),
          type: 'user',
          payload: {
            data,
            rawData: JSON.stringify(t),
            metadata: {
              links: [
                {
                  label: formatMessage(m.renewLicense, {
                    arg: formatMessage(m.drivingLicense).toLowerCase(),
                  }),
                  value: 'https://island.is/endurnyjun-okuskirteina',
                  type: GenericUserLicenseMetaLinksType.External,
                },
              ],
              licenseNumber: t.id?.toString() ?? '',
              subtitle: formatMessage(m.licenseNumberVariant, {
                arg: t.id?.toString() ?? formatMessage(m.unknown),
              }),
              licenseId: DEFAULT_LICENSE_ID,
              expiryStatus:
                isExpired === undefined
                  ? ExpiryStatus.UNKNOWN
                  : isExpired
                  ? ExpiryStatus.EXPIRED
                  : ExpiryStatus.ACTIVE,
              expired: isExpired,
              expireDate: t.dateValidTo?.toISOString() ?? undefined,
              displayTag:
                isExpired !== undefined && t.dateValidTo
                  ? expiryTag(
                      formatMessage,
                      isExpired,
                      formatMessage(m.validUntil, {
                        arg: formatDate(t.dateValidTo),
                      }),
                    )
                  : undefined,
              name: formatMessage(m.drivingLicense),
              title: formatMessage(m.yourDrivingLicense),
              description: [
                { text: formatMessage(m.yourDrivingLicenseDescription) },
              ],
              photo: formatPhoto(
                t.photo?.image,
                GenericLicenseType.DriversLicense,
              ),
            },
          },
        }
      })
    return mappedPayload
  }

  formatComments(comments: Array<LicenseComments>): string {
    return comments
      .filter((comment) => comment.nr)
      .map((comment) =>
        comment.comment ? `${comment.nr} (${comment.comment})` : comment.nr,
      )
      .join('\n')
  }
}
