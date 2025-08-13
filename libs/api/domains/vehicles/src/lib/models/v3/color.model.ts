import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('VehiclesColor')
export class Color {
  @Field()
  code!: string

  @Field()
  name!: string
}
