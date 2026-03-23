import { Locale } from '@island.is/shared/types'
import {
  ExpiryStatus,
  GenericLicenseDataFieldType,
  GenericLicenseMappedPayloadResponse,
  GenericLicenseMapper,
  GenericLicenseType,
  GenericUserLicenseMetaLinksType,
} from '../licenceService.type'
import { Inject, Injectable } from '@nestjs/common'
import { isDefined } from '@island.is/shared/utils'
import {
  DEFAULT_LICENSE_ID,
  LICENSE_NAMESPACE,
} from '../licenseService.constants'
import { IntlService } from '@island.is/cms-translations'
import { m } from '../messages'
import { format as formatNationalId } from 'kennitala'
import { expiryTag, formatDate, capitalize } from '../utils'
import { GenericLicenseDataField } from '../dto/GenericLicenseDataField.dto'
import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { formatPhoto } from '../utils/formatPhoto'
import { HuntingLicenseDto } from '@island.is/clients/license-client'

@Injectable()
export class HuntingLicensePayloadMapper implements GenericLicenseMapper {
  constructor(
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    private readonly intlService: IntlService,
  ) {}
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
            metadata: {
              licenseNumber: t.number ?? '',
              subtitle: formatMessage(m.licenseNumberVariant, {
                arg: t.number ?? formatMessage(m.unknown),
              }),
              licenseId: DEFAULT_LICENSE_ID,
              expiryStatus:
                t.validity === 'active'
                  ? ExpiryStatus.ACTIVE
                  : t.validity === 'expired'
                  ? ExpiryStatus.EXPIRED
                  : ExpiryStatus.UNKNOWN,
              expired: !t.isValid,
              expireDate: t.validTo ? t.validTo.toISOString() : undefined,
              displayTag: expiryTag(
                formatMessage,
                !t.isValid,
                t.validTo &&
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
                  type: GenericUserLicenseMetaLinksType.External,
                },
              ],
              name: formatMessage(m.huntingCard),
              title: formatMessage(m.yourHuntingCard),
              description: [
                { text: formatMessage(m.huntingLicenseDescription) },
              ],
              photo: formatPhoto(
                t.holderPhoto,
                GenericLicenseType.HuntingLicense,
              ),
            },
          },
        }
      })

    return mappedPayload
  }
}
