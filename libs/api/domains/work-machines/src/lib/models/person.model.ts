import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('WorkMachinesEntity')
export class Entity {
  @Field()
  name!: string

  @Field({ nullable: true })
  nationalId?: string

  @Field({ nullable: true })
  number?: string

  @Field({ nullable: true })
  address?: string

  @Field({ nullable: true })
  postcode?: string
}
