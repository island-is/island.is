import { TaxBracketAction } from '../enums/taxBracketAction'

export const parseTaxBracketAction = (
  value?: string | null,
): TaxBracketAction | null => {
  switch (value) {
    case 'INCOME_PLAN':
      return TaxBracketAction.IncomePlan
    case 'BRACKET_1':
      return TaxBracketAction.Bracket1
    case 'BRACKET_2':
      return TaxBracketAction.Bracket2
    default:
      return null
  }
}
