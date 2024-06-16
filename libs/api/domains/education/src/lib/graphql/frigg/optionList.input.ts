import { Allow } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class FriggOptionListInput {
  @Allow()
  @Field()
  readonly type!: string
}
