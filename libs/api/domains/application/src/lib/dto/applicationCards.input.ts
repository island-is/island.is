import { Field, InputType, PartialType } from '@nestjs/graphql'
import { IsOptional } from 'class-validator'

@InputType()
class FiltersInput {
  @Field(() => [String], { nullable: true })
  @IsOptional()
  typeId?: string[]

  @Field(() => [String], { nullable: true })
  @IsOptional()
  status?: string[]

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  scopeCheck?: boolean
}

@InputType()
export class ApplicationCardsInput extends PartialType(FiltersInput) {}
