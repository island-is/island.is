import { Field, InputType } from '@nestjs/graphql'
import {
  IsOptional,
  IsString,
} from 'class-validator'

@InputType()
export class GetNewsDatesInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  lang?: string
}
