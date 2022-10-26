import {
  AccessDenied,
  ServicePortalModuleProps,
} from '@island.is/service-portal/core'

type DelegationsAccessGuardProps = ServicePortalModuleProps & {
  children: React.ReactNode
}

export const DelegationsAccessGuard = ({
  userInfo,
  client,
  children,
}: DelegationsAccessGuardProps) => {
  const actor = userInfo.profile.actor
  const isDelegation = Boolean(actor)
  const isCompany = userInfo.profile.subjectType === 'legalEntity'
  const personDelegation = isDelegation && !isCompany

  if (personDelegation) {
    return <AccessDenied userInfo={userInfo} client={client} />
  }

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>
}
