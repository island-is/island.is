import {
  TrWebApiServicesCommonClientsModelsGetBenefitChildrenInformationReturn,
  TrWebApiServicesCommonClientsModelsGetPaymentTypesOverviewReturn,
} from '@island.is/clients/social-insurance-administration'
import type { Locale } from '@island.is/shared/types'
import { ChildBenefitInformation } from '../models/paymentTypes/childBenefitInformation.model'
import { PaymentTypeOverview } from '../models/paymentTypes/paymentTypeOverview.model'

export const mapPaymentTypeOverview = (
  row: TrWebApiServicesCommonClientsModelsGetPaymentTypesOverviewReturn,
  locale: Locale,
): PaymentTypeOverview => ({
  name:
    (locale === 'en'
      ? row.paymentTypeEnglish ?? row.paymentType
      : row.paymentType) ?? undefined,
  dateFrom: row.dateFrom ? new Date(row.dateFrom) : undefined,
  dateTo: row.dateTo ? new Date(row.dateTo) : undefined,
})

export const mapChildBenefitInformation = (
  row: TrWebApiServicesCommonClientsModelsGetBenefitChildrenInformationReturn,
): ChildBenefitInformation => ({
  name: row.name ?? undefined,
  nationalId: row.nationalId ?? undefined,
})
