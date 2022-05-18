import startCase from 'lodash/startCase'

import { Locale } from '@island.is/shared/types'
import { Role } from '@island.is/skilavottord-web/graphql/schema'

export const getRoleTranslation = (role: Role, locale: Locale): string => {
  switch (role) {
    case Role.developer:
      return locale === 'is' ? 'Forritari' : 'Developer'
    case 'recyclingCompany':
      return locale === 'is' ? 'Móttökuaðili' : 'Recycling Company'
    case 'recyclingFund':
      return locale === 'is' ? 'Úrvinnslusjóður' : 'Recycling Fund'
    case 'recyclingCompanyAdmin':
      return locale === 'is' ? 'Mótökuaðili umsýsla' : 'Recycling Company Admin'
    default:
      return startCase(role)
  }
}
