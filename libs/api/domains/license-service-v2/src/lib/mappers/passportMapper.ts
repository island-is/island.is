import { Locale } from '@island.is/shared/types'
import {
  GenericLicenseDataField,
  GenericLicenseDataFieldType,
  GenericLicenseMappedPayloadResponse,
  GenericLicenseMapper,
  GenericUserLicenseDataFieldTagColor,
  GenericUserLicenseDataFieldTagType,
  GenericUserLicenseMetaLinksType,
} from '../licenceService.type'
import { AlertType, LICENSE_NAMESPACE } from '../licenseService.constants'
import { Inject, Injectable } from '@nestjs/common'
import { isDefined } from '@island.is/shared/utils'
import { format as formatNationalId } from 'kennitala'
import {
  type IdentityDocument,
  type IdentityDocumentChild,
} from '@island.is/clients/passports'
import { FormatMessage, IntlService } from '@island.is/cms-translations'
import { m } from '../messages'
import { GenericUserLicenseAlert } from '../dto/GenericUserLicenseAlert.dto'
import { GenericUserLicenseMetaLinks } from '../dto/GenericUserLicenseMetaLinks.dto'
import { GenericUserLicenseMetaTag } from '../dto/GenericUserLicenseMetaTag.dto'
import { capitalize } from '../utils/capitalize'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { Payload } from '../dto/Payload.dto'

const isChildPassport = (
  passport: IdentityDocument | IdentityDocumentChild,
): passport is IdentityDocumentChild => {
  return (passport as IdentityDocumentChild).childNationalId !== undefined
}

@Injectable()
export class PassportMapper implements GenericLicenseMapper {
  constructor(
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    private readonly intlService: IntlService,
  ) {}
  async parsePayload(
    payload: Array<unknown>,
    locale: Locale = 'is',
  ): Promise<Array<GenericLicenseMappedPayloadResponse>> {
    const { formatMessage } = await this.intlService.useIntl(
      [LICENSE_NAMESPACE],
      locale,
    )

    if (!payload.length) {
      return [
        {
          licenseName: formatMessage(m.passport),
          type: 'user',
          payload: {
            data: [],
            rawData: '',
            metadata: {
              title: formatMessage(m.passport),
              subtitle: formatMessage(m.noValidPassport),
              ctaLink: {
                label: formatMessage(m.apply),
                value: formatMessage(m.applyPassportUrl),
              },
            },
          },
        },
      ]
    }

    const typedPayload = payload as Array<
      IdentityDocument | IdentityDocumentChild
    >

    const mappedLicenses: Array<GenericLicenseMappedPayloadResponse> = []
    typedPayload.forEach((t) => {
      if (isChildPassport(t)) {
        const childDocuments = this.mapChildDocument(t, formatMessage)
        childDocuments.forEach((document) => {
          mappedLicenses.push({
            licenseName: formatMessage(m.passport),
            type: 'child',
            payload: document,
          })
        })
      } else {
        mappedLicenses.push({
          licenseName: formatMessage(m.passport),
          type: 'user',
          payload: this.mapDocument(t, formatMessage),
        })
      }
    })

    mappedLicenses.forEach((l) => this.logger.debug(l.type))

    return mappedLicenses
  }

  private mapChildDocument(
    document: IdentityDocumentChild,
    formatMessage: FormatMessage,
  ): Array<Payload> {
    if (document.passports?.length) {
      return (
        document.passports?.map((p) => this.mapDocument(p, formatMessage)) ?? []
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
  ): Payload {
    const data: Array<GenericLicenseDataField> = [
      document.displayFirstName && document.displayLastName
        ? {
            type: GenericLicenseDataFieldType.Value,
            label: formatMessage(m.name),
            value: `${document.displayFirstName} ${document.displayLastName}`,
          }
        : null,
      document.number
        ? {
            type: GenericLicenseDataFieldType.Value,
            label: formatMessage(m.number),

            value: formatNationalId(document.number),
          }
        : null,
      document.issuingDate
        ? {
            type: GenericLicenseDataFieldType.Value,
            label: formatMessage(m.publishedDate),
            value: document.issuingDate.toISOString(),
          }
        : null,
      document.expirationDate
        ? {
            type: GenericLicenseDataFieldType.Value,
            label: formatMessage(m.expiryDate),
            value: document.expirationDate.toISOString(),
          }
        : null,
      document.mrzFirstName && document.mrzLastName
        ? {
            type: GenericLicenseDataFieldType.Value,
            label: formatMessage(m.name),
            value: `${document.mrzFirstName} ${document.mrzLastName}`,
          }
        : null,
      document.sex
        ? {
            type: GenericLicenseDataFieldType.Value,
            label: formatMessage(m.sex),
            value: document.sex,
          }
        : null,
    ].filter(isDefined)

    const isExpired = document.expiryStatus === 'EXPIRED'
    const isLost = document.expiryStatus === 'LOST'
    const isExpiring = document.expiresWithinNoticeTime
    const isInvalid = document.status
      ? document.status.toLowerCase() === 'invalid'
      : undefined

    const alert: GenericUserLicenseAlert | undefined =
      isExpired || isExpiring || isLost
        ? {
            title:
              isExpired || isLost
                ? formatMessage(m.licenseInvalid, {
                    arg: formatMessage(m.passport),
                  })
                : formatMessage(m.expiresWithin, {
                    arg: formatMessage(m.sixMonths),
                  }),
            message:
              isExpired || isLost
                ? formatMessage(m.invalidPassportText)
                : formatMessage(m.expiringPassportText),
            type: AlertType.WARNING,
          }
        : undefined

    const links: Array<GenericUserLicenseMetaLinks> = [
      {
        label: formatMessage(m.notifyLostPassport),
        value: formatMessage(m.lostPassportUrl),
        type: GenericUserLicenseMetaLinksType.External,
      },
      isExpired || isExpiring || isLost
        ? {
            label: formatMessage(m.renewLicense, {
              arg: formatMessage(m.passport).toLowerCase(),
            }),
            value: formatMessage(m.applyPassportUrl),
            type: GenericUserLicenseMetaLinksType.External,
          }
        : undefined,
    ].filter(isDefined)

    const displayTag: GenericUserLicenseMetaTag | undefined =
      isInvalid !== undefined && document.expirationDate
        ? {
            text: isInvalid
              ? formatMessage(m.invalid)
              : isExpiring
              ? formatMessage(m.expiresWithin, {
                  arg: formatMessage(m.sixMonths),
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
        : undefined

    return {
      data,
      rawData: JSON.stringify(document),
      metadata: {
        links,
        licenseNumber: document.number?.toString() ?? '',
        licenseId: document.number?.toString(),
        expired: isExpired,
        expireDate: document.expirationDate?.toISOString() ?? undefined,
        displayTag,
        name: document.verboseType ?? undefined,
        title:
          document.displayFirstName && document.displayLastName
            ? capitalize(
                document.displayFirstName + ' ' + document.displayLastName,
              )
            : undefined,
        subtitle: formatMessage(m.passportNumberDisplay, {
          arg:
            document.subType && document.number
              ? `${document.subType}${document.number}`
              : formatMessage(m.unknown),
        }),
        description: [{ text: formatMessage(m.passportDescription) }],
        alert,
      },
    }
  }
}
