import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('VehiclesRegistration')
export class Registration {
  @Field()
  number!: string

  @Field({ nullable: true })
  code?: string

  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  subName?: string
}
