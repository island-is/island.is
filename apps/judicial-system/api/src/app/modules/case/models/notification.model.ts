import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'

import { NotificationType } from '@island.is/judicial-system/types'

registerEnumType(NotificationType, { name: 'NotificationType' })

@ObjectType()
export class Recipient {
  @Field({ nullable: true })
  address?: string

  @Field({ nullable: true })
  success?: boolean
}

@ObjectType()
export class Notification {
  @Field(() => ID)
  readonly id!: string

  @Field({ nullable: true })
  readonly created?: string

  @Field({ nullable: true })
  readonly caseId?: string

  @Field(() => NotificationType, { nullable: true })
  readonly type?: NotificationType

  @Field(() => [Recipient], { nullable: true })
  readonly recipients?: Recipient[]
}
