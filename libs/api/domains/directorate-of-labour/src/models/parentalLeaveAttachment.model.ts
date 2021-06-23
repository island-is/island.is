import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ParentalLeaveAttachment {
  @Field(() => String)
  attachmentType!: string

  @Field(() => String)
  attachmentBytes!: string
}
