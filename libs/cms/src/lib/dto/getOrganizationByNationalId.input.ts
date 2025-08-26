import { Field, InputType } from '@nestjs/graphql'
import { IsOptional, IsString } from 'class-validator'

@InputType()
export class GetOrganizationByNationalIdInput {
  @Field(() => String)
  @IsOptional()
  @IsString()
  nationalId?: string

  @Field(() => String)
  @IsString()
  lang = 'is-IS'
}
