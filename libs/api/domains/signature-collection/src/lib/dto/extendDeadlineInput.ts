import { IsDate } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'
import { SignatureCollectionIdInput } from './id.input'

@InputType()
export class SignatureCollectionExtendDeadlineInput extends SignatureCollectionIdInput {
  @Field(() => Date)
  @IsDate()
  newEndDate!: Date
}
