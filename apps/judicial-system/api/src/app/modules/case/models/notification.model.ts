import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'

import { NotificationType } from '@island.is/judicial-system/types'

registerEnumType(NotificationType, { name: 'NotificationType' })

@ObjectType()
export class Recipient {
  @Field(() => String, { nullable: true })
  address?: string

  @Field(() => Boolean, { nullable: true })
  success?: boolean
}

@ObjectType()
export class Notification {
  @Field(() => ID)
  readonly id!: string

  @Field(() => String, { nullable: true })
  readonly created?: string

  @Field(() => ID, { nullable: true })
  readonly caseId?: string

  @Field(() => NotificationType, { nullable: true })
  readonly type?: NotificationType

  @Field(() => [Recipient], { nullable: true })
  readonly recipients?: Recipient[]
}
