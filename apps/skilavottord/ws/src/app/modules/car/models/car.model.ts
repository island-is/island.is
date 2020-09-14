import { Field, ObjectType, ID } from '@nestjs/graphql'

@ObjectType()
export class Car {
  constructor(id: string, name: string, model: string, color: string) {
    this.id = id
    this.name = name
    this.model = model 
    this.color = color
  }

  @Field((_1) => ID)
  id: string

  @Field()
  name: string

  @Field()
  model: string

  @Field()
  color: string
}
