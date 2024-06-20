import isAfter from 'date-fns/isAfter'
import { Locale } from '@island.is/shared/types'
import { OrorkuSkirteini } from '@island.is/clients/disability-license'
import { DEFAULT_LICENSE_ID } from '../licenseService.constants'
import {
  GenericLicenseDataField,
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
import { Injectable } from '@nestjs/common'
import { IntlService } from '@island.is/cms-translations'
import { m } from '../messages'

export const LICENSE_NAMESPACE = 'api.license-service'

@Injectable()
export class DisabilityLicensePayloadMapper implements GenericLicenseMapper {
  constructor(private readonly intlService: IntlService) {}
  async parsePayload(
    payload: Array<unknown>,
    locale: Locale = 'is',
<<<<<<< Updated upstream
    labels?: GenericLicenseLabels,
  ): Array<GenericLicenseMappedPayloadResponse> {
    if (!payload) return []

    const typedPayload = payload as Array<OrorkuSkirteini>

    const label = labels?.labels
<<<<<<< Updated upstream
    const mappedPayload: Array<GenericLicenseMappedPayloadResponse> =
      typedPayload.map((t) => {
=======
    const mappedPayload: Array<GenericUserLicensePayload> = typedPayload.map(
      (t) => {
=======
  ): Promise<Array<GenericLicenseMappedPayloadResponse>> {
    if (!payload) return Promise.resolve([])

    const typedPayload = payload as Array<OrorkuSkirteini>

    const { formatMessage } = await this.intlService.useIntl(
      [LICENSE_NAMESPACE],
      locale,
    )

    const mappedPayload: Array<GenericLicenseMappedPayloadResponse> =
      typedPayload.map((t) => {
>>>>>>> Stashed changes
>>>>>>> Stashed changes
        const data: Array<GenericLicenseDataField> = [
          {
            type: GenericLicenseDataFieldType.Value,
            name: formatMessage(m.basicInfoDisabilityLicense),
            label: formatMessage(m.fullName),
            value: t.nafn ?? '',
          },
          {
            type: GenericLicenseDataFieldType.Value,
            label: formatMessage(m.publisher),
            value: 'Tryggingastofnun',
          },
          {
            type: GenericLicenseDataFieldType.Value,
            label: formatMessage(m.validTo),
            value: t.gildirtil?.toISOString() ?? '',
          },
        ]

        return {
<<<<<<< Updated upstream
=======
<<<<<<< Updated upstream
          data,
          rawData: JSON.stringify(t),
          metadata: {
            licenseNumber: t.kennitala?.toString() ?? '',
            licenseId: DEFAULT_LICENSE_ID,
            expired: t.gildirtil
              ? !isAfter(new Date(t.gildirtil), new Date())
              : null,
=======
          licenseName: formatMessage(m.disabilityCard),
>>>>>>> Stashed changes
          type: 'user',
          payload: {
            data,
            rawData: JSON.stringify(t),
            metadata: {
              licenseNumber: t.kennitala?.toString() ?? '',
              licenseId: DEFAULT_LICENSE_ID,
              expired: t.gildirtil
                ? !isAfter(new Date(t.gildirtil), new Date())
                : null,
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
