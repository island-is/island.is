import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType('IcelandicGovernmentInstitutionsMinistry')
export class Ministry {
  @Field(() => ID)
  id!: string

  @Field()
  name!: string
}
