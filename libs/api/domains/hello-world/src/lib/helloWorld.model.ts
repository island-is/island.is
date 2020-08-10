import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class HelloWorld {
  @Field()
  message: string
}
