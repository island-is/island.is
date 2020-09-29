import { Field, ObjectType, ID } from '@nestjs/graphql'

@ObjectType()
export class Car {
  constructor(
    id: string,
    name: string,
    model: string,
    color: string,
    year: string,
    recyclable: boolean,
  ) {
    this.id = id
    this.name = name
    this.model = model
    this.color = color
    this.year = year
    this.recyclable = recyclable
  }

  @Field((_1) => ID)
  id: string

  @Field()
  name: string

  @Field()
  model: string

  @Field()
  color: string

  @Field()
  year: string

  @Field()
  recyclable: boolean
}
