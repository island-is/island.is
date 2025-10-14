import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('IcelandicGovernmentJobLocation')
export class Location {
  @Field()
  address!: string

  @Field({ nullable: true })
  description?: string

  @Field({ nullable: true })
  postalCode?: string
}
