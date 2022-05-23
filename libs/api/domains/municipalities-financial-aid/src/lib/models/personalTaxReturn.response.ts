import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
class PersonalTaxReturn {
  @Field(() => String)
  key!: string

  @Field(() => String)
  name!: string

  @Field(() => Number)
  size!: number
}

@ObjectType('MunicipalitiesFinancialAidPersonalTaxReturnResponse')
export class PersonalTaxReturnResponse {
  @Field(() => PersonalTaxReturn, { nullable: true })
  personalTaxReturn?: PersonalTaxReturn
}
