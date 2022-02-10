import { Field, InputType } from '@nestjs/graphql'
import { IsDate, IsOptional } from 'class-validator'

@InputType()
export class IsHealthInsuredInput {
  @Field({ nullable: true })
  @IsDate()
  @IsOptional()
  date?: Date
}
