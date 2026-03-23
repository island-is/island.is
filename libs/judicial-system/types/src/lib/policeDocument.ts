import { ServiceStatus, VerdictServiceStatus } from './defendant'

export interface PoliceDocumentInfo<T> {
  serviceStatus?: T
  comment?: string
  servedBy?: string
  defenderNationalId?: string
  serviceDate?: Date
}

export type SubpoenaPoliceDocumentInfo = PoliceDocumentInfo<ServiceStatus>
export type VerdictPoliceDocumentInfo = PoliceDocumentInfo<VerdictServiceStatus>

const isNewValueSetAndDifferent = (
  newValue: unknown,
  oldValue: unknown,
): boolean => Boolean(newValue) && newValue !== oldValue

const isDocumentInfoChanged = <T>(
  newInfo: PoliceDocumentInfo<T>,
  oldInfo: PoliceDocumentInfo<T>,
) => {
  const documentResponseKeys: Array<keyof PoliceDocumentInfo<T>> = [
    'serviceStatus',
    'comment',
    'servedBy',
    'defenderNationalId',
    'serviceDate',
  ]
  return documentResponseKeys.some((key) =>
    isNewValueSetAndDifferent(newInfo[key], oldInfo[key]),
  )
}

export const isSubpoenaInfoChanged = (
  newInfo: SubpoenaPoliceDocumentInfo,
  oldInfo: SubpoenaPoliceDocumentInfo,
) => isDocumentInfoChanged<ServiceStatus>(newInfo, oldInfo)

export const isVerdictInfoChanged = (
  newInfo: VerdictPoliceDocumentInfo,
  oldInfo: VerdictPoliceDocumentInfo,
) => isDocumentInfoChanged<VerdictServiceStatus>(newInfo, oldInfo)

export const getServiceDateFromSupplements = (
  supplements?: Array<{ code?: string | null; value?: string | null }> | null,
): Date | undefined => {
  if (!supplements) return undefined

  const publishDateSupplement = supplements.find(
    (supplement) =>
      supplement.code === DocumentDeliverySupplementCode.PUBLISH_DATE,
  )

  if (!publishDateSupplement?.value) return undefined

  const date = new Date(publishDateSupplement.value + 'T00:00:00.000Z')

  if (isNaN(date.getTime())) {
    return undefined
  }

  return date
}

export enum DocumentDeliverySupplementCode {
  PUBLISH_DATE = 'PUBLISH_DATE',
  APPEAL_DECISION = 'APPEAL_DECISION',
  // The supplements below aren't currently used by us but we do receive them,
  // so good to have them defined in case we want to use them in the future.
  PUBLISHED_RECEIPT_NUMBER = 'PUBLISHED_RECEIPT_NUMBER', // Receipt number from the legal paper after publishing
  RECEIPT_NUMBER = 'RECEIPT_NUMBER', // Receipt number for verdicts sent to the legal paper
}

export enum DocumentDeliveryMethod {
  LEGAL_PAPER = 'LOGBIRTING_BIRT',
}
