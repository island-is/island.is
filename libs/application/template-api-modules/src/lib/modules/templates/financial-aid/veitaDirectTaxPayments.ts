import { FAApplication } from '@island.is/application/templates/financial-aid'
import { DirectTaxPayment, UserType } from '@island.is/financial-aid/shared/lib'

const withUserType = (
  payments: DirectTaxPayment[] | undefined,
  userType: UserType,
): DirectTaxPayment[] =>
  (payments ?? []).map((payment) => ({ ...payment, userType }))

// Labels follow whose tax data was fetched, not who submits the application.
export const getVeitaDirectTaxPayments = (
  externalData: FAApplication['externalData'],
): DirectTaxPayment[] => [
  ...withUserType(
    externalData.taxData?.data?.municipalitiesDirectTaxPayments
      ?.directTaxPayments,
    UserType.APPLICANT,
  ),
  ...withUserType(
    externalData.taxDataSpouse?.data?.municipalitiesDirectTaxPayments
      ?.directTaxPayments,
    UserType.SPOUSE,
  ),
]

// Veita types directTaxPayments as string[]; this keeps the existing format of a
// single JSON-encoded array. The contract has no fetch-success flags yet, so an
// empty list cannot distinguish "no income" from a failed RSK fetch.
export const serializeVeitaDirectTaxPayments = (
  externalData: FAApplication['externalData'],
): string[] => [JSON.stringify(getVeitaDirectTaxPayments(externalData))]
