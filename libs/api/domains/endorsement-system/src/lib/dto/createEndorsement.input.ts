import { Field, InputType } from '@nestjs/graphql'
import { IsUUID, IsBoolean } from 'class-validator'
import { EndorsementInput } from './endorsement.input'

@InputType()
export class CreateEndorsementInput {
  @Field()
  @IsUUID(4)
  listId!: string

  @Field()
  endorsementDto!: EndorsementInput
}
