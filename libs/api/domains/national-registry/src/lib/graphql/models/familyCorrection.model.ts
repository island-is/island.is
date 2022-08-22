import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class FamilyCorrectionResponse {
  @Field()
  success!: boolean

  @Field()
  message?: string
}
