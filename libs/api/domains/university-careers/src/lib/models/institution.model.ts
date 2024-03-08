import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType('UnversityCareersInstitution')
export class Institution {
  @Field(() => String)
  id!: string

  @Field(() => String)
  displayName!: string
}
