import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class GetOrganizationByNationalIdInput {
  @Field(() => String)
  @IsString()
  nationalId?: string

  @Field(() => String)
  @IsString()
  lang = 'is-IS'
}
