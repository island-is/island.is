import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class GetAllFilesResponse {
  @Field()
  readonly success!: boolean
}
