import { Field, ObjectType, ID } from '@nestjs/graphql'

import {
  ApplicationEvent,
  ApplicationEventType,
} from '@island.is/financial-aid/shared'

@ObjectType()
export class ApplicationEventModel implements ApplicationEvent {
  @Field(() => ID)
  readonly id!: string

  @Field()
  readonly created!: string

  @Field()
  readonly applicationId!: string

  @Field({ nullable: true })
  readonly comment?: string

  @Field({ nullable: true })
  readonly amount?: number

  @Field({ nullable: true })
  readonly staffComment?: string

  @Field(() => String)
  readonly eventType!: ApplicationEventType
}
