import { Locale } from '@island.is/shared/types'
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
import { HuntingLicenseDto } from '@island.is/clients/hunting-license'
import { Injectable } from '@nestjs/common'
import { format } from 'kennitala'
import dateFormat from 'date-fns/format'
import { isDefined } from '@island.is/shared/utils'
import capitalize from 'lodash/capitalize'
import {
  DEFAULT_LICENSE_ID,
  LICENSE_NAMESPACE,
} from '../licenseService.constants'
import { IntlService } from '@island.is/cms-translations'
import { m } from '../messages'

const formatDate = (date: Date) => dateFormat(date, 'dd.MM.yyyy')

@Injectable()
export class HuntingLicensePayloadMapper implements GenericLicenseMapper {
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

    const typedPayload = payload as Array<HuntingLicenseDto>

    const { formatMessage } = await this.intlService.useIntl(
      [LICENSE_NAMESPACE],
      locale,
    )

    const mappedPayload: Array<GenericLicenseMappedPayloadResponse> =
      typedPayload.map((t) => {
        let address = t.holderAddress
        if (t.holderCity) {
          address += `, ${t.holderCity}`
        }

        const data: Array<GenericLicenseDataField> = [
          {
            name: formatMessage(m.basicInfoLicense),
            type: GenericLicenseDataFieldType.Value,
            label: formatMessage(m.personName),
            value: t.holderName ?? '',
          },
          {
            type: GenericLicenseDataFieldType.Value,
            label: formatMessage(m.nationalId),
            value: t.holderNationalId ? format(t.holderNationalId) : '',
          },
          {
            type: GenericLicenseDataFieldType.Value,
            label: formatMessage(m.legalAddress),
            value: address,
          },
          {
            type: GenericLicenseDataFieldType.Value,
            label: formatMessage(m.cardNumber),
            value: t.number ?? '',
          },
          t.validFrom
            ? {
                type: GenericLicenseDataFieldType.Value,
                label: formatMessage(m.publishedDate),
                value: formatDate(t.validFrom),
              }
            : undefined,
          t.validFrom && t.validTo
            ? {
                type: GenericLicenseDataFieldType.Value,
                label: formatMessage(m.validDuration),
                value: `${formatDate(t.validFrom)} - ${formatDate(t.validTo)}`,
              }
            : undefined,
          t.permitFor?.length
            ? {
                type: GenericLicenseDataFieldType.Value,
                label: formatMessage(m.huntingPermitValidFor),
                value: t.permitFor?.map((p) => capitalize(p))?.join(', ') ?? '',
              }
            : undefined,
          t.benefits?.length
            ? {
                type: GenericLicenseDataFieldType.Value,
                label: formatMessage(m.huntingPermitBenefits),
                value:
                  t.benefits?.map((b) => capitalize(b.land))?.join(', ') ?? '',
              }
            : undefined,
        ].filter(isDefined)

        return {
<<<<<<< Updated upstream
=======
<<<<<<< Updated upstream
          data,
          rawData: JSON.stringify(t),
          metadata: {
            licenseNumber: t.number?.toString() ?? '',
            licenseId: DEFAULT_LICENSE_ID,
            expired: !t.isValid,
            expireDate: t.validTo ? t.validTo.toISOString() : undefined,
            links: [
              {
                label: getLabel('renewHuntingLicense', locale, label),
                value:
                  t.renewalUrl ??
                  'https://innskraning.island.is/?id=gogn.ust.is',
              },
            ],
=======
          licenseName: formatMessage(m.huntingCard),
>>>>>>> Stashed changes
          type: 'user',
          payload: {
            data,
            rawData: JSON.stringify(t),
            metadata: {
              licenseNumber: t.number?.toString() ?? '',
              licenseId: DEFAULT_LICENSE_ID,
              expired: !t.isValid,
              expireDate: t.validTo ? t.validTo.toISOString() : undefined,
              links: [
                {
<<<<<<< Updated upstream
                  label: getLabel('renewHuntingLicense', locale, label),
=======
                  label: formatMessage(m.renewHuntingLicense),
>>>>>>> Stashed changes
                  value:
                    t.renewalUrl ??
                    'https://innskraning.island.is/?id=gogn.ust.is',
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
