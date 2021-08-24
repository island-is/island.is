import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class GetSupportQNAsInCategoryInput {
  @Field(() => String)
  @IsString()
  lang: string = 'is-IS'

  @Field(() => String)
  @IsString()
  slug!: string
}
