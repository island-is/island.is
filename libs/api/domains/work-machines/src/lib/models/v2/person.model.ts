import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('WorkMachinesPerson')
export class Person {
  @Field({ nullable: true })
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
