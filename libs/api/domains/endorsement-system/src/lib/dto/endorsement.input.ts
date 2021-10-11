import { Field, InputType } from '@nestjs/graphql'
import { IsBoolean } from 'class-validator'

@InputType()
export class EndorsementInput {
  @Field()
  @IsBoolean()
  showName!: boolean
}