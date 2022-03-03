import { Field, InputType } from '@nestjs/graphql'
import { IsNumber, IsOptional } from 'class-validator'

@InputType()
export class GetHomestaysInput {
  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  year?: number
}
