import AuditLog from './model'

export const createAuditLog = (
  state: string,
  title: string,
  authorSSN: string,
  applicationId: string,
  data: object = {},
) => AuditLog.create({ state, title, authorSSN, applicationId, data })
