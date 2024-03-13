import { User } from '@island.is/auth-nest-tools'
import { Op, WhereOptions } from 'sequelize'
import {
  AuthDelegationProvider,
  AuthDelegationType,
} from '@island.is/shared/types'
import {
  DelegationRecordType,
  PersonalRepresentativeDelegationType,
} from '../types/delegationRecord'
import kennitala from 'kennitala'

const delegationProviderTypeMap: Record<
  AuthDelegationProvider,
  DelegationRecordType[]
> = {
  [AuthDelegationProvider.NationalRegistry]: [AuthDelegationType.LegalGuardian],
  [AuthDelegationProvider.CompanyRegistry]: [
    AuthDelegationType.ProcurationHolder,
  ],
  [AuthDelegationProvider.PersonalRepresentativeRegistry]: [
    AuthDelegationType.PersonalRepresentative,
    PersonalRepresentativeDelegationType.PersonalRepresentativePostholf,
  ],
  [AuthDelegationProvider.Custom]: [AuthDelegationType.Custom],
}

export const getDelegationNoActorWhereClause = (user: User): WhereOptions => {
  if (user.actor) {
    return { toNationalId: { [Op.ne]: user.actor.nationalId } }
  }
  return {}
}

export const validateDelegationTypeAndProvider = ({
  type,
  provider,
}: {
  type: DelegationRecordType
  provider: AuthDelegationProvider
}) => {
  const validTypes = delegationProviderTypeMap[provider]

  if (!validTypes) {
    return false
  }

  return validTypes.includes(type)
}

export const validateToAndFromNationalId = ({
  fromNationalId,
  toNationalId,
}: {
  fromNationalId: string
  toNationalId: string
}) =>
  kennitala.isValid(toNationalId) &&
  kennitala.isValid(fromNationalId) &&
  fromNationalId !== toNationalId
