import { TrWebApiServicesCommonClientsEnumsTaxBracketAction } from '@island.is/clients/social-insurance-administration'
import { TaxBracketAction } from '../enums/taxBracketAction'

export const parseTaxBracketAction = (
  action: TrWebApiServicesCommonClientsEnumsTaxBracketAction,
): TaxBracketAction | null => {
  switch (action) {
    case TrWebApiServicesCommonClientsEnumsTaxBracketAction.NUMBER_0:
      return TaxBracketAction.IncomePlan
    case TrWebApiServicesCommonClientsEnumsTaxBracketAction.NUMBER_1:
      return TaxBracketAction.Bracket1
    case TrWebApiServicesCommonClientsEnumsTaxBracketAction.NUMBER_2:
      return TaxBracketAction.Bracket2
    default:
      return null
  }
}
