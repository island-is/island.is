import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType('UnversityCareersInstitution')
export class Institution {
  @Field(() => String)
  id!: string

  @Field(() => String, { nullable: true })
  displayName?: string

  @Field(() => String, { nullable: true })
  logoUrl?: string
}
