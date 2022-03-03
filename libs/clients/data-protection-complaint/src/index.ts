export {
  CaseApi,
  ClientsApi,
  CreateCaseRequest,
  CreateQuickCaseRequest,
  DocumentInfo,
  LinkedContact,
  Metadata,
} from './gen/fetch/dev'
export { DataProtectionComplaintClientConfig } from './lib/config/'
export * from './lib/data-protection-complaint.module'
export { TokenMiddleware } from './lib/data-protection-complaint-client.middleware'
