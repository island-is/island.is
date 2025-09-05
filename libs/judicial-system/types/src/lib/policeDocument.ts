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
