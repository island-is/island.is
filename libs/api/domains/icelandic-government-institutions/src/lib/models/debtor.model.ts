import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType('IcelandicGovernmentInstitutionsDebtor')
export class Debtor {
  @Field(() => ID, { description: 'Legal ID (kennitala) of the debtor' })
  id!: string

  @Field()
  name!: string
}
