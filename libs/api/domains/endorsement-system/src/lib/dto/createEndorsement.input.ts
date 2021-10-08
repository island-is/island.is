import { Field, InputType } from '@nestjs/graphql'
import { IsUUID, IsBoolean } from 'class-validator'

class EndorsementDto {
  @Field()
  @IsBoolean()
  showName!: boolean
}

@InputType()
export class CreateEndorsementInput {
  @Field()
  @IsUUID(4)
  listId!: string

  @Field()
  endorsementDto!: EndorsementDto
}
