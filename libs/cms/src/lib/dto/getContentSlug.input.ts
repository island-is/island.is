import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class GetContentSlugInput {
  @Field()
  @IsString()
  id!: string // checked against in LanguageToggler.tsx
}
