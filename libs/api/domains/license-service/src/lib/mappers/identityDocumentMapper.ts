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

const isChildDocument = (
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

    if (!payload) return Promise.resolve([])

    const typedPayload = payload as Array<
      IdentityDocument | IdentityDocumentChild
    >

    const mappedLicenses: Array<GenericLicenseMappedPayloadResponse> =
      typedPayload
        .map((t) => {
          if (isChildDocument(t)) {
            return this.mapChildDocument(t, formatMessage).map((document) => ({
              licenseName: formatMessage(m.identityDocument),
              type: 'child' as const,
              payload: document,
            }))
          } else {
            return {
              licenseName: formatMessage(m.identityDocument),
              type: 'user' as const,
              payload: this.mapDocument(
                t,
                formatMessage,
                formatMessage(m.identityDocument),
              ),
            }
          }
        })
        .flat()

    return mappedLicenses
  }

  private mapChildDocument = (
    document: IdentityDocumentChild,
    formatMessage: FormatMessage,
  ): Array<Payload> =>
    document.passports?.map((p) =>
      this.mapDocument(p, formatMessage, document.childName ?? undefined),
    ) ?? []

  private mapDocument(
    document: IdentityDocument,
    formatMessage: FormatMessage,
    licenseName?: string,
  ): Payload {
    const isExpired = document.expiryStatus?.toLowerCase() === 'expired'
    const isLost = document.expiryStatus?.toLowerCase() === 'lost'
    const isExpiring = document.expiresWithinNoticeTime
    const isInvalid = document.status
      ? document.status.toLowerCase() === 'invalid'
      : undefined

    const licenseNumber =
      document.number && document.type && document.subType
        ? `${document.type}${document.subType}${document.number}`
        : undefined

    const mapLicenseType = (subType: string) => {
      if (subType === 'D') {
        return formatMessage(m.identityDocumentTravelLicense)
      }
      if (subType === 'I') {
        return formatMessage(m.identityDocumentNotTravelLicense)
      }

      return formatMessage(m.identityDocument)
    }

    const licenseType = document.subType
      ? mapLicenseType(document.subType)
      : undefined

    const displayTag: GenericUserLicenseMetaTag | undefined = {
      text: isInvalid
        ? formatMessage(m.invalid)
        : isExpiring
        ? formatMessage(m.expiresWithin, {
            arg: formatMessage(m.sixMonths),
          })
        : document.expirationDate
        ? formatMessage(m.validUntil, {
            arg: formatDate(new Date(document.expirationDate)),
          })
        : formatMessage(m.valid),
      color: isInvalid || isExpiring ? 'red' : 'blue',
      icon: isInvalid
        ? GenericUserLicenseDataFieldTagType.closeCircle
        : GenericUserLicenseDataFieldTagType.checkmarkCircle,
      iconColor: isInvalid
        ? GenericUserLicenseDataFieldTagColor.red
        : isExpiring
        ? GenericUserLicenseDataFieldTagColor.yellow
        : GenericUserLicenseDataFieldTagColor.green,
      iconText: isInvalid
        ? formatMessage(isLost ? m.lost : m.expired)
        : formatMessage(m.valid),
    }

    const data: Array<GenericLicenseDataField> = [
      document.displayFirstName && document.displayLastName
        ? {
            type: GenericLicenseDataFieldType.Value,
            label: formatMessage(m.personName),
            value: capitalizeEveryWord(
              `${document.displayFirstName} ${document.displayLastName}`,
            ),
          }
        : null,
      licenseNumber
        ? {
            type: GenericLicenseDataFieldType.Value,
            label: formatMessage(m.number),
            value: licenseNumber,
            link: {
              label: formatMessage(m.copy),
              value: licenseNumber,
              type: GenericUserLicenseMetaLinksType.Copy,
            },
          }
        : null,
      licenseType
        ? {
            type: GenericLicenseDataFieldType.Value,
            label: formatMessage(m.licenseType),
            value: licenseType,
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
      document.mrzFirstName && document.mrzLastName && document.subType === 'D'
        ? {
            type: GenericLicenseDataFieldType.Value,
            label: formatMessage(m.passportNameComputer),
            value: `${document.mrzLastName} ${document.mrzFirstName}`,
          }
        : null,
      {
        type: GenericLicenseDataFieldType.Value,
        label: formatMessage(m.publisher),
        value: 'Þjóðskrá',
      },
    ].filter(isDefined)

    const alert: GenericUserLicenseAlert | undefined =
      isExpired || isExpiring || isLost
        ? {
            title:
              isExpired || isLost
                ? formatMessage(m.licenseInvalid, {
                    arg: formatMessage(m.identityDocument),
                  })
                : formatMessage(m.expiresWithin, {
                    arg: formatMessage(m.sixMonths),
                  }),
            message:
              isExpired || isLost
                ? formatMessage(m.invalidIdentityDocumentText)
                : formatMessage(m.expiringIdentityDocumentText),
            type: AlertType.WARNING,
          }
        : undefined

    const links: Array<GenericUserLicenseMetaLinks> = [
      isExpired || isExpiring || isLost
        ? {
            label: formatMessage(m.renewLicense, {
              arg: formatMessage(m.identityDocument).toLowerCase(),
            }),
            value: formatMessage(m.identityDocumentApplyUrl),
            type: GenericUserLicenseMetaLinksType.External,
          }
        : undefined,
    ].filter(isDefined)

    return {
      data,
      rawData: JSON.stringify(document),
      metadata: {
        links,
        licenseNumber: licenseNumber ?? '',
        licenseId: document.number?.toString(),
        expiryStatus:
          document.expiryStatus === 'EXPIRED'
            ? ExpiryStatus.EXPIRED
            : document.expiresWithinNoticeTime
            ? ExpiryStatus.EXPIRING
            : document.expiryStatus === 'LOST'
            ? ExpiryStatus.UNKNOWN
            : ExpiryStatus.ACTIVE,
        expired: isExpired,
        expireDate: document.expirationDate?.toISOString() ?? undefined,
        displayTag,
        name: licenseName ?? document.verboseType ?? undefined,
        title: formatMessage(m.identityDocument) ?? undefined,
        subtitle: formatMessage(m.identityDocumentNumberDisplay, {
          arg: licenseNumber ?? formatMessage(m.unknown),
        }),
        description: [{ text: formatMessage(m.identityDocumentDescription) }],
        alert,
      },
    }
  }
}
