import { Locale } from '@island.is/shared/types'
import {
  GenericLicenseDataField,
  GenericLicenseDataFieldType,
  GenericLicenseMappedPayloadResponse,
  GenericLicenseMapper,
  GenericUserLicensePayload,
} from '../licenceService.type'
import {
  DEFAULT_LICENSE_ID,
  LICENSE_NAMESPACE,
} from '../licenseService.constants'
import { Injectable } from '@nestjs/common'
import { isDefined } from '@island.is/shared/utils'
import { format } from 'kennitala'
import {
  type IdentityDocument,
  type IdentityDocumentChild,
} from '@island.is/clients/passports'
import { FormatMessage, IntlService } from '@island.is/cms-translations'
import { m } from '../messages'

const isChildPassport = (
  passport: IdentityDocument | IdentityDocumentChild,
): passport is IdentityDocumentChild => {
  return (passport as IdentityDocumentChild).childNationalId !== undefined
}

@Injectable()
export class PassportMapper implements GenericLicenseMapper {
  constructor(private readonly intlService: IntlService) {}
  async parsePayload(
    payload: Array<unknown>,
    locale: Locale = 'is',
  ): Promise<Array<GenericLicenseMappedPayloadResponse>> {
    if (!payload) {
      return Promise.resolve([])
    }
    const typedPayload = payload as Array<
      IdentityDocument | IdentityDocumentChild
    >

    const { formatMessage } = await this.intlService.useIntl(
      [LICENSE_NAMESPACE],
      locale,
    )

    const mappedLicenses: Array<GenericLicenseMappedPayloadResponse> = []
    typedPayload.forEach((t) => {
      if (isChildPassport(t)) {
        const childPassports = t.passports ?? []
        childPassports.forEach((p) => {
          const document = this.mapDocument(p, formatMessage)
          if (document) {
            mappedLicenses.push({
              licenseName: formatMessage(m.passport),
              type: 'child',
              payload: document,
            })
          }
        })
      } else {
        mappedLicenses.push({
          licenseName: formatMessage(m.passport),
          type: 'user',
          payload: this.mapDocument(t, formatMessage),
        })
      }
    })

    return mappedLicenses
  }

  private mapDocument(
    document: IdentityDocument,
    formatMessage: FormatMessage,
  ): GenericUserLicensePayload {
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

            value: format(document.number),
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

    return {
      data,
      rawData: JSON.stringify(document),
      metadata: {
        licenseNumber: document.number?.toString() ?? '',
        licenseId: DEFAULT_LICENSE_ID,
        expired: document.expiryStatus === 'EXPIRED',
        expireDate: document.expirationDate?.toISOString() ?? undefined,
      },
    }
  }
}
