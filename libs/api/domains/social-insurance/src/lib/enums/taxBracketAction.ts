import { registerEnumType } from '@nestjs/graphql'

export enum TaxBracketAction {
  INCOME_PLAN = 'INCOME_PLAN',
  BRACKET_1 = 'BRACKET_1',
  BRACKET_2 = 'BRACKET_2',
}

registerEnumType(TaxBracketAction, {
  name: 'SocialInsuranceTaxBracketAction',
})
