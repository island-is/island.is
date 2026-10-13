export { FinanceClientV3Module } from './lib/financeV3.module'
export {
  FinanceClientV3Service,
  FinanceClientV3ResultMissingError,
} from './lib/financeV3.service'
export { FinanceClientV3Config } from './lib/financeV3.config'
export type {
  CustomerDebtsOutput,
  DebtsDetailsDt,
  PayInfo,
  PayidDetailsDt,
  PaymentsInDt,
  PaymentsOutDt,
  ProblemDetailsDt,
  ValidatePaymentsInDt,
  ValidatePaymentsOutDt,
} from '../gen/fetch'
