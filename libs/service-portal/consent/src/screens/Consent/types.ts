export interface ConsentSectionProps {
  provider: string
  providerLogo: string
  permissions: {
    title: string
    description: string
    hasConsent: boolean
  }[]
  organizations: any[]
}

export interface ConsentLineProps {
  title: string
  description: string
  hasConsent: boolean
  id: string
  onChange: (newChecked: boolean) => void
  isLast: boolean
}
