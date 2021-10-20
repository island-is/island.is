import { Field, InputType } from '@nestjs/graphql'
import { IsDateString, IsUUID } from 'class-validator'

@InputType()
export class changeEndorsmentListClosedDateDto {
  @Field()
  @IsDateString()
  closedDate!: Date
}
@InputType()
export class OpenListInput {
  @Field()
  @IsUUID(4)
  listId!: string
  @Field()
  changeEndorsmentListClosedDateDto!: changeEndorsmentListClosedDateDto
}
