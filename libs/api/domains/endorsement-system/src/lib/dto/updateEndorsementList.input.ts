import { Field, InputType, PickType } from '@nestjs/graphql'
import { IsUUID } from 'class-validator'
import { CreateEndorsementListDto } from './createEndorsementList.input'

@InputType()
export class UpdateEndorsementListDto extends PickType(CreateEndorsementListDto, ['title', 'description', 'openedDate', 'closedDate'] as const) {}

@InputType()
export class UpdateEndorsementListInput {
  @Field()
  @IsUUID(4)
  listId!: string

  @Field(() => UpdateEndorsementListDto)
  endorsementList!: UpdateEndorsementListDto
}
