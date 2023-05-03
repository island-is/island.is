import type {
  AuthConsentScopeFragment,
  GetConsentListQuery,
} from './Consent.generated'
import type { ReactNode } from 'react'

export type ConsentSectionProps = GetConsentListQuery['consentsList']['data'][0]['permissions'][0]

export interface ConsentLineProps extends AuthConsentScopeFragment {
  onChange: (newChecked: boolean) => void
  isLast: boolean
}

export interface ConsentGroupProps {
  displayName: string
  description?: string | null
  children?: ReactNode
}
