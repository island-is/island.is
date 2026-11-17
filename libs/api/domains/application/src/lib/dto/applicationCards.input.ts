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

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  showPruned?: boolean

  @Field(() => Boolean, {
    nullable: true,
    description:
      'Exclude applications whose current state sets lifecycle.hideFromApplicationSystemOverview. Intended for the application overview (/umsoknir/:type), not my pages.',
  })
  @IsOptional()
  excludeHiddenFromApplicationSystemOverview?: boolean
}

@InputType()
export class ApplicationCardsInput extends PartialType(FiltersInput) {}
