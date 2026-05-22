import { TaxBracketAction } from '../enums/taxBracketAction'

export const parseTaxBracketAction = (
  value?: string | null,
): TaxBracketAction | null => {
  switch (value) {
    case 'INCOME_PLAN':
      return TaxBracketAction.INCOME_PLAN
    case 'BRACKET_1':
      return TaxBracketAction.BRACKET_1
    case 'BRACKET_2':
      return TaxBracketAction.BRACKET_2
    default:
      return null
  }
}
