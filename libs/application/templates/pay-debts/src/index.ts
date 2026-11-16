import template from './lib/template'

export const getFields = () => import('./fields/')

export { getDebtPaymentItems } from './utils/getSelectedDebts'
export { payment as paymentMessages } from './lib/messages'

export default template
