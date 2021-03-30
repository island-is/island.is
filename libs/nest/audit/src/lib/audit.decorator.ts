import { SetMetadata } from '@nestjs/common'
import { AuditTemplate } from './audit.service'

export const AUDIT_METADATA_KEY = Symbol('audit')

export const Audit = <ReturnType>(
  template: Partial<AuditTemplate<ReturnType>> = {},
) => SetMetadata(AUDIT_METADATA_KEY, template)
