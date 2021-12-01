export * from './lib/data-protection-complaint-client.module'
export {
  CaseApi,
  ClientsApi,
  CreateQuickCaseRequest,
  CreateCaseRequest,
  Metadata,
  LinkedContact,
  DocumentInfo,
} from './gen/fetch/dev'
export { DataProtectionComplaintClientConfig } from './lib/data-protection-complaint-client.config'
export { TokenMiddleware } from './lib/data-protection-complaint-client.middleware'
