import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class DeleteIndictmentCountResponse {
  @Field()
  deleted!: boolean
}
