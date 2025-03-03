import { Locale } from '@island.is/shared/types'
import { LICENSE_NAMESPACE } from '../licenseService.constants'
import { Injectable } from '@nestjs/common'
import { isDefined } from '@island.is/shared/utils'
import {
  type IdentityDocument,
  type IdentityDocumentChild,
} from '@island.is/clients/passports'
import { FormatMessage, IntlService } from '@island.is/cms-translations'
import { m } from '../messages'
import { GenericUserLicenseAlert } from '../dto/GenericUserLicenseAlert.dto'
import { GenericUserLicenseMetaLinks } from '../dto/GenericUserLicenseMetaLinks.dto'
import { GenericUserLicenseMetaTag } from '../dto/GenericUserLicenseMetaTag.dto'
import { capitalizeEveryWord } from '../utils/capitalize'
import { Payload } from '../dto/Payload.dto'
import { formatDate } from '../utils'
import {
  AlertType,
  ExpiryStatus,
  GenericLicenseDataFieldType,
  GenericLicenseMappedPayloadResponse,
  GenericLicenseMapper,
  GenericUserLicenseDataFieldTagColor,
  GenericUserLicenseDataFieldTagType,
  GenericUserLicenseMetaLinksType,
} from '../licenceService.type'
import { GenericLicenseDataField } from '../dto/GenericLicenseDataField.dto'

const isChildDoc = (
  passport: IdentityDocument | IdentityDocumentChild,
): passport is IdentityDocumentChild => {
  return (passport as IdentityDocumentChild).childNationalId !== undefined
}

@Injectable()
export class IdentityDocumentMapper implements GenericLicenseMapper {
  constructor(private readonly intlService: IntlService) {}
  async parsePayload(
    payload: Array<unknown>,
    locale: Locale = 'is',
  ): Promise<Array<GenericLicenseMappedPayloadResponse>> {
    const { formatMessage } = await this.intlService.useIntl(
      [LICENSE_NAMESPACE],
      locale,
    )

    const emptyPassport = {
      licenseName: formatMessage(m.passport),
      type: 'user' as const,
      payload: {
        data: [],
        rawData: '',
        metadata: {
          title: formatMessage(m.passport),
          name: formatMessage(m.passport),
          subtitle: formatMessage(m.noValidPassport),
          ctaLink: {
            label: formatMessage(m.apply),
            value: formatMessage(m.applyPassportUrl),
          },
        },
      },
    }

    if (!payload.length) {
      return [emptyPassport]
    }

    const typedPayload = payload as Array<
      IdentityDocument | IdentityDocumentChild
    >

    const mappedLicenses: Array<GenericLicenseMappedPayloadResponse> =
      typedPayload
        .map((t) => {
          if (isChildDoc(t)) {
            return this.mapChildDocument(t, formatMessage).map((document) => ({
              licenseName: formatMessage(m.passport),
              type: 'child' as const,
              payload: document,
            }))
          } else {
            return {
              licenseName: formatMessage(m.passport),
              type: 'user' as const,
              payload: this.mapDocument(t, formatMessage),
            }
          }
        })
        .flat()

    if (mappedLicenses.findIndex((ml) => ml.type === 'user') < 0) {
      mappedLicenses.push(emptyPassport)
    }

    return mappedLicenses
  }

  private mapChildDocument(
    document: IdentityDocumentChild,
    formatMessage: FormatMessage,
  ): Array<Payload> {
    if (document.passports?.length) {
      return (
        document.passports?.map((p) =>
          this.mapDocument(p, formatMessage, document.childName ?? undefined),
        ) ?? []
      )
    }

    return [
      {
        data: [],
        metadata: {
          name: document.childName ?? '',
          title: document.childName ?? '',
          subtitle: formatMessage(m.noValidPassport),
          ctaLink: {
            label: formatMessage(m.apply),
            value: formatMessage(m.applyPassportUrl),
          },
        },
      },
    ]
  }

  private mapDocument(
    document: IdentityDocument,
    formatMessage: FormatMessage,
    licenseName?: string,
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
        licenseId: document.number?.toString(),
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
