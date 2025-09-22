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

  const judges = (usersData?.users ?? [])
    .filter(
      (user: User) =>
        (user.role === UserRole.DISTRICT_COURT_JUDGE ||
          user.role === UserRole.DISTRICT_COURT_ASSISTANT) &&
        user.institution?.id === institutionId,
    )
    .map((judge: User) => {
      return { label: judge.name ?? '', value: judge.id, judge }
    })

  const registrars = (usersData?.users ?? [])
    .filter(
      (user: User) =>
        user.role === UserRole.DISTRICT_COURT_REGISTRAR &&
        user.institution?.id === institutionId,
    )
    .map((registrar: User) => {
      return { label: registrar.name ?? '', value: registrar.id, registrar }
    })

  return { judges, registrars, loading: usersLoading }
}

export default useUsers
