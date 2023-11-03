export * from './lib/data-protection-complaint.module'
export {
  CaseApi,
  ClientsApi,
  CreateQuickCaseRequest,
  CreateCaseRequest,
  Metadata,
  LinkedContact,
  DocumentInfo,
} from './gen/fetch'
export { TokenMiddleware } from './lib/data-protection-complaint-client.middleware'
export { DataProtectionComplaintClientConfig } from './lib/config/'
