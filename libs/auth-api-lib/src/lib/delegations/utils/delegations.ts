import kennitala from 'kennitala'
import { Op, WhereOptions } from 'sequelize'

import { User } from '@island.is/auth-nest-tools'
import {
  AuthDelegationProvider,
  AuthDelegationType,
} from '@island.is/shared/types'

import {
  DelegationRecordType,
  PersonalRepresentativeDelegationType,
} from '../types/delegationRecord'

export const delegationProviderTypeMap: Record<
  AuthDelegationProvider,
  DelegationRecordType[]
> = {
  [AuthDelegationProvider.NationalRegistry]: [
    AuthDelegationType.LegalGuardian,
    AuthDelegationType.LegalGuardianMinor,
  ],
  [AuthDelegationProvider.CompanyRegistry]: [
    AuthDelegationType.ProcurationHolder,
  ],
  [AuthDelegationProvider.PersonalRepresentativeRegistry]: [
    AuthDelegationType.PersonalRepresentative,
    PersonalRepresentativeDelegationType.PersonalRepresentativePostholf, // Remove when migration to syslumenn is complete
  ],
  [AuthDelegationProvider.Custom]: [AuthDelegationType.Custom],
  [AuthDelegationProvider.DistrictCommissionersRegistry]: [
    AuthDelegationType.LegalRepresentative,
    AuthDelegationType.PersonalRepresentative,
    PersonalRepresentativeDelegationType.PersonalRepresentativePostholf,
  ],
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
