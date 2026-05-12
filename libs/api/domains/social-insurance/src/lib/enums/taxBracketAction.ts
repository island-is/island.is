import { registerEnumType } from '@nestjs/graphql'

export enum TaxBracketAction {
  IncomePlan = 'INCOME_PLAN',
  Bracket1 = 'BRACKET_1',
  Bracket2 = 'BRACKET_2',
}

registerEnumType(TaxBracketAction, {
  name: 'SocialInsuranceTaxBracketAction',
})
