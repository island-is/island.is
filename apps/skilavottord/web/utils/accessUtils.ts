import { hasMunicipalityRole } from '../auth/utils'
import { Role, SkilavottordUser } from '../graphql/schema'

export const getPartnerId = (
  user: SkilavottordUser | undefined,
  municipalityId: string | null,
  partnerId: string | null,
  role: Role,
) => {
  // If the user has municipality role, then he can only create a new access under the same municipality
  if (hasMunicipalityRole(user?.role) && hasMunicipalityRole(role)) {
    return user.partnerId
  }

  // If selected role is municipality, use municipalityId, else use partnerId
  return hasMunicipalityRole(role) ? municipalityId ?? null : partnerId ?? null
}
