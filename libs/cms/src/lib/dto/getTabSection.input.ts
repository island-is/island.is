import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class GetTabSectionInput {
  @Field(() => String)
  @IsString()
  lang = 'is-IS'

  @Field()
  @IsString()
  id!: string
}
