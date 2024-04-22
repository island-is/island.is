import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class RegistryPerson {
  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  nationalId?: string

  @Field({ nullable: true })
  address?: string

  @Field({ nullable: true })
  postalCode?: string

  @Field({ nullable: true })
  city?: string
}
