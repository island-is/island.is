import {
  User,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { useSelectCourtOfficialsUsersQuery } from './selectCourtOfficialsUsers.generated'

const useUsers = (institutionId?: string) => {
  const { data: usersData, loading: usersLoading } =
    useSelectCourtOfficialsUsersQuery({
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    })

  const mapUser = (user: User) => ({
    label: user.name ?? '',
    value: user.id,
    user,
  })

  const judges = (usersData?.users ?? [])
    .filter(
      (user: User) =>
        (user.role === UserRole.DISTRICT_COURT_JUDGE ||
          user.role === UserRole.DISTRICT_COURT_ASSISTANT) &&
        user.institution?.id === institutionId,
    )
    .map(mapUser)

  const registrars = (usersData?.users ?? [])
    .filter(
      (user: User) =>
        user.role === UserRole.DISTRICT_COURT_REGISTRAR &&
        user.institution?.id === institutionId,
    )
    .map(mapUser)

  const districtCourtAssistants = (usersData?.users ?? [])
    .filter(
      (user: User) =>
        user.role === UserRole.DISTRICT_COURT_ASSISTANT &&
        user.institution?.id === institutionId,
    )
    .map(mapUser)

  return { judges, registrars, districtCourtAssistants, loading: usersLoading }
}

export default useUsers
