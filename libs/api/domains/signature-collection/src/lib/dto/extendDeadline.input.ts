import { IsDate } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'
import { SignatureCollectionListIdInput } from './listId.input'

@InputType()
export class SignatureCollectionExtendDeadlineInput extends SignatureCollectionListIdInput {
  @Field(() => Date)
  @IsDate()
  newEndDate!: Date
}
