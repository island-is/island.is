import { IsNumber, IsOptional } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class GetHomestaysInput {
  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  year?: number
}
