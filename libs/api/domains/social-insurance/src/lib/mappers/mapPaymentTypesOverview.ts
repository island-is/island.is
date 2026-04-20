import {
  TrWebApiServicesCommonClientsModelsGetBenefitChildrenInformationReturn,
  TrWebApiServicesCommonClientsModelsGetPaymentTypesOverviewReturn,
} from '@island.is/clients/social-insurance-administration'
import { ChildBenefitInformation } from '../models/paymentTypes/childBenefitInformation.model'
import { PaymentTypeOverview } from '../models/paymentTypes/paymentTypeOverview.model'

export const mapPaymentTypeOverview = (
  row: TrWebApiServicesCommonClientsModelsGetPaymentTypesOverviewReturn,
): PaymentTypeOverview => ({
  name: row.paymentType ?? undefined,
  dateFrom: row.dateFrom ? new Date(row.dateFrom) : undefined,
  dateTo: row.dateTo ? new Date(row.dateTo) : undefined,
})

export const mapChildBenefitInformation = (
  row: TrWebApiServicesCommonClientsModelsGetBenefitChildrenInformationReturn,
): ChildBenefitInformation => ({
  name: row.name ?? undefined,
  nationalId: row.nationalId ?? undefined,
})
