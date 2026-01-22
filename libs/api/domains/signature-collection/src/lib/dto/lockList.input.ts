import { IsBoolean } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'
import { SignatureCollectionListIdInput } from './listId.input'

@InputType()
export class SignatureCollectionLockListInput extends SignatureCollectionListIdInput {
  @Field(() => Boolean, { defaultValue: true })
  @IsBoolean()
  setLocked!: boolean
}
