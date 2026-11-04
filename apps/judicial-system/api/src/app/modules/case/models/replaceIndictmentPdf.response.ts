import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ReplaceIndictmentPdfResponse {
  @Field(() => Boolean)
  success!: boolean
}
