import template from './lib/ConfirmJobOrIncomeTemplate'

export default template
export { errorMessages } from './lib/messages'
export {
  reconcile,
  splitEntries,
  buildEmployerSSNDelete,
  type BuildDelete,
  type ReconcileDelete,
  type ReconcileEntry,
  type SplitOptions,
} from './utils/reconcile'
export {
  toCapitalIncomeRow,
  toCasualWorkRow,
  toContractWorkRow,
  toPartTimeRow,
  toPensionRow,
  toSocialInsuranceRow,
} from './utils/persistedRows'
export const getFields = () => import('./fields/')
