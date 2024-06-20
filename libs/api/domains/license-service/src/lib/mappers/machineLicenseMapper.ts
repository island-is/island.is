import {
  VinnuvelaDto,
  VinnuvelaRettindiDto,
} from '@island.is/clients/adr-and-machine-license'

import isAfter from 'date-fns/isAfter'
import { Locale } from '@island.is/shared/types'
import {
<<<<<<< Updated upstream
  GenericLicenseLabels,
<<<<<<< Updated upstream
=======
  GenericUserLicensePayload,
=======
>>>>>>> Stashed changes
>>>>>>> Stashed changes
  GenericLicenseDataField,
  GenericLicenseDataFieldType,
  GenericLicenseMapper,
  GenericLicenseMappedPayloadResponse,
} from '../licenceService.type'
import {
  DEFAULT_LICENSE_ID,
  LICENSE_NAMESPACE,
} from '../licenseService.constants'
import { Injectable } from '@nestjs/common'
import { m } from '../messages'
import { FormatMessage, IntlService } from '@island.is/cms-translations'

@Injectable()
export class MachineLicensePayloadMapper implements GenericLicenseMapper {
  constructor(private readonly intlService: IntlService) {}

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

    const typedPayload = payload as Array<VinnuvelaDto>

    const { formatMessage } = await this.intlService.useIntl(
      [LICENSE_NAMESPACE],
      locale,
    )

    const mappedPayload: Array<GenericLicenseMappedPayloadResponse> =
      typedPayload.map((t) => {
        const expired: boolean | null = this.checkLicenseExpirationDate(t)

        const data: Array<GenericLicenseDataField> = [
          {
            name: formatMessage(m.basicInfoLicense),
            type: GenericLicenseDataFieldType.Value,
            label: formatMessage(m.licenseNumber),
            value: t.skirteinisNumer?.toString(),
          },
          {
            type: GenericLicenseDataFieldType.Value,
            label: formatMessage(m.fullName),
            value: t?.fulltNafn ?? '',
          },
          {
            type: GenericLicenseDataFieldType.Value,
            label: formatMessage(m.placeOfIssue),
            value: t.utgafuStadur ?? '',
          },
          {
            type: GenericLicenseDataFieldType.Value,
            label: formatMessage(m.firstPublishedDate),
            value: t.fyrstiUtgafuDagur?.toString(),
          },
          {
            type: GenericLicenseDataFieldType.Value,
            label: formatMessage(m.validTo),
            value: formatMessage(m.seeRights),
          },
          {
            type: GenericLicenseDataFieldType.Value,
            label: formatMessage(m.drivingLicenseNumber),
            value: t.okuskirteinisNumer ?? '',
          },
          {
            type: GenericLicenseDataFieldType.Group,
            label: formatMessage(m.classesOfRights),
            fields: (t.vinnuvelaRettindi ?? [])
              .filter((field) => field.kenna || field.stjorna)
              .map((field) => ({
                type: GenericLicenseDataFieldType.Category,
                name: field.flokkur ?? '',
                label: field.fulltHeiti ?? field.stuttHeiti ?? '',
                description: field.fulltHeiti ?? field.stuttHeiti ?? '',
                fields: this.parseVvrRights(field, formatMessage),
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
            licenseNumber: t.skirteinisNumer?.toString() ?? '',
            licenseId: DEFAULT_LICENSE_ID,
            expired: expired,
=======
          licenseName: formatMessage(m.heavyMachineryLicense),
>>>>>>> Stashed changes
          type: 'user',
          payload: {
            data,
            rawData: JSON.stringify(t),
            metadata: {
              licenseNumber: t.skirteinisNumer?.toString() ?? '',
              licenseId: DEFAULT_LICENSE_ID,
              expired: expired,
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

  parseVvrRights(
    rights: VinnuvelaRettindiDto,
    formatMessage: FormatMessage,
  ): Array<GenericLicenseDataField> | undefined {
    const fields = new Array<GenericLicenseDataField>()
    if (rights.stjorna) {
      fields.push({
        type: GenericLicenseDataFieldType.Value,
        label: formatMessage(m.control),
        value: rights.stjorna,
      })
    }
    if (rights.kenna) {
      fields.push({
        type: GenericLicenseDataFieldType.Value,
        label: formatMessage(m.teach),
        value: rights.kenna,
      })
    }

    return fields?.length ? fields : undefined
  }
}
