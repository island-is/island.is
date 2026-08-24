import { coreErrorMessages } from '@island.is/application/core'
import { submitErrorMessages } from '@island.is/application/templates/hms/housing-benefits'
import {
  HousingBenefitsApplicationErrorCode,
  HousingBenefitsApplicationReturnModel,
} from '@island.is/clients/hms-housing-benefits'
import { TemplateApiError } from '@island.is/nest/problem'
import { ProviderErrorReason } from '@island.is/shared/problem'
import { StaticText } from '@island.is/shared/types'

const formatValidationErrors = (
  validationErrors?: HousingBenefitsApplicationReturnModel['validationErrors'],
): string | undefined => {
  if (!validationErrors) return undefined

  const lines = Object.entries(validationErrors).flatMap(([field, messages]) =>
    (messages ?? []).map((msg) => `${field}: ${msg}`),
  )

  return lines.length > 0 ? lines.join('\n') : undefined
}

const getApiDetail = (
  result: HousingBenefitsApplicationReturnModel,
): string | undefined =>
  result.errorMessage ?? result.errorDescription ?? undefined

const getSummaryForCode = (
  code: HousingBenefitsApplicationErrorCode,
  result: HousingBenefitsApplicationReturnModel,
): StaticText | string => {
  switch (code) {
    case HousingBenefitsApplicationErrorCode.InvalidModelState:
      return (
        formatValidationErrors(result.validationErrors) ??
        submitErrorMessages.invalidModelState
      )

    case HousingBenefitsApplicationErrorCode.PropertyNotFound:
      return {
        ...submitErrorMessages.propertyNotFound,
        values: { propertyNumber: result.referenceText ?? '' },
      }

    case HousingBenefitsApplicationErrorCode.LeaseContractNotFound:
      return {
        ...submitErrorMessages.leaseContractNotFound,
        values: { contractNumber: String(result.referenceNumber ?? '') },
      }

    case HousingBenefitsApplicationErrorCode.ActiveApplicationAlreadyExists:
      return {
        ...submitErrorMessages.activeApplicationAlreadyExists,
        values: { applicationNumber: String(result.referenceNumber ?? '') },
      }

    case HousingBenefitsApplicationErrorCode.NullApplicationPayload:
      return submitErrorMessages.nullApplicationPayload

    case HousingBenefitsApplicationErrorCode.InvalidApplicationData:
      return getApiDetail(result) ?? submitErrorMessages.invalidApplicationData

    case HousingBenefitsApplicationErrorCode.ProcessingFailed:
      return submitErrorMessages.processingFailed

    case HousingBenefitsApplicationErrorCode.Unknown:
    default:
      return getApiDetail(result) ?? submitErrorMessages.unknown
  }
}

export const mapHousingBenefitsSubmissionErrorReason = (
  result: HousingBenefitsApplicationReturnModel,
): ProviderErrorReason => ({
  title: coreErrorMessages.failedDataProviderSubmit,
  summary: getSummaryForCode(
    result.errorCode ?? HousingBenefitsApplicationErrorCode.Unknown,
    result,
  ),
})

export const toHousingBenefitsSubmissionTemplateApiError = (
  result: HousingBenefitsApplicationReturnModel,
  status: number,
): TemplateApiError =>
  new TemplateApiError(mapHousingBenefitsSubmissionErrorReason(result), status)
