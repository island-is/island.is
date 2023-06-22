import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class EndorsementMetadata {
  @Field({ nullable: true })
  fullName?: string

  @Field({ nullable: true })
  locality?: string
}
