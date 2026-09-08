import { getValueViaPath } from '@island.is/application/core'
import { Application } from '@island.is/application/types'

import { ComponentDto } from '../dto/screen.dto'
import { FormTextResolver } from '../i18n-resolver.service'
import { FieldMapper } from './types'
import { asResolvableFormText } from './utils'

type PaymentCatalogRow = {
  priceAmount: number
  chargeItemName: string
  chargeItemCode: string
}

type PaymentChargeOverviewRaw = {
  forPaymentLabel?: unknown
  totalLabel?: unknown
  getSelectedChargeItems?: (app: unknown) => unknown[]
}

type SelectedChargeListItem = {
  chargeItemCode: string
  chargeItemQuantity?: number
  extraLabel?: unknown
}

const formatIsk = (value: number): string =>
  value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' kr.'

const buildPaymentChargeOverviewFields = (
  raw: PaymentChargeOverviewRaw,
  application: Application,
  resolver: FormTextResolver,
): Pick<
  ComponentDto,
  | 'paymentChargeHeading'
  | 'paymentChargeLines'
  | 'paymentChargeTotalLabel'
  | 'paymentChargeTotalAmount'
> => {
  const heading =
    resolver.resolve(asResolvableFormText(raw.forPaymentLabel)) || ''
  const totalLabel =
    resolver.resolve(asResolvableFormText(raw.totalLabel)) || ''
  const getSelected = raw.getSelectedChargeItems
  if (typeof getSelected !== 'function') {
    return {
      paymentChargeHeading: heading,
      paymentChargeLines: [],
      paymentChargeTotalLabel: totalLabel,
      paymentChargeTotalAmount: formatIsk(0),
    }
  }

  const selectedChargeList = getSelected(
    application,
  ) as SelectedChargeListItem[]

  const allChargeWithInfoList =
    getValueViaPath<PaymentCatalogRow[]>(
      application.externalData,
      'payment.data',
    ) ?? []

  const merged = selectedChargeList.map((charge) => {
    const chargeWithInfo = allChargeWithInfoList.find(
      (c) => c.chargeItemCode === charge.chargeItemCode,
    )
    const quantity = charge.chargeItemQuantity ?? 1
    const unit = chargeWithInfo?.priceAmount ?? 0
    const extra =
      charge.extraLabel !== undefined
        ? resolver.resolve(asResolvableFormText(charge.extraLabel))
        : ''
    const name = chargeWithInfo?.chargeItemName ?? charge.chargeItemCode
    const description = extra ? `${name} - ${extra}` : name
    return {
      description,
      quantity: String(quantity),
      amount: formatIsk(unit * quantity),
    }
  })

  const totalPrice = selectedChargeList.reduce((sum, charge) => {
    const chargeWithInfo = allChargeWithInfoList.find(
      (c) => c.chargeItemCode === charge.chargeItemCode,
    )
    const q = charge.chargeItemQuantity ?? 1
    const unit = chargeWithInfo?.priceAmount ?? 0
    return sum + unit * q
  }, 0)

  return {
    paymentChargeHeading: heading,
    paymentChargeLines: merged,
    paymentChargeTotalLabel: totalLabel,
    paymentChargeTotalAmount: formatIsk(totalPrice),
  }
}

export const mapPaymentChargeOverviewField: FieldMapper = (
  component,
  raw,
  { application, resolver },
) => {
  Object.assign(
    component,
    buildPaymentChargeOverviewFields(
      raw as PaymentChargeOverviewRaw,
      application,
      resolver,
    ),
  )
}
