import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class GetProjectParentSubpageInput {
  @Field()
  @IsString()
  slug!: string

  @Field()
  @IsString()
  projectPageSlug!: string

  @Field(() => String)
  @IsString()
  lang = 'is-IS'
}
