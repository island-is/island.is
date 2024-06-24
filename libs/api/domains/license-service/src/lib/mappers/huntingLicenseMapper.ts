import { Locale } from '@island.is/shared/types'
import {
  GenericLicenseDataField,
  GenericLicenseDataFieldType,
  GenericLicenseMappedPayloadResponse,
  GenericLicenseMapper,
} from '../licenceService.type'
import { HuntingLicenseDto } from '@island.is/clients/hunting-license'
import { Injectable } from '@nestjs/common'
import { format as formatNationalId } from 'kennitala'
import format from 'date-fns/format'
import { isDefined } from '@island.is/shared/utils'
import capitalize from 'lodash/capitalize'
import {
  DEFAULT_LICENSE_ID,
  LICENSE_NAMESPACE,
} from '../licenseService.constants'
import { IntlService } from '@island.is/cms-translations'
import { m } from '../messages'
import { expiryTag } from '../utils/expiryTag'

const formatDate = (date: Date) => format(date, 'dd.MM.yyyy')

@Injectable()
export class HuntingLicensePayloadMapper implements GenericLicenseMapper {
  constructor(private readonly intlService: IntlService) {}
  async parsePayload(
    payload: Array<unknown>,
    locale: Locale = 'is',
  ): Promise<Array<GenericLicenseMappedPayloadResponse>> {
    if (!payload) return Promise.resolve([])

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
            value: t.holderNationalId
              ? formatNationalId(t.holderNationalId)
              : '',
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
          licenseName: formatMessage(m.huntingCard),
          type: 'user',
          payload: {
            data,
            rawData: JSON.stringify(t),
            name: formatMessage(m.huntingCard),
            metadata: {
              licenseNumber: t.number?.toString() ?? '',
              subtitle: formatMessage(m.licenseNumberVariant, {
                arg: t.number?.toString() ?? formatMessage(m.unknown),
              }),
              licenseId: DEFAULT_LICENSE_ID,
              expired: !t.isValid,
              expireDate: t.validTo ? t.validTo.toISOString() : undefined,
              displayTag:
                t.validTo &&
                expiryTag(
                  formatMessage,
                  !t.isValid,
                  formatMessage(m.validUntil, {
                    arg: formatDate(t.validTo),
                  }),
                ),
              links: [
                {
                  label: formatMessage(m.renewLicense, {
                    arg: formatMessage(m.huntingCard).toLowerCase(),
                  }),
                  value:
                    t.renewalUrl ??
                    'https://innskraning.island.is/?id=gogn.ust.is',
                },
              ],
              title: formatMessage(m.yourHuntingCard),
              description: [
                { text: formatMessage(m.huntingLicenseDescription) },
              ],
            },
          },
        }
      })

    return mappedPayload
  }
}
