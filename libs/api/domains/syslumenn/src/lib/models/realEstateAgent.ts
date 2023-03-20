import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class RealEstateAgent {
  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  location?: string
}
