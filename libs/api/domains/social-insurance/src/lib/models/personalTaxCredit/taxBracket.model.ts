import { Field, ObjectType } from '@nestjs/graphql'
import { TaxBracketAction } from '../../enums/taxBracketAction'

@ObjectType('SocialInsurancePersonalTaxCreditTaxBracket')
export class PersonalTaxCreditTaxBracket {
  @Field(() => TaxBracketAction, {
    description: 'The currently selected tax bracket',
  })
  value!: TaxBracketAction
}
