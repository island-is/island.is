import {
  DEFAULT_LICENSE_ID,
  LICENSE_NAMESPACE,
} from '../licenseService.constants'
import {
  GenericLicenseDataFieldType,
<<<<<<< Updated upstream
  GenericLicenseLabels,
<<<<<<< Updated upstream
  GenericLicenseMappedPayloadResponse,
=======
=======
  GenericLicenseMappedPayloadResponse,
>>>>>>> Stashed changes
>>>>>>> Stashed changes
  GenericLicenseMapper,
} from '../licenceService.type'
import isAfter from 'date-fns/isAfter'
import { Locale } from '@island.is/shared/types'
import { Injectable } from '@nestjs/common'
import { DriverLicenseDto as DriversLicense } from '@island.is/clients/driving-license'
import { isDefined } from '@island.is/shared/utils'
import { IntlService } from '@island.is/cms-translations'
import { m } from '../messages'

@Injectable()
export class DrivingLicensePayloadMapper implements GenericLicenseMapper {
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

    const typedPayload = payload as Array<DriversLicense>

    const { formatMessage } = await this.intlService.useIntl(
      [LICENSE_NAMESPACE],
      locale,
    )

    // Parse license data into the fields as they're displayed on the physical drivers license
    // see: https://www.reglugerd.is/reglugerdir/eftir-raduneytum/srn/nr/18033

    const mappedPayload: Array<GenericLicenseMappedPayloadResponse> =
      typedPayload.map((t) => {
        const expired = t.dateValidTo
          ? !isAfter(new Date(t.dateValidTo), new Date())
          : null

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
            label: formatMessage(m.publisher),
            value: 'Ríkislögreglustjóri',
          },
          {
            type: GenericLicenseDataFieldType.Value,
            label: formatMessage(m.publishedDate),
            value: t.publishDate ? new Date(t.publishDate).toISOString() : '',
          },
          {
            type: GenericLicenseDataFieldType.Value,
            label: formatMessage(m.validTo),
            value: t.dateValidTo ? new Date(t.dateValidTo).toISOString() : '',
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
                  value: field.dateTo ? field.dateTo.toISOString() : '',
                },
                {
                  type: GenericLicenseDataFieldType.Value,
                  label: formatMessage(m.publishedDate),
                  value: field.publishDate
                    ? field.publishDate.toISOString()
                    : '',
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
        ]
        return {
<<<<<<< Updated upstream
=======
<<<<<<< Updated upstream
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
=======
          licenseName: formatMessage(m.drivingLicense),
>>>>>>> Stashed changes
          type: 'user',
          payload: {
            data,
            rawData: JSON.stringify(t),
            metadata: {
              licenseNumber: t.id?.toString() ?? '',
              licenseId: DEFAULT_LICENSE_ID,
              expired,
              expireDate: t.dateValidTo?.toISOString() ?? undefined,
              links: [
                {
<<<<<<< Updated upstream
                  label: getLabel('renewDrivingLicense', locale, label),
=======
                  label: formatMessage(m.renewDrivingLicense),
>>>>>>> Stashed changes
                  value: 'https://island.is/endurnyjun-okuskirteina',
                },
              ],
            },
<<<<<<< Updated upstream
=======
>>>>>>> Stashed changes
>>>>>>> Stashed changes
          },
        }
      })
    return mappedPayload
  }
}
