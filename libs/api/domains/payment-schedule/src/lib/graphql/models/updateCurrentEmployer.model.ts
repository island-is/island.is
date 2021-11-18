import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class UpdateCurrentEmployerResponse {
  @Field(() => Boolean)
  success!: boolean
}
