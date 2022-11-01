import startOfDay from 'date-fns/startOfDay'
import { Op, WhereOptions } from 'sequelize'

import {
  DelegationScopeDTO,
  UpdateDelegationScopeDTO,
} from '../dto/delegation-scope.dto'
import { DelegationValidity } from '../types/delegationValidity'

export const compareScopesByName = (
  scopeA: DelegationScopeDTO,
  scopeB: DelegationScopeDTO,
): boolean => {
  return scopeA.scopeName === scopeB.scopeName
}

export const getScopeValidityWhereClause = (
  validity: DelegationValidity,
): WhereOptions | undefined => {
  let scopesWhere: WhereOptions | undefined
  const startOfToday = startOfDay(new Date())
  const futureValidToWhere: WhereOptions = {
    // validTo > startOfToday OR validTo IS NULL
    validTo: {
      [Op.or]: {
        [Op.gte]: startOfToday,
        [Op.is]: null,
      },
    },
  }

  if (validity === DelegationValidity.NOW) {
    scopesWhere = {
      validFrom: { [Op.lte]: startOfToday },
      ...futureValidToWhere,
    }
  } else if (validity === DelegationValidity.INCLUDE_FUTURE) {
    scopesWhere = futureValidToWhere
  } else if (validity === DelegationValidity.PAST) {
    scopesWhere = {
      validTo: {
        [Op.lt]: startOfToday,
      },
    }
  }

  return scopesWhere
}

export const validateScopesPeriod = (
  scopes?: UpdateDelegationScopeDTO[],
): boolean => {
  if (!scopes || scopes.length === 0) {
    return true
  }

  const startOfToday = startOfDay(new Date())
  // validTo needs to be the current day or in the future
  return scopes.every(
    (scope) => scope.validTo && new Date(scope.validTo) >= startOfToday,
  )
}
