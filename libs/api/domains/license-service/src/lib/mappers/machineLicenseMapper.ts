import {
  VinnuvelaDto,
  VinnuvelaRettindiDto,
} from '@island.is/clients/adr-and-machine-license'

import isAfter from 'date-fns/isAfter'
import { Locale } from '@island.is/shared/types'
import {
  DEFAULT_LICENSE_ID,
  LICENSE_NAMESPACE,
} from '../licenseService.constants'
import { Injectable } from '@nestjs/common'
import { m } from '../messages'
import { FormatMessage, IntlService } from '@island.is/cms-translations'
import { formatDate, expiryTag } from '../utils'
import {
  ExpiryStatus,
  GenericLicenseDataFieldType,
  GenericLicenseMappedPayloadResponse,
  GenericLicenseMapper,
} from '../licenceService.type'
import { GenericLicenseDataField } from '../dto/GenericLicenseDataField.dto'

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
      : undefined
  }

  async parsePayload(
    payload: Array<unknown>,
    locale: Locale = 'is',
  ): Promise<Array<GenericLicenseMappedPayloadResponse>> {
    if (!payload) return Promise.resolve([])

    const typedPayload = payload as Array<VinnuvelaDto>

    const { formatMessage } = await this.intlService.useIntl(
      [LICENSE_NAMESPACE],
      locale,
    )

    const mappedPayload: Array<GenericLicenseMappedPayloadResponse> =
      typedPayload.map((t) => {
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
            value: t.fyrstiUtgafuDagur
              ? formatDate(new Date(t.fyrstiUtgafuDagur))
              : '',
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
                fields: this.parseVvrRights(field, formatMessage),
              })),
          },
        ]

        const isExpired = this.checkLicenseExpirationDate(t)

        return {
          licenseName: formatMessage(m.heavyMachineryLicense),
          type: 'user',
          payload: {
            data,
            rawData: JSON.stringify(t),
            metadata: {
              licenseNumber: t.skirteinisNumer?.toString() ?? '',
              subtitle: formatMessage(m.licenseNumberVariant, {
                arg: t.skirteinisNumer?.toString() ?? formatMessage(m.unknown),
              }),
              licenseId: DEFAULT_LICENSE_ID,
              expiryStatus:
                isExpired === undefined
                  ? ExpiryStatus.UNKNOWN
                  : isExpired
                  ? ExpiryStatus.EXPIRED
                  : ExpiryStatus.ACTIVE,
              expired: isExpired,
              displayTag: expiryTag(formatMessage, isExpired),
              name: formatMessage(m.heavyMachineryLicense),
              title: formatMessage(m.yourMachineLicense),
              description: [
                { text: formatMessage(m.yourMachineLicenseDescription) },
              ],
            },
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
