import type { Year } from '@island.is/regulations'
import { Field, InputType, Int } from '@nestjs/graphql'
import { IsNumber, IsOptional, Max, Min } from 'class-validator'

@InputType()
export class GetRegulationsSearchInput {
  /** Query string (free-form text search) */
  @Field({ nullable: true })
  @IsOptional()
  q?: string

  /** Ministry slug */
  @Field({ nullable: true })
  @IsOptional()
  rn?: string

  /** LawChapter slug */
  @Field({ nullable: true })
  @IsOptional()
  ch?: string

  /** Year (or starting Year in a year-range) */
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(1900)
  @Max(2150)
  year?: Year

  /** Ending Year in a year-range. Ignored if `year` is missing */
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(1900)
  @Max(2150)
  yearTo?: Year

  /** Include regulations of type "amending" (Breytingareglugerðir)  */
  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  iA?: boolean

  /** Include regulations that have been "replealed" (Brottfelldar reglugerðir)  */
  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  iR?: boolean

  /** 1-based page number. (default: 1)  */
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @Min(0)
  @Max(1000)
  page?: number
}
