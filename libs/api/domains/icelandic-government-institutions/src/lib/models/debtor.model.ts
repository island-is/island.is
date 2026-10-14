import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType('IcelandicGovernmentInstitutionsDebtor')
export class Debtor {
  @Field(() => ID)
  id!: string

  @Field(() => String, {
    nullable: true,
    description:
      'Legal ID (kennitala) of the debtor. May be hidden for confidential debtors',
  })
  legalId?: string

  @Field()
  name!: string
}
