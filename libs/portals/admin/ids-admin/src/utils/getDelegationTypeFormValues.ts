import { AuthDelegationProvider } from '@island.is/shared/types'

const superAdminOnlyProviders = [
  AuthDelegationProvider.PersonalRepresentativeRegistry,
  AuthDelegationProvider.DistrictCommissionersRegistry,
] as string[]

type DelegationProviderLike = {
  id: string
  delegationTypes: ({ id: string } | null)[]
} | null

export const isDelegationProviderVisible = (
  providerId: string,
  isSuperAdmin: boolean,
) => isSuperAdmin || !superAdminOnlyProviders.includes(providerId)

export const getEditableDelegationTypes = (
  providers: DelegationProviderLike[],
) =>
  providers.flatMap(
    (provider) =>
      provider?.delegationTypes.flatMap((type) => (type ? [type.id] : [])) ??
      [],
  )

/**
 * Submits the full desired state rather than what changed while the form was
 * open. Adding a delegation type the client already has is an upsert and
 * removing one it does not have is a no-op, so the same payload makes every
 * environment it is sent to converge on this state, which is what "sync
 * settings" and "save in all environments" need. Only types of the given
 * providers are included, so an admin cannot remove types they are not shown.
 */
export const getDelegationTypeFormValues = ({
  providers,
  supportedDelegationTypes,
}: {
  providers: DelegationProviderLike[]
  supportedDelegationTypes: string[]
}) => {
  const editableDelegationTypes = getEditableDelegationTypes(providers)

  return {
    addedDelegationTypes: editableDelegationTypes.filter((type) =>
      supportedDelegationTypes.includes(type),
    ),
    removedDelegationTypes: editableDelegationTypes.filter(
      (type) => !supportedDelegationTypes.includes(type),
    ),
  }
}
