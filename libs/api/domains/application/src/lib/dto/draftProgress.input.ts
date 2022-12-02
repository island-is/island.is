import { InputType, Field } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class DraftProgressInput {
  @Field(() => Number)
  @IsString()
  stepsFinished!: number

  @Field(() => Number)
  @IsString()
  totalSteps!: number
}
