import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class PresignedUrlResponse {
  @Field()
  url!: string
}
