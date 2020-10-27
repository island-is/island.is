import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class GetOpenApiInput {
  @Field()
  @IsString()
  instance: string

  @Field()
  @IsString()
  memberClass: string

  @Field()
  @IsString()
  memberCode: string

  @Field()
  @IsString()
  subsystemCode: string

  @Field()
  @IsString()
  serviceCode: string
}
