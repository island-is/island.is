import startCase from 'lodash/startCase'

import { Locale } from '@island.is/shared/types'
import { Role } from '@island.is/skilavottord-web/graphql/schema'

export const getRoleTranslation = (role: Role, locale: Locale): string => {
  switch (role) {
    case Role.developer:
      return locale === 'is' ? 'Forritari' : 'Developer'
    case Role.recyclingCompany:
      return locale === 'is' ? 'Móttökuaðili' : 'Recycling Company'
    case Role.recyclingFund:
      return locale === 'is' ? 'Úrvinnslusjóður' : 'Recycling Fund'
    case Role.recyclingCompanyAdmin:
      return locale === 'is'
        ? 'Móttökuaðili umsýsla'
        : 'Recycling Company Admin'
    case Role.municipality:
      return locale === 'is' ? 'Sveitarfélag' : 'Municipality'
    default:
      return startCase(role)
  }
}
