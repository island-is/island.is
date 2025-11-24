import { RepeaterItem } from '@island.is/application/types'
import { MessageDescriptor } from 'react-intl'
import { monthInputCondition } from './conditions'

export const generateMonthInput = (label: MessageDescriptor): RepeaterItem => {
  return {
    component: 'input',
    label,
    width: 'third',
    type: 'number',
    displayInTable: false,
    currency: true,
    suffix: '',
    condition: (_, activeField) => monthInputCondition(activeField),
  }
}
