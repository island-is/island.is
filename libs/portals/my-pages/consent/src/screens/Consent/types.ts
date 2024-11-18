import type {
  AuthConsentScopeNodeFragment,
  GetConsentListQuery,
} from './Consent.generated'
import type { ReactNode } from 'react'

type PermissionGroup =
  GetConsentListQuery['consentsList']['data'][0]['tenants'][0]

export type ConsentSectionProps = {
  clientId: string
  isLast?: boolean
} & PermissionGroup

export interface ConsentLineProps extends AuthConsentScopeNodeFragment {
  clientId: string
  isLast: boolean
}

export interface ConsentGroupProps {
  displayName: string
  description?: string | null
  children?: ReactNode
}
