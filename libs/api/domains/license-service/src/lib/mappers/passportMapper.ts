import { Locale } from '@island.is/shared/types'
import {
  GenericLicenseDataField,
  GenericLicenseDataFieldType,
  GenericLicenseLabels,
  GenericLicenseMappedPayloadResponse,
  GenericLicenseMapper,
  GenericUserLicensePayload,
} from '../licenceService.type'
import { DEFAULT_LICENSE_ID } from '../licenseService.constants'
import { getLabel } from '../utils/translations'
import { Injectable } from '@nestjs/common'
import { isDefined } from '@island.is/shared/utils'
import { format } from 'kennitala'
import {
  type IdentityDocument,
  type IdentityDocumentChild,
} from '@island.is/clients/passports'

const isChildPassport = (
  passport: IdentityDocument | IdentityDocumentChild,
): passport is IdentityDocumentChild => {
  return (passport as IdentityDocumentChild).childNationalId !== undefined
}

@Injectable()
export class PassportMapper implements GenericLicenseMapper {
  parsePayload(
    payload: Array<unknown>,
    locale: Locale = 'is',
    labels?: GenericLicenseLabels,
  ): Array<GenericLicenseMappedPayloadResponse> {
    if (!payload) {
      return []
    }
    const typedPayload = payload as Array<
      IdentityDocument | IdentityDocumentChild
    >

    const mappedLicenses: Array<GenericLicenseMappedPayloadResponse> = []
    typedPayload.forEach((t) => {
      if (isChildPassport(t)) {
        const childPassports = t.passports ?? []
        childPassports.forEach((p) => {
          const document = this.mapDocument(p, locale, labels)
          if (document) {
            mappedLicenses.push({
              type: 'child',
              payload: document,
            })
          }
        })
      } else {
        mappedLicenses.push({
          type: 'user',
          payload: this.mapDocument(t, locale, labels),
        })
      }
    })

    return mappedLicenses
  }

  private mapDocument(
    document: IdentityDocument,
    locale: Locale = 'is',
    label?: GenericLicenseLabels,
  ): GenericUserLicensePayload {
    const labels = label?.labels
    const data: Array<GenericLicenseDataField> = [
      document.displayFirstName && document.displayLastName
        ? {
            type: GenericLicenseDataFieldType.Value,
            label: getLabel('name', locale, labels),
            value: `${document.displayFirstName} ${document.displayLastName}`,
          }
        : null,
      document.number
        ? {
            type: GenericLicenseDataFieldType.Value,
            label: getLabel('number', locale, labels),
            value: format(document.number),
          }
        : null,
      document.issuingDate
        ? {
            type: GenericLicenseDataFieldType.Value,
            label: getLabel('publishedDate', locale, labels),
            value: document.issuingDate.toISOString(),
          }
        : null,
      document.expirationDate
        ? {
            type: GenericLicenseDataFieldType.Value,
            label: getLabel('expiryDate', locale, labels),
            value: document.expirationDate.toISOString(),
          }
        : null,
      document.mrzFirstName && document.mrzLastName
        ? {
            type: GenericLicenseDataFieldType.Value,
            label: getLabel('name', locale, labels),
            value: `${document.mrzFirstName} ${document.mrzLastName}`,
          }
        : null,
      document.sex
        ? {
            type: GenericLicenseDataFieldType.Value,
            label: getLabel('sex', locale, labels),
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
