import { User } from '@island.is/auth-nest-tools'
import { Op, WhereOptions } from 'sequelize'
import {
  AuthDelegationProvider,
  AuthDelegationType,
} from '@island.is/shared/types'

const delegationProviderTypeMap: Record<
  AuthDelegationProvider,
  AuthDelegationType[]
> = {
  [AuthDelegationProvider.NationalRegistry]: [AuthDelegationType.LegalGuardian],
  [AuthDelegationProvider.CompanyRegistry]: [
    AuthDelegationType.ProcurationHolder,
  ],
  [AuthDelegationProvider.PersonalRepresentativeRegistry]: [
    AuthDelegationType.PersonalRepresentative,
  ],
  [AuthDelegationProvider.Custom]: [AuthDelegationType.Custom],
}

export const getDelegationNoActorWhereClause = (user: User): WhereOptions => {
  if (user.actor) {
    return { toNationalId: { [Op.ne]: user.actor.nationalId } }
  }
  return {}
}

export const validateDelegationTypeAndProvider = (
  type: AuthDelegationType,
  provider: AuthDelegationProvider,
) => {
  const validTypes = delegationProviderTypeMap[provider]

  if (!validTypes) {
    return false
  }

  return validTypes.includes(type)
}
