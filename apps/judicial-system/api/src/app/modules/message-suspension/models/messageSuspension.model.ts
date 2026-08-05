import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql'

import { MessageSuspensionCategory } from '@island.is/judicial-system/types'

registerEnumType(MessageSuspensionCategory, {
  name: 'MessageSuspensionCategory',
})

@ObjectType()
export class MessageSuspension {
  @Field(() => MessageSuspensionCategory)
  readonly category!: MessageSuspensionCategory

  @Field(() => Boolean)
  readonly suspended!: boolean

  @Field(() => Int)
  readonly delaySeconds!: number

  @Field(() => String, { nullable: true })
  readonly modified?: string

  @Field(() => String, { nullable: true })
  readonly modifiedBy?: string
}
