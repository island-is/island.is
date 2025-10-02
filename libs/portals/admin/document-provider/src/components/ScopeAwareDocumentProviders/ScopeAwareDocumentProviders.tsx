import { useUserInfo } from '@island.is/react-spa/bff'
import { AdminPortalScope } from '@island.is/auth/scopes'
import { DocumentProvidersLoading } from '../DocumentProvidersLoading/DocumentProvidersLoading'

interface ScopeAwareDocumentProvidersProps {
  children: {
    adminComponent: React.ReactNode
    institutionComponent: React.ReactNode
  }
}

/**
 * A parent component that checks user scopes and displays the appropriate child component
 * based on the user's permissions in the document provider system.
 */
export const ScopeAwareDocumentProviders = ({
  children,
}: ScopeAwareDocumentProvidersProps) => {
  const user = useUserInfo()

  // Show loading state while user info is being fetched
  if (!user) {
    return <DocumentProvidersLoading />
  }

  // Check if user has institution-specific scope
  if (user.scopes?.includes(AdminPortalScope.documentProviderInstitution)) {
    return children.institutionComponent
  }

  // Check if user has admin scope
  if (
    user.scopes?.includes(AdminPortalScope.documentProvider) ||
    user.scopes?.includes(AdminPortalScope.documentProviderAdmin)
  ) {
    return children.adminComponent
  }

  // If user doesn't have any valid scopes, show loading (this shouldn't happen due to route guards)
  return <DocumentProvidersLoading />
}

export default ScopeAwareDocumentProviders
