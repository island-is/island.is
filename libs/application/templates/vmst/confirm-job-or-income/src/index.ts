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
} from './utils/reconcile'
export const getFields = () => import('./fields/')
