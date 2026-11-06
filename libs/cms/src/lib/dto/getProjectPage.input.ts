import { Field, InputType } from '@nestjs/graphql'
import { IsOptional, IsString } from 'class-validator'

@InputType()
export class GetProjectPageInput {
  @Field()
  @IsString()
  slug!: string

  @Field(() => String)
  @IsString()
  lang = 'is-IS'

  // Decides which subpage is returned in `projectSubpages`, which is empty if this is left out
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  subpageSlug?: string | null
}
