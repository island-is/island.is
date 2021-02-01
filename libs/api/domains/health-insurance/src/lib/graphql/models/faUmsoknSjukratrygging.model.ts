import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class UmsoknirModel {
  @Field(() => Number)
  skjalanumer!: number

  @Field(() => Number)
  stada!: number
}
