import { Field, ObjectType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@ObjectType('DocumentConfirmActions')
export class DocumentConfirmActions {
  @Field()
  @IsString()
  readonly id!: string

  @Field(() => Boolean, { nullable: true })
  readonly confirmed?: boolean
}
