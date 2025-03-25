import { InputType, Field } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType('DocumentConfirmActionsInput')
export class DocumentConfirmActionsInput {
  @Field()
  @IsString()
  readonly id!: string

  @Field(() => Boolean, { nullable: true })
  readonly confirmed?: boolean

  @Field(() => [String], { nullable: true })
  readonly actions?: string[]
}
