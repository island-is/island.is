import { Field, InputType } from '@nestjs/graphql'
import { IsUUID } from 'class-validator'

@InputType()
export class FindEndorsementListInput {
  @Field()
  @IsUUID(4)
  listId!: string
}
