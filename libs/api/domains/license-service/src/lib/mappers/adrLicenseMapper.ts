import isAfter from 'date-fns/isAfter'
import { Locale } from '@island.is/shared/types'
import {
  FlattenedAdrDto,
  FlattenedAdrRightsDto,
} from '@island.is/clients/license-client'
import {
  GenericLicenseDataField,
  GenericLicenseDataFieldType,
  GenericLicenseLabels,
  GenericLicenseMapper,
  GenericUserLicensePayload,
} from '../licenceService.type'
import { getLabel } from '../utils/translations'
import { Injectable } from '@nestjs/common'

@Injectable()
export class AdrLicensePayloadMapper implements GenericLicenseMapper {
  parsePayload(
    payload: Array<unknown>,
    locale: Locale = 'is',
    labels?: GenericLicenseLabels,
  ): Array<GenericUserLicensePayload> {
    if (!payload) return []

    const typedPayload = payload as Array<FlattenedAdrDto>

    const label = labels?.labels

    const mappedPayload: Array<GenericUserLicensePayload> = typedPayload.map(
      (t) => {
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
            value: t.fulltNafn ?? '',
          },
          {
            type: GenericLicenseDataFieldType.Value,
            label: getLabel('publisher', locale, label),
            value: 'Vinnueftirlitið',
          },
          {
            type: GenericLicenseDataFieldType.Value,
            label: getLabel('validTo', locale, label),
            value: t.gildirTil ?? '',
          },
        ]

        const adrRights = (t.adrRettindi ?? []).filter((field) => field.grunn)
        const tankar = this.parseRights(
          getLabel('tanks', locale, label) ?? '',
          adrRights.filter((field) => field.tankar),
        )

        if (tankar) data.push(tankar)

        const grunn = this.parseRights(
          getLabel('otherThanTanks', locale, label) ?? '',
          adrRights,
        )
        if (grunn) data.push(grunn)

        return {
          data,
          rawData: JSON.stringify(t),
          metadata: {
            licenseNumber: t.skirteinisNumer?.toString() ?? '',
            expired: t.gildirTil
              ? !isAfter(new Date(t.gildirTil), new Date())
              : null,
            expireDate: t.gildirTil ?? undefined,
          },
        }
      },
    )

    return mappedPayload
  }

  private parseRights(
    label: string,
    data: FlattenedAdrRightsDto[],
  ): GenericLicenseDataField | undefined {
    if (!data.length) {
      return
    }

    return {
      type: GenericLicenseDataFieldType.Group,
      label: label,
      fields: data.map((field) => ({
        type: GenericLicenseDataFieldType.Category,
        name: field.flokkur ?? '',
        label: field.heiti ?? '',
        description: field.heiti ?? '',
      })),
    }
  }
}
