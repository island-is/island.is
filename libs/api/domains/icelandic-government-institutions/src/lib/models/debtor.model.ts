import { Field, ID, Int, ObjectType } from '@nestjs/graphql'

@ObjectType('IcelandicGovernmentInstitutionsDebtor')
export class Debtor {
  @Field(() => Int, {
    description: 'ERP legal entity ID of the debtor, used to identify it',
  })
  erpLegalEntityId!: number

  @Field(() => ID, {
    nullable: true,
    description:
      'Legal ID (kennitala) of the debtor. May be hidden for confidential debtors',
  })
  legalId?: string

  @Field()
  name!: string
}
