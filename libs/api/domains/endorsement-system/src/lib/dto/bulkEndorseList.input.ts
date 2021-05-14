import { Field, InputType } from '@nestjs/graphql'
import { IsString, IsUUID } from 'class-validator'

@InputType()
export class BulkEndorseListInput {
  @Field()
  @IsUUID(4)
  listId!: string

  @Field(() => [String])
  @IsString({ each: true })
  nationalIds!: string[]
}
