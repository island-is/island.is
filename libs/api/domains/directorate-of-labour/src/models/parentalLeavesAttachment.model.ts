import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ParentalLeavesAttachment {
  @Field(() => String)
  attachmentType!: string

  @Field(() => String)
  attachmentBytes!: string
}
