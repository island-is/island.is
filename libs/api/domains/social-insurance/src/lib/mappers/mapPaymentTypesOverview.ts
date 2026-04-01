import {
  TrWebApiServicesCommonClientsModelsGetBenefitChildrenInformationReturn,
  TrWebApiServicesCommonClientsModelsGetPaymentTypesOverviewReturn,
} from '@island.is/clients/social-insurance-administration'
import { BenefitChildInformation } from '../models/paymentTypes/benefitChildInformation.model'
import { PaymentTypeOverview } from '../models/paymentTypes/paymentTypeOverview.model'

export const mapPaymentTypeOverview = (
  row: TrWebApiServicesCommonClientsModelsGetPaymentTypesOverviewReturn,
): PaymentTypeOverview => ({
  paymentType: row.paymentType ?? undefined,
  dateFrom: row.dateFrom ? new Date(row.dateFrom) : undefined,
  dateTo: row.dateTo ? new Date(row.dateTo) : undefined,
})

export const mapBenefitChildInformation = (
  row: TrWebApiServicesCommonClientsModelsGetBenefitChildrenInformationReturn,
): BenefitChildInformation => ({
  name: row.name ?? undefined,
  nationalId: row.nationalId ?? undefined,
})
