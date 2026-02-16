import { RepeaterItem } from '@island.is/application/types'
import { MessageDescriptor } from 'react-intl'
import { shouldShowIncomePlanMonths } from './socialInsuranceAdministrationUtils'

export const generateMonthInput = (label: MessageDescriptor): RepeaterItem => {
  return {
    component: 'input',
    label,
    width: 'third',
    type: 'number',
    displayInTable: false,
    currency: true,
    suffix: '',
    condition: (_, activeField) => {
      return shouldShowIncomePlanMonths(activeField)
    },
  }
}
