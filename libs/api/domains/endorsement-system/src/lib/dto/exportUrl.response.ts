import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ExportUrlResponse {
  @Field(() => String)
  url!: string
}
