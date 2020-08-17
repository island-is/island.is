import { Field, InputType } from '@nestjs/graphql'
import { IsOptional, IsString } from 'class-validator'

@InputType()
export class GetAdgerdirFrontpageInput {
  @Field()
  @IsString()
  lang: string
}
