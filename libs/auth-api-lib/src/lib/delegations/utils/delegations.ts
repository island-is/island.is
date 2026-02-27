import kennitala from 'kennitala'
import { Op, WhereOptions } from 'sequelize'

import { User } from '@island.is/auth-nest-tools'
import {
  SyslumennDelegationType,
  SyslumennService,
} from '@island.is/clients/syslumenn'
import { logger } from '@island.is/logging'
import { FeatureFlagService, Features } from '@island.is/nest/feature-flags'
import {
  AuthDelegationProvider,
  AuthDelegationType,
} from '@island.is/shared/types'

import type { DelegationsIndexService } from '../delegations-index.service'
import { DelegationRecordInputDTO } from '../dto/delegation-index.dto'
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

export interface ValidateDistrictCommissionersDelegationsParams {
  user: User
  fromNationalId: string
  delegationTypes: AuthDelegationType[]
  featureFlagService: FeatureFlagService
  syslumennService: SyslumennService
  delegationsIndexService: DelegationsIndexService
}

export interface ValidateDistrictCommissionersDelegationsResult {
  validTypes: string[]
  legalRepIsValid: boolean
  personalRepIsValid: boolean
}

/** Validates Syslumenn delegation types, removes invalid index records, returns valid types and flags. */
export async function validateDistrictCommissionersDelegations(
  params: ValidateDistrictCommissionersDelegationsParams,
): Promise<ValidateDistrictCommissionersDelegationsResult> {
  const {
    user,
    fromNationalId,
    delegationTypes,
    featureFlagService,
    syslumennService,
    delegationsIndexService,
  } = params

  const validatePersonalRepsAtSyslumenn = await featureFlagService.getValue(
    Features.usePersonalRepresentativesFromSyslumenn,
    false,
    user,
  )

  const hasLegalRepresentative = delegationTypes.includes(
    AuthDelegationType.LegalRepresentative,
  )
  const hasPersonalRepresentative = delegationTypes.some((type) =>
    String(type).startsWith('PersonalRepresentative'),
  )

  const validTypes: string[] = []
  let legalRepIsValid = false
  let personalRepIsValid = false

  if (hasLegalRepresentative) {
    try {
      const valid = await syslumennService.checkIfDelegationExists(
        user.nationalId,
        fromNationalId,
        SyslumennDelegationType.LegalRepresentative,
      )
      if (valid) {
        validTypes.push(AuthDelegationType.LegalRepresentative)
        legalRepIsValid = true
      } else {
        void delegationsIndexService.removeDelegationRecord(
          {
            fromNationalId,
            toNationalId: user.nationalId,
            type: AuthDelegationType.LegalRepresentative,
            provider: AuthDelegationProvider.DistrictCommissionersRegistry,
          } as DelegationRecordInputDTO,
          user,
        )
      }
    } catch (error) {
      logger.error(
        `Failed checking if LegalRepresentative delegation exists at syslumenn`,
        error,
      )
    }
  }

  if (hasPersonalRepresentative) {
    const prTypes = delegationTypes.filter((dt) =>
      String(dt).startsWith('PersonalRepresentative'),
    )

    if (validatePersonalRepsAtSyslumenn) {
      try {
        const valid = await syslumennService.checkIfDelegationExists(
          user.nationalId,
          fromNationalId,
          SyslumennDelegationType.PersonalRepresentative,
        )
        if (valid) {
          validTypes.push(...prTypes)
          personalRepIsValid = true
        } else {
          for (const prType of prTypes) {
            void delegationsIndexService.removeDelegationRecord(
              {
                fromNationalId,
                toNationalId: user.nationalId,
                type: prType as AuthDelegationType,
                provider: AuthDelegationProvider.DistrictCommissionersRegistry,
              } as DelegationRecordInputDTO,
              user,
            )
          }
        }
      } catch (error) {
        logger.error(
          `Failed checking if PersonalRepresentative delegation exists at syslumenn`,
          error,
        )
      }
    } else {
      validTypes.push(...prTypes)
      personalRepIsValid = true
    }
  }

  return { validTypes, legalRepIsValid, personalRepIsValid }
}
