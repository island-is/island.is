import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class GetSupportFormInOrganizationInput {
  @Field(() => String)
  @IsString()
  lang = 'is-IS'

  @Field(() => String)
  @IsString()
  slug!: string
}
