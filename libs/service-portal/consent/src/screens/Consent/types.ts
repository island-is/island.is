import type {
  AuthConsentScopeFragment,
  GetConsentListQuery,
} from './Consent.generated'
import type { ReactNode } from 'react'

type PermissionGroup = GetConsentListQuery['consentsList']['data'][0]['permissions'][0]

export type ConsentSectionProps = {
  isLast?: boolean
} & PermissionGroup

export interface ConsentLineProps extends AuthConsentScopeFragment {
  onChange: (newChecked: boolean) => void
  isLast: boolean
}

export interface ConsentGroupProps {
  displayName: string
  description?: string | null
  children?: ReactNode
}
