import { Locale } from '@island.is/shared/types'
import {
  DEFAULT_LICENSE_ID,
  LICENSE_NAMESPACE,
} from '../licenseService.constants'
import { Injectable } from '@nestjs/common'
import { isDefined } from '@island.is/shared/utils'
import { type IdentityDocument } from '@island.is/clients/passports'
import { FormatMessage, IntlService } from '@island.is/cms-translations'
import { m } from '../messages'
import { GenericUserLicenseMetaTag } from '../dto/GenericUserLicenseMetaTag.dto'
import { capitalizeEveryWord } from '../utils/capitalize'
import { Payload } from '../dto/Payload.dto'
import { formatDate } from '../utils'
import {
  ExpiryStatus,
  GenericLicenseDataFieldType,
  GenericLicenseMappedPayloadResponse,
  GenericLicenseMapper,
  GenericUserLicenseDataFieldTagColor,
  GenericUserLicenseDataFieldTagType,
} from '../licenceService.type'
import { GenericLicenseDataField } from '../dto/GenericLicenseDataField.dto'

@Injectable()
export class IdentityDocumentMapper implements GenericLicenseMapper {
  constructor(private readonly intlService: IntlService) {}
  async parsePayload(
    payload: Array<unknown>,
    locale: Locale = 'is',
  ): Promise<Array<GenericLicenseMappedPayloadResponse>> {
    if (!payload.length) {
      return Promise.resolve([])
    }

    const { formatMessage } = await this.intlService.useIntl(
      [LICENSE_NAMESPACE],
      locale,
    )

    const typedPayload = payload as Array<IdentityDocument>

    const mappedLicenses: Array<GenericLicenseMappedPayloadResponse> =
      typedPayload.map((t) => {
        return {
          licenseName: formatMessage(m.identityDocument),
          type: 'user' as const,
          payload: this.mapDocument(t, formatMessage),
        }
      })

    return mappedLicenses
  }

  private mapDocument(
    document: IdentityDocument,
    formatMessage: FormatMessage,
  ): Payload {
    const isExpired = document.expiryStatus?.toLowerCase() === 'expired'

    const displayTag: GenericUserLicenseMetaTag | undefined = {
      text: isExpired ? formatMessage(m.expired) : formatMessage(m.valid),
      color: isExpired ? 'red' : 'blue',
      icon: isExpired
        ? GenericUserLicenseDataFieldTagType.closeCircle
        : GenericUserLicenseDataFieldTagType.checkmarkCircle,
      iconColor: isExpired
        ? GenericUserLicenseDataFieldTagColor.red
        : GenericUserLicenseDataFieldTagColor.green,
      iconText: isExpired ? formatMessage(m.expired) : formatMessage(m.valid),
    }

    const data: Array<GenericLicenseDataField> = [
      document.displayFirstName && document.displayLastName
        ? {
            type: GenericLicenseDataFieldType.Value,
            label: formatMessage(m.personName),
            value: capitalizeEveryWord(
              `${document.displayFirstName.toLowerCase()} ${document.displayLastName.toLowerCase()}`,
            ),
          }
        : null,
      document.number
        ? {
            type: GenericLicenseDataFieldType.Value,
            label: formatMessage(m.number),
            value: document.numberWithType,
          }
        : null,
      document.issuingDate
        ? {
            type: GenericLicenseDataFieldType.Value,
            label: formatMessage(m.publishedDate),
            value: formatDate(document.issuingDate),
          }
        : null,
      document.expirationDate
        ? {
            type: GenericLicenseDataFieldType.Value,
            label: formatMessage(m.expiryDate),
            value: formatDate(document.expirationDate),
            tag: displayTag,
          }
        : null,
      document.verboseType
        ? {
            type: GenericLicenseDataFieldType.Value,
            label: formatMessage(m.licenseType),
            value: document.verboseType,
          }
        : null,
    ].filter(isDefined)

    return {
      data,
      rawData: JSON.stringify(document),
      metadata: {
        licenseNumber: document.number?.toString(),
        licenseId: DEFAULT_LICENSE_ID,
        subtitle: formatMessage(m.licenseNumberVariant, {
          arg: document.number?.toString() ?? formatMessage(m.unknown),
        }),
        expiryStatus:
          document.expiryStatus === 'EXPIRED'
            ? ExpiryStatus.EXPIRED
            : ExpiryStatus.ACTIVE,
        expired: isExpired,
        expireDate: document.expirationDate?.toISOString() ?? undefined,
        displayTag,
        name: document.verboseType ?? undefined,
        title: document.verboseType ?? undefined,

        description: [{ text: formatMessage(m.identityDocumentDescription) }],
      },
    }
  }
}
