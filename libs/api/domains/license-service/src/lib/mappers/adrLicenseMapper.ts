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
    payload: unknown,
    locale: Locale = 'is',
    labels?: GenericLicenseLabels,
  ): GenericUserLicensePayload | null {
    if (!payload) return null

    const typedPayload = payload as FlattenedAdrDto

    const label = labels?.labels

    const data: Array<GenericLicenseDataField> = [
      {
        name: getLabel('basicInfoLicense', locale, label),
        type: GenericLicenseDataFieldType.Value,
        label: getLabel('licenseNumber', locale, label),
        value: typedPayload.skirteinisNumer?.toString(),
      },
      {
        type: GenericLicenseDataFieldType.Value,
        label: getLabel('fullName', locale, label),
        value: typedPayload.fulltNafn ?? '',
      },
      {
        type: GenericLicenseDataFieldType.Value,
        label: getLabel('publisher', locale, label),
        value: 'Vinnueftirlitið',
      },
      {
        type: GenericLicenseDataFieldType.Value,
        label: getLabel('validTo', locale, label),
        value: typedPayload.gildirTil ?? '',
      },
    ]

    const adrRights = (typedPayload.adrRettindi ?? []).filter(
      (field) => field.grunn,
    )
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
      rawData: JSON.stringify(typedPayload),
      metadata: {
        licenseNumber: typedPayload.skirteinisNumer?.toString() ?? '',
        expired: typedPayload.gildirTil
          ? !isAfter(new Date(typedPayload.gildirTil), new Date())
          : null,
        expireDate: typedPayload.gildirTil ?? undefined,
      },
    }
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
