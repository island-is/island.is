import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType('IcelandicGovernmentInstitutionsMinistry')
export class Ministry {
  @Field(() => ID)
  code!: string

  @Field()
  name!: string
}
